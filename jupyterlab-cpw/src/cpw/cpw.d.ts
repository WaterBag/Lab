declare namespace CPW {

  /** .cpw文件的JSON模型 */
  interface FileSchema {
    cells: import('@antv/x6').Cell.Properties[]
  }

  /** 组件参数 */
  interface CellParam {
    /** 参数类型 */
    type: 'str' | 'num' | 'bool' | 'opt'
    /**
     * 参数值，在画布上创建组件时填充，创建后可修改组件参数值
     * 如果有默认值将填充默认值
     * 如果参数可留空，则空时的值为null
     */
    value: string | number | boolean | null
    /**
     * 参数默认值
     * str、num、opt类型非必选时，若无值，py运行时则会是None，不会是空字符串（跟和鲸一样）
     * bool类型固定必须，只有true或false
     */
    default: string | number | boolean | null
    /**
     * 是否必选
     * bool类型固定必选，会忽略本字段逻辑
     */
    required: boolean
    /** 参数的变量名 */
    name: string
    /** 参数名称 */
    label: string
    /** 参数描述 */
    desc: string
    /** option类型时必须要有options字段 */
    options?: { label: string, value: string }[]
  }

  /** 组件参数配置 */
  type CellParamConfig = Omit<CellParam, 'value'>

  /** 组件输入配置 */
  interface CellIncomeConfig {
    /** 输入值在本组件内使用的变量名 */
    name: string
    /** 输入名称 */
    label: string
    /** 是否必选 */
    required: boolean
    /** 输入描述 */
    desc: string
  }

  /** 组件输入 */
  interface CellIncome extends CellIncomeConfig {
    /**
     * 用字符串值表示输入
     * 格式为 目标前序节点id|目标前序节点输出变量名
     * fromID|fromName
     */
    value: string
    // /** 目标前序节点id */
    // fromId: string
    // /** 目标前序节点的输出变量名 */
    // fromName: string
    // /** 输入描述 */
    // desc: string
    // /** 输入值在本组件内使用的变量名 */
    // name: string
  }

  /** 组件输出配置 */
  interface CellOutgoConfig {
    /** 组件输出变量名 */
    name: string
    /** 输出名称 */
    label: string
    /** 描述 */
    desc: string
  }

  interface CellOutgo extends CellOutgoConfig {}

  interface CellCommon {
    /** 组件名称 */
    name: string

    /** 组件唯一key，也就是左侧组件dnd里源组件key */
    key: number

    /** 组件描述说明 */
    desc: string

    /** 节点源代码 */
    source: string

    // todo 增加text类型，用于展示文本内容，不需要运行
    /** 节点类型 */
    type: 'common' | 'condition'
  }

  interface Cell extends CellCommon {
    /** 组件内部id，由graph自动生成的id保持一致 */
    id: string

    /** 输出 */
    outputs: import('@jupyterlab/nbformat').IOutput[]

    /**
     * - running 运行中
     * - error 运行结果错误
     * - done 成功，运行结果正常
     * - changed 修改了组件代码内容或参数，但未重新执行
     * - waiting 在本次运行的workflow线中，正在等待执行
     */
    status: 'running' | 'error' | 'done' | 'changed' | 'waiting'

    /** 当前组件是否被选中，整个workflow仅有一个cell会active */
    active: boolean

    /** 保存运行后的outputArea渲染节点 */
    node?: HTMLElement

    /** 组件参数 */
    params: CellParam[]

    /** 组件输入 */
    incomes: CellIncome[]

    /** 组件输出 */
    outgos: CellOutgo[]
  }

  interface RunnerCell {
    /** 和Cell的id一致 */
    readonly id: string
    /** 运行workflow时，把source处理后交由内核实际运行的代码，也是导出ipynb的实际代码 */
    readonly code: string
    /** 本次运行时组件的层级 */
    readonly level: number
  }

  interface CellComponent extends CellCommon {
    /** 对应category的id */
    category: string
    // bookmark: boolean
    /** 组件参数配置 */
    paramsConfig: CPW.CellParamConfig[]
    /** 组件输入配置 */
    incomesConfig: CPW.CellIncomeConfig[]
    /** 组件输出配置 */
    outgosConfig: CPW.CellOutgoConfig[]
    /**
     * - common 内置组件
     * - custom 用户创建的组件
     */
    genre: 'common' | 'custom'
  }

  interface CellCategory {
    id: string
    name: string
    children: CellComponent[]
  }

  /**
   * 运行类型
   * - all 运行所有
   * - to-current 运行至所选节点
   * - single 运行单个节点
   */
  type RunType = 'all' | 'to-current' | 'single'

  // *-------------------- 从vue应用内调用的action -----------------------

  type ActionType = 'exportIpynb' | 'change' | 'save' | 'kernelChange' | 'setCurrentEditor'

  interface ActionPayloadData {
    exportIpynb: null
    change: { content: string }
    save: null
    kernelChange: null
    setCurrentEditor: { editor: import('@jupyterlab/codemirror').CodeMirrorEditor | null }
  }

  // type ActionPayload<T extends ActionType> = { type: T } & (ActionPayloadData[T] extends null ? { data?: any } : { data: ActionPayloadData[T] })
  interface ActionPayload<T extends ActionType> {
    type: T
    data: ActionPayloadData[T]
  }

  /** 从vue应用内向jupyter插件widget发起的操作事件 */
  interface DispatchAction {
    /** 导出为ipynb文件（notebook） */
    (id: string, payload: ActionPayload<'exportIpynb'>): any
    /** 内容更改，传输最新的fileContent给widget保存到context.model中 */
    (id: string, payload: ActionPayload<'change'>): any
    /** 保存文件 */
    (id: string, payload: ActionPayload<'save'>): any
    /** 打开内核切换dialog */
    (id: string, payload: ActionPayload<'kernelChange'>): any
    /** 设置当前打开的代码编辑器, 用于lsp */
    (id: string, payload: ActionPayload<'setCurrentEditor'>): any
  }

  // *------------------- 从jupyter插件widget往vue应用派发的事件 ----------------

  type EventType = 'dispose'

  interface EventPayloadData {
    dispose: null
  }

  interface EventPayload<T extends EventType> {
    type: T
    data: EventPayloadData[T]
  }

  /** 从jupyter插件widget往vue应用派发事件 */
  interface DispatchEvent {
    /** widget在dispose时派发 */
    (id: string, payload: EventPayload<'dispose'>): any
  }
}
