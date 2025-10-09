import type { Graph, Node } from '@antv/x6'
import type { ISessionContext } from '@jupyterlab/apputils'
import { cellValidator, wrapRunnerCode } from './cellHandlers'
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime'
import { showErrorMessage } from '@jupyterlab/apputils'
import { MessagePlugin } from 'tdesign-vue-next'
import { CPW_NODE_SHAPE } from './Graph'
import { newOutputArea } from './utils'

const envCode = `
import IPython
`

interface RunnerPayload {
  // 因为涉及到activeCell的更新逻辑，所以使用传入的更新函数，而不是直接对cell进行setData
  updateCellData: (target: string | Node, data: Partial<CPW.Cell>, save?: boolean) => void
  sessionContext: ISessionContext
  renderMimeRegistry: IRenderMimeRegistry
}

// todo 需要记录某次执行是否已经完成，如果在执行中，则不允许开启新的执行任务

const runFromRoots = async ({ allNodes, graph, sessionContext, updateCellData, renderMimeRegistry }: RunnerPayload & { allNodes: Node[], graph: Graph }) => {
  allNodes.forEach(node => updateCellData(node, { status: 'changed' })) // 重置整个树的状态
  let hasErr = false
  allNodes.forEach(node => { if (!cellValidator(node.getData<CPW.Cell>())) hasErr = true })
  if (hasErr) {
    showErrorMessage('运行失败', '请补充运行组件必填的参数和输入')
    return
  }
  /**
   * 找出本次执行的所有起始组件
   * 1. 有多少个起始组件就有多少个细分执行分支
   * 2. 每个细分执行分支的结束位置是多个细分执行分支的共同子组件，也就是分支收束处
   * 3. 某个细分执行分支如果出现错误，或者条件判断不通过，则该分支的后续组件不再执行，但其他分支继续执行
   * 4. 每个分支执行到达共同子组件后，判断共同子组件的执行条件，读取该组件的所有距离为1的前序节点
   *   * 如果有前序节点未执行完成，则不执行，直接忽略，等待其他分支执行到该组件
   *   * 如果所有前序节点执行完成，则执行该组件 (如果直接前序节点是条件判断，则还需要判断是否)
   * 5. 继续按上述逻辑执行后面的字组件，继续按顺序执行或再拆分细分执行分支，直到所有前序节点执行完成，最终执行目标组件
   * 6. 当执行目标组件后
   *   * 目标组件无后续组件，则执行完成，无需判断
   *   * 目标组件有后续组件，并且判断后续组件也是目标组件的前序组件，则表示身处回环中，继续执行后续组件
   *   * 目标组件有后续组件，但判断后续组件不是目标组件的前序组件，则表示执行完成
   *
   * 实际上不需要判断目标组件是否执行，因为在**运行至当前组件**模式中，allNodes就是目标组件的全部前序组件，必定是和目标组件有关联的，并且是从根节点开始往后执行，必定会进入目标组件的路线
   * 所以这个运行逻辑同样适用**运行全部**模式，只不过allNodes就是全部组件
   */
  const allNodeIds = allNodes.map(node => node.id)

  const rootNodes = graph.getRootNodes().filter(node => allNodeIds.includes(node.id))

  if (!rootNodes.length) {
    showErrorMessage('运行失败', '找不到起始组件')
    return
  }

  const shouldRun = (node: Node) => {
    if (!allNodeIds.includes(node.id)) return false
    // 所有直接前序组件，也就是距离为1的前序组件
    const incomeEdges = graph.getIncomingEdges(node)
    if (!incomeEdges?.length) return true

    return incomeEdges.every(edge => {
      const sourceNode = edge.getSourceNode()!
      const sourceNodeData = sourceNode.getData<CPW.Cell>()

      // 如果当前组件同样也是前序组件的前序组件，表示这两个组件在回环中，需要继续执行
      if (graph.isPredecessor(sourceNode, node)) return true

      // 如果有未执行完成，则不执行，等待其他分支执行到该组件
      if (sourceNodeData.status !== 'done') return false

      // 如果有条件判断组件，还需要确保条件判断是否满足
      if (sourceNodeData.type === 'condition') {
        const conditionRes = readCondition(sourceNodeData.outputs)
        const portId = edge.getSourcePortId()
        if (conditionRes && portId === 'condition-outgo-true') return true
        if (!conditionRes && portId === 'condition-outgo-false') return true
        return false
      }

      return true
    })
  }

  const run = async (node: Node): Promise<any> => {
    if (!shouldRun(node)) return

    const { isErr, outputs } = await excute({ sessionContext, node, renderMimeRegistry, updateCellData })

    if (isErr) return

    if (node.getData<CPW.Cell>().type === 'condition') {
      // 条件判断组件逻辑
      const portId = readCondition(outputs) ? 'condition-outgo-true' : 'condition-outgo-false'
      const nextNode = graph.getOutgoingEdges(node)?.find(edge => edge.getSourcePortId() === portId)?.getTargetNode()
      if (nextNode) return run(nextNode)
    }
    else {
      return Promise.all((graph.getOutgoingEdges(node) || []).map(edge => run(edge.getTargetNode()!)))
    }
  }

  // 每一次运行都确保执行一次import IPython
  const future = sessionContext.session!.kernel!.requestExecute({ code: envCode })
  await future.done

  for (const node of rootNodes) {
    await run(node)
  }

  // await Promise.all(rootNodes.map(node => run(node)))

  console.log('run', 'done')
}

