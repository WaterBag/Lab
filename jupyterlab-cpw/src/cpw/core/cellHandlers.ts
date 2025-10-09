// import type { Graph, Node } from '@antv/x6'
import { cloneFnJSON } from '@vueuse/core'

export const paramValidator = (config: CPW.CellParam) => {
  const { value, type, options, required } = config
  // 确保opt值合法
  if (type === 'opt' && value) return !!options?.some(opt => opt.value === value)
  if (!required) return true

  if (type === 'str' || type === 'opt') return !!value
  if (type === 'num') return typeof value === 'number'
  return true
}

// * ------------- 组件输入、参数处理 --------------------
export const formatCellParams = (configs: CPW.CellParamConfig[], currParams?: CPW.CellParam[]): CPW.CellParam[] => {
  const currValueMap = new Map<string, CPW.CellParam['value']>()
  // 以name|type为key，当更新配置要保留旧值的时候，根据变量名和类型匹配旧值
  currParams?.forEach(o => currValueMap.set(`${o.name}|${o.type}`, o.value))

  return configs.map(cfg => {
    const { type, name, desc, required, options, label } = cfg

    const _default = cfg.default ?? null

    let value = _default

    const oldValueKey = `${name}|${type}`
    if (currValueMap.has(oldValueKey)) {
      const oldValue = currValueMap.get(oldValueKey)
      if (type === 'opt') {
        if (options?.some(o => o.value === oldValue)) value = oldValue!
      }
      else {
        value = oldValue!
      }
    }
    else if (type === 'bool') {
      value = !!value
    }

    return {
      type,
      name,
      label,
      desc,
      required,
      value,
      default: _default,
      ...(options && { options: cloneFnJSON(options) }),
    }
  })
}

export const formatCellIncomes = (configs: CPW.CellIncomeConfig[], currIncomes?: CPW.CellIncome[]): CPW.CellIncome[] => {
  const currValueMap = new Map<string, string>()
  currIncomes?.forEach(o => currValueMap.set(o.name, o.value))

  return configs.map(o => ({
    ...o,
    value: currValueMap.has(o.name) ? currValueMap.get(o.name)! : '',
  }))
}

export const formatCellOutgos = (configs: CPW.CellOutgoConfig[]): CPW.CellOutgo[] => {
  return configs.map(o => ({ ...o }))
}

// * ----------- 流水线运行解析 ----------
export const cellValidator = ({ id, params, incomes }: CPW.Cell) => {
  const pass = incomes.every(ic => ic.required ? ic.value : true) && params.every(pc => paramValidator(pc))
  if (!pass) window.dispatchEvent(new CustomEvent(`cpw-cell-error-${id}`, { detail: true }))
  return pass
}

const pid = (id: string) => id.replace(/-/g, '_')

const placeholderReg = /\{\{(.*?)\}\}/g
const nameReg = /^\{\{|\}\}$/g

export const parseCodePlaceholders = (code: string) => {
  const matches = code.match(placeholderReg) || []
  return matches.map(match => ({ placeholder: match, name: match.replace(nameReg, '').trim() }))
}

/**
 * 处理组件运行代码
 *
 * 组件包裹函数名为__cpw_${id}_func
 * 组件运行结果存储在__cpw_${id}_res
 */
export const wrapRunnerCode = (cpwCell: CPW.Cell) => {
  const { id: _id, incomes, outgos, params, source, type /* , name */ } = cpwCell

  const id = pid(_id)

  if (type === 'condition') {
    const [fromId, fromName] = incomes[0].value.split('|')
    // 直接设置一个全局值
    return `__cpw_${id}_condition = bool(__cpw_${pid(fromId)}_res['${fromName}'])
print(__cpw_${id}_condition)`
  }

  // 包在函数里，要加一级缩进
  let sourceCode = source.split('\n').map(str => '    ' + str).join('\n')

  const incomeParams = incomes.map(({ name }) => name).join(', ')

  let incomeArgs = incomes
    .map(o => {
      if (!o.value) return 'None' // 输入值没有选择则传入None
      const [fromId, fromName] = o.value.split('|')
      return `__cpw_${pid(fromId)}_res['${fromName}']`
    })
    .join(',\n    ') // 避免单行代码过长，传参使用换行

  if (incomeArgs) incomeArgs = '\n    ' + incomeArgs + '\n'

  const outgoReturns = outgos.length
    ? '    return { ' + outgos.map(({ name }) => `'${name}': ${name}`).join(', ') + ' }'
    : ''

  const excute = outgos.length
    ? `__cpw_${id}_res = __cpw_${id}_func(${incomeArgs})`
    : `__cpw_${id}_func(${incomeArgs})`

  const outgoRenders = outgos.map(({ name }) => `IPython.display.display(__cpw_${id}_res['${name}'])`).join('\n')

  const paramsMap = new Map<string, string>()

  params.forEach(param => {
    let v = 'None'
    // parasMap[param.name] = param.value
    switch (param.type) {
      case 'bool':
      // bool类型不会留空
        v = param.value ? 'True' : 'False'
        break
      case 'opt':
      case 'str':
        if (!param.value) v = 'None' // 留空时为None
        else v = param.value as string
        break
      case 'num':
        if (typeof param.value !== 'number' || Number.isNaN(param.value)) v = 'None' // 非法值、留空时为None
        else v = param.value + ''
    }
    paramsMap.set(param.name, v)
  })

  parseCodePlaceholders(source).forEach(({ placeholder, name }) => {
    sourceCode = sourceCode.replace(
      new RegExp(placeholder, 'g'),
      paramsMap.has(name) ? paramsMap.get(name)! : '', // 如果没有找到对应的参数值，则替换为空字符串，跟和鲸一样
    )
  })

  // 旧的参数注入方式暂时保留
  // const paramDeclares = params.map(param => {
  //   let v = 'None'

  //   switch (param.type) {
  //   case 'bool':
  //     // bool类型不会留空
  //     v = param.value ? 'True' : 'False'
  //     break
  //   case 'opt':
  //   case 'str':
  //     if (!param.value) v = 'None' // 留空时为None
  //     else v = `'${param.value}'` // 字符串和选项类型自动包裹引号，无需像和鲸一样得用户给参数值包裹引号
  //     break
  //   case 'num':
  //     if (typeof param.value !== 'number' || Number.isNaN(param.value)) v = 'None' // 非法值、留空时为None
  //     else v = param.value + ''
  //   }
  //   return `    ${param.name} = ${v}`
  // }).join('\n')

  // eslint-disable-next-line style/operator-linebreak
  const code =
`def __cpw_${id}_func(${incomeParams}):

${sourceCode}
${outgoReturns}
${excute}
${outgoRenders}`
// '组件 ${name} 执行完毕'` // 最后一行暂时不要，因为发现excute_count区分不了组件

  return code
}
