<template>
  <div class="cpw-container">
    <!-- eslint-disable vue/no-v-html -->
    <Toolbar
      :left="toolbarLeft"
      :right="toolbarRight"
      :kernel-status="kernelStatus"
    />

    <div class="cpw-graph-warpper">
      <Dnd
        ref="_dndRef"
        :collapsed="dndCollapsed"
        @refresh-category="getCellCategories"
      />

      <div
        ref="_graphDom"
        class="cpw-graph"
      />

      <Cfg
        v-if="!!activeCell"
        ref="_cfgRef"
        :key="activeCell.id"
        :active-cell="activeCell"
        :get-predecessors="getPredecessors"
        :collapsed="cfgCollapsed"
        @config-changed="updateCellData"
      />

      <Outputs
        v-model:expanded="outputsVisible"
        :dnd-collapsed="dndCollapsed"
        :cfg-collapsed="activeCell ? cfgCollapsed : true"
        :active-cell="activeCell"
      />
    </div>

    <Teleport to="body">
      <div
        v-if="contextMenu.visible"
        ref="_contextMenuDom"
        class="cpw-contextmenu lm-Menu"
        :style="`--jp-border-width: 1px; left: ${contextMenu.x}px; top: ${contextMenu.y}px`"
      >
        <template
          v-for="item, i in contextMenu.items"
          :key="i"
        >
          <div
            v-if="item.divider"
            class="cpw-contextmenu-divider"
          />
          <div
            v-else
            class="cpw-contextmenu-item"
            :style="`--item-height: ${contextMenuItemHeight}px; --item-width: ${contextMenuItemWidth}px`"
            :title="item.label"
            @click="e => { item.onClick?.(e); contextMenu.visible = false }"
          >
            <div
              class="cpw-contextmenu-item-icon"
              :style="`--item-icon-size: ${Math.floor(contextMenuItemHeight * 0.67)}px`"
              v-html="btnIcons[item.icon!] || ''"
            />
            <div class="cpw-contextmenu-item-label">{{ item.label }}</div>
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-throw-literal */
import { computed, getCurrentInstance, nextTick, onMounted, provide, ref, shallowRef, useTemplateRef } from 'vue'
import { btnIcons, dispatchAction, formatFileContentLoad, formatFileContentSave, newOutputArea, type ToolbarBtn } from './utils'
import type { Graph, Node } from '@antv/x6'
import {
  type ContextMenuItem,
  contextMenuItemHeight,
  contextMenuItemWidth,
  CPW_NODE_SHAPE,
  getContextMenuPosition,
  initGraph,
} from './Graph'
import Toolbar from './Toolbar/index.vue'
import { useThrottleFn } from '@vueuse/core'
import Dnd from './Dnd/index.vue'
import Outputs from './Outputs/index.vue'
import { showErrorMessage } from '@jupyterlab/apputils'
import Cfg from './Cfg/index.vue'
import { reqCategories } from './api'
import { MessagePlugin } from 'tdesign-vue-next'
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime'
import type { ISessionContext } from '@jupyterlab/apputils'
import { runAll, runSingle, runToCurrent } from './runner'
// import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea'

const props = defineProps<{
  id: string
  fileContent: CPW.FileSchema
  renderMimeRegistry: IRenderMimeRegistry
  sessionContext: ISessionContext
}>()

provide('widgetId', props.id)

const app = getCurrentInstance()?.appContext.app

const contextMenuDom = useTemplateRef('_contextMenuDom')

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  items: [] as ContextMenuItem[],
})

const showMenu = (e: { clientX: number, clientY: number }, items: ContextMenuItem[]) => {
  contextMenu.value = {
    items,
    visible: true,
    ...getContextMenuPosition(items, { x: e.clientX, y: e.clientY }),
  }
}

const outputsVisible = ref(false)

const graphDom = useTemplateRef('_graphDom')
let graph: Graph

const dndRef = useTemplateRef('_dndRef')
const dndCollapsed = ref(false)

const cfgCollapsed = ref(false)
const cfgRef = useTemplateRef('_cfgRef')