export const runAll = async (payload: RunnerPayload & { graph: Graph }) => {
  const { graph } = payload
  const allNodes = graph.getNodes().filter(node => node.shape === CPW_NODE_SHAPE)
  await runFromRoots({ ...payload, allNodes })
}

export const runToCurrent = async (payload: RunnerPayload & { target: Node, graph: Graph }) => {
  const { target, graph } = payload
  const allNodes = (graph.getPredecessors(target) || []).concat(target) as Node[]
  await runFromRoots({ ...payload, allNodes })
}

const excute = async ({ sessionContext, node, renderMimeRegistry, updateCellData }: RunnerPayload & { node: Node }) => {
  const nodeData = node.getData<CPW.Cell>()
  const code = wrapRunnerCode(nodeData)

  updateCellData(node, { status: 'running' })

  const outputArea = newOutputArea(renderMimeRegistry)

  outputArea.future = sessionContext.session!.kernel!.requestExecute({ code })

  // 非代码错误，而是内核错误等jupyter运行错误，例如某个组件代码在执行中，用户手动重启了内核就会导致错误（中止内核不会错误导致这个错误）
  let runningErr = false
  try {
    await outputArea.future.done
  }
  catch (error: any) {
    runningErr = true
    MessagePlugin.error('运行失败: ' + error.message)
  }
  const outputs = runningErr ? [] : outputArea.model.toJSON()

  const isErr = runningErr ? true : !!outputs.find(output => output.output_type === 'error')

  updateCellData(node, { status: isErr ? 'error' : 'done', outputs, node: outputArea.node })

  outputArea.model.dispose()
  outputArea.dispose()

  return { outputs, isErr }
}

const readCondition = (outputs: CPW.Cell['outputs']) => {
  return (outputs[0].text as string)?.includes('True')
}

// * ----------------- 单个组件运行 -----------------
export const runSingle = async ({ target, sessionContext, updateCellData, renderMimeRegistry }: RunnerPayload & { target: Node }) => {
  const nodeData = target.getData<CPW.Cell>()
  if (!cellValidator(nodeData)) {
    showErrorMessage('运行失败', '请补充运行组件必填的参数和输入')
    return
  }
  // 每一次运行都确保执行一次import IPython
  const future = sessionContext.session!.kernel!.requestExecute({ code: envCode })
  await future.done

  await excute({ sessionContext, node: target as Node, renderMimeRegistry, updateCellData })
}