onMounted(() => {
  graph = initGraph(graphDom.value!)
  dndRef.value!.init(graph)
  // dnd = initDnd(graph, dndDom.value!)

  graph.on('edge:removed', ({ edge }) => {
    /**
     * edge的移除分几种情况
     * 1. 拉了线出来但是没有连接，松开鼠标会消失，这个时候的edge是没有targetCell的，只有坐标
     * // 2.已经连接，但是被edge:connected中的回环检测移除，此时edge的data有标记{ cancel: true } (已经取消该逻辑)
     * 3. 已经正常连接的edge被移除，此时需要清理依赖该edge的组件的输入
     *
     */

    const targetCellId = edge.getTargetCellId() // 已经removed的edge的getTargetCell和getSourceCell获取不到，只能获取其id
    if (!targetCellId) return // 上述情况1
    const targetCell = graph.getCellById(targetCellId) as Node

    // 表示是有连线的组件被删除时，一并触发组件所有连线的edge:removed事件，如果targetCell不存在则表示是被删组件的输入边，无需处理
    if (!targetCell) return

    if (
      activeCell.value && (activeCell.value.id === targetCellId || graph.isPredecessor(getNode(activeCell.value.id), getNode(targetCellId)))
    ) cfgRef.value?.incomeUpdater()

    ;(graph.getSuccessors(targetCell) as Node[])
      .concat(targetCell)
      .filter(node => activeCell.value ? node.id !== activeCell.value.id : true) // activeCell不参与这个逻辑，而是使用cfg的incomeUpdater
      .forEach(node => fixCellIncomes(node))
  })

  graph.on('edge:connected', ({ edge }) => {
    if (edge.disposed) return // edge:connected会先执行在initGraph时注册的相同事件判断连接是否合法
    // 如果新增的连线目标是当前激活组件或是其前序组件，则需要更新Cfg的输入设置
    try {
      if (!activeCell.value) throw ''
      const targetCell = edge.getTargetCell()
      if (!targetCell) throw ''
      if (activeCell.value.id === targetCell.id || graph.isPredecessor(getNode(activeCell.value.id), targetCell)) cfgRef.value?.incomeUpdater()
    }
    catch {}
    finally { fileChange() }
  })

  graph.on('node:added', fileChange)
  graph.on('node:moved', fileChange)
  graph.on('cell:removed', fileChange)
  /** 因为graph.fromJSON会触发这个node:change:data事件导致一打开文件就是修改状态，data变更的fileChange改为在updateCellData中调用 */
  // graph.on('node:change:data', fileChange)

  // * ----- 单选激活节点 ------
  graph.on('blank:click', () => setActive(null))
  graph.on('cell:click', e => e.cell.shape === CPW_NODE_SHAPE ? setActive(e.cell as Node) : setActive(null))

  // 触发双击之前会先触发单击事件，此时是会有active的
  graph.on('node:dblclick', e => { if (e.cell.shape === CPW_NODE_SHAPE) outputsVisible.value = true })

  // * ----- 右键菜单 ------
  graph.on('blank:contextmenu', ({ e }) => {
    showMenu(
      e,
      [
        { label: '运行所有', icon: 'runAll', onClick: () => run('all') },
        { divider: true },
        { label: '清除所有组件输出', onClick: () => clearOutputs('all') },
      ],
    )
  })

  graph.on('node:contextmenu', ({ e, node }) => {
    showMenu(
      e,
      [
        { label: '运行组件', icon: 'runSingle', onClick: () => run('single', node) },
        { label: '运行至所选组件', icon: 'runToCurrent', onClick: () => run('to-current', node) },
        { label: '运行所有', icon: 'runAll', onClick: () => run('all') },
        { divider: true },
        { label: '清除组件输出', onClick: () => clearOutputs('single', node) },
        { label: '清除所有组件输出', onClick: () => clearOutputs('all') },
        { divider: true },
        { label: '编辑组件配置', icon: 'edit', onClick: () => openEdit(node) },
        { divider: true },
        { label: '复制组件', icon: 'copy', onClick: () => copyNode(node) },
        { label: '删除组件', icon: 'delete', onClick: () => delNode(node) },
      ],
    )
  })

  /**
   * 整个fileContent会在初始化时传入，并且不会变更，只有vue应用会单向往widget传递最新的fileContnet
   * 需要补充在保存时去掉的一些冗余配置
   */
  graph.fromJSON(formatFileContentLoad(props.fileContent))
})

// * ------------------- 节点操作 -------------------
const getNode = (target: Node | string) => typeof target === 'string' ? (graph.getCellById(target) as Node) : target
const activeCell = shallowRef<CPW.Cell | null>(null)

const setActive = (target: string | Node | null) => {
  if (target) {
    const node = getNode(target)
    if (node?.shape !== CPW_NODE_SHAPE) return
    if (activeCell.value && activeCell.value?.id !== node.id) updateCellData(activeCell.value.id, { active: false }, false)
    if (activeCell.value?.id === node.id) return

    const nodeData = node.getData<CPW.Cell>()
    // 如果节点有outputs但是没node，表示是重新打开的文件，需要渲染outputs数组
    if (nodeData.outputs.length && !nodeData.node) {
      const outputArea = newOutputArea(props.renderMimeRegistry)
      updateCellData(node, { active: true, node: outputArea.node }, false)
      outputArea.model.dispose()
      outputArea.dispose()
    }
    else {
      updateCellData(node, { active: true }, false)
    }
    activeCell.value = { ...node.getData<CPW.Cell>() }

    // console.log(activeCell.value)
    // console.log(wrapRunnerCode(activeCell.value))
  }
  else {
    if (!activeCell.value) return
    updateCellData(activeCell.value.id, { active: false }, false)
    activeCell.value = null
  }
}

const updateCellData = (target: string | Node, data: Partial<CPW.Cell>, save = true) => {
  const node = getNode(target)
  if (!node) return
  node.setData(data, { deep: false, overwrite: false })
  if (activeCell.value?.id === node.id) activeCell.value = { ...node.getData<CPW.Cell>() }
  if (save) fileChange()
}

const delNode = (target: string | Node) => {
  // 如果要删除选中节点的话要先清空状态，否则有连线的时候，graph.removeCell之后会移除连线触发edge:removed，里面找activeCell会出错
  if (activeCell.value && activeCell.value.id === (typeof target === 'string' ? target : target.id)) activeCell.value = null
  const node = graph.removeNode(target as any)
  node?.dispose()
  return node
  // 在这里不用处理cfg的incomes更新，因为如果是选中节点的父节点的话，则必会有连线，删除节点时会触发edge:removed走里面的cfg更新逻辑
}

const copyNode = (target: string | Node) => {
  const node = getNode(target)
  if (!node || node.shape !== CPW_NODE_SHAPE) return
  graph.copy([node])
  const [newNode] = graph.paste()
  // 只复制通用信息, 因为没有连线，income也要清除值
  const { incomes } = node.getData<CPW.Cell>()
  updateCellData(
    newNode as Node,
    { id: newNode.id, outputs: [], active: false, node: undefined, status: 'changed', incomes: incomes.map(o => ({ ...o, value: '' })) },
  )
  graph.cleanClipboard()
}

const clearOutputs = (type: 'single' | 'all', target?: string | Node) => {
  if (type === 'single' && target) {
    const node = getNode(target)
    if (node) updateCellData(node, { outputs: [], node: undefined, status: 'changed' })
  }
  else {
    graph.getNodes().forEach(node => {
      if (node.shape === CPW_NODE_SHAPE) updateCellData(node, { outputs: [], node: undefined, status: 'changed' })
    })
  }
}

const openEdit = (target: string | Node) => {
  const node = getNode(target)
  if (!node) return
  if (!activeCell.value || activeCell.value.id !== node.id) setActive(node)
  cfgCollapsed.value = false
  nextTick(() => cfgRef.value?.openEdit())
}

const run = (type: CPW.RunType, target?: string | Node) => {
  if (kernelStatus.value !== 'idle') return showErrorMessage('运行失败', '内核非空闲状态')

  const payload = {
    updateCellData,
    sessionContext: props.sessionContext,
    renderMimeRegistry: props.renderMimeRegistry,
  }

  if (type === 'all') runAll({ ...payload, graph })
  else if (type === 'to-current' && target) runToCurrent({ ...payload, graph, target: getNode(target) })
  else if (type === 'single' && target) runSingle({ ...payload, target: getNode(target) })
}

// * ---------------- 推送最新文件内容 --------------------
const fileChange = useThrottleFn(
  () => {
    const json = graph.toJSON()
    const content = formatFileContentSave(json)
    dispatchAction(props.id, { type: 'change', data: { content } })
  },
  150,
  true,
  false,
)

// * ---------------- toolbar --------------------
const toolbarLeft = computed<ToolbarBtn[]>(() => {
  const noActive = !activeCell.value
  return [
    dndCollapsed.value
      ? { title: '展开组件列表', icon: 'menuClose', onClick: () => { dndCollapsed.value = false } }
      : { title: '收起组件列表', icon: 'menuOpen', onClick: () => { dndCollapsed.value = true } },
    { title: '保存', icon: 'save', onClick: () => dispatchAction(props.id, { type: 'save', data: null }) },
    { title: '复制组件', icon: 'copy', disabled: noActive, onClick: () => copyNode(activeCell.value!.id) },
    { title: '运行组件', icon: 'runSingle', disabled: noActive, onClick: () => run('single', activeCell.value!.id) },
    { title: '运行至所选', icon: 'runToCurrent', disabled: noActive, onClick: () => run('to-current', activeCell.value!.id) },
    { title: '运行所有', icon: 'runAll', onClick: () => run('all') },
    { title: '中止内核', icon: 'stop', onClick: () => props.sessionContext.session?.kernel?.interrupt() },
    { title: '重启内核', icon: 'restart', onClick: () => props.sessionContext.session?.kernel?.restart() },
  ]
})

const toolbarRight = computed<ToolbarBtn[]>(() => {
  const noActive = !activeCell.value
  return [
    cfgCollapsed.value
      ? { title: '展开组件配置', icon: 'menuOpen', disabled: noActive, onClick: () => { cfgCollapsed.value = false } }
      : { title: '收起组件配置', icon: 'menuClose', disabled: noActive, onClick: () => { cfgCollapsed.value = true } },
  ]
})

// * ------- 内核状态显示 -------
const kernelStatus = ref<ISessionContext['kernelDisplayStatus']>('')

const onKernelStatusChange = ({ kernelDisplayStatus }: ISessionContext) => {
  kernelStatus.value = kernelDisplayStatus
}

const closeContextMenu = (e: MouseEvent) => {
  if (!contextMenuDom.value?.contains(e.target as any)) contextMenu.value.visible = false
}

onMounted(() => {
  props.sessionContext.statusChanged.connect(onKernelStatusChange)
  window.addEventListener('mousedown', closeContextMenu)
  // window.addEventListener('keydown', e => {
  //   console.log(e.key)
  //   if (e.key === 'Delete') {
  //     if (activeCell.value) delCell(activeCell.value.id)
  //   }
  // })
})

// * ------- widget事件接收 --------------

// eslint-disable-next-line ts/no-unsafe-function-type
const eventHandlers: Record<CPW.EventType, Function> = {
  dispose() {
    props.sessionContext.statusChanged.disconnect(onKernelStatusChange)
    window.removeEventListener(`cpw-event-${props.id}`, listener as any)
    window.removeEventListener('mousedown', closeContextMenu)
    graph.dispose()
    app?.unmount()
  },
}

const listener = (e: CustomEvent<CPW.EventPayload<CPW.EventType>>) => {
  eventHandlers[e.detail.type]?.(e.detail.data as any)
}

window.addEventListener(`cpw-event-${props.id}`, listener as any)

// * --------- dnd数据 --------------
const getCellCategories = async () => {
  // 多个cpw同时挂载时确保只请求一次
  if (window.__CPW_DATA.categories_loading.value) return
  window.__CPW_DATA.categories_loading.value = true
  try {
    const data = await reqCategories()
    window.__CPW_DATA.categories.value = data
  }
  catch (err: any) {
    MessagePlugin.error(err.message)
  }
  window.__CPW_DATA.categories_loading.value = false
}
if (!window.__CPW_DATA.categories.value.length) getCellCategories()

// * --------- cfg数据 --------------
const getPredecessors = (target: Node | string) => {
  const cell = getNode(target)
  if (!cell) return []
  return graph.getPredecessors(cell) as Node[]
}

/** 修复指定组件的incomes非法值，不对activeCell使用 */
const fixCellIncomes = (node: Node) => {
  const values: string[] = [] // 所有前序节点的outgos可选值
  graph.getPredecessors(node).forEach(node => {
    const { id, outgos } = node.getData<CPW.Cell>()
    outgos.forEach(outgo => values.push(`${id}|${outgo.name}`))
  })
  const { incomes } = node.getData<CPW.Cell>()
  let changed = false
  const newIncomes = incomes.map(income => {
    let value = income.value
    if (!values.includes(income.value)) {
      changed = true
      value = '' // 如果已选值已经不存在，则清空
    }
    return { ...income, value }
  })

  if (changed) updateCellData(node, { incomes: newIncomes })
}
</script>
