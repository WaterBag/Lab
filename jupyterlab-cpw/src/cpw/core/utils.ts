/* eslint-disable antfu/consistent-list-newline */
import {
  mdiContentCopy,
  mdiContentSave,
  mdiMemory,
  mdiMenuClose,
  mdiMenuOpen,
  mdiPlay,
  mdiPlayCircle,
  mdiRefresh,
  mdiSkipNext,
  mdiStop,
  mdiTrashCan,
} from '@mdi/js'
import { CPW_EDGE_SHAPE, CPW_NODE_SHAPE, cpwConditionPortConfig, cpwPortConfig } from './Graph'
import type { ISessionContext } from '@jupyterlab/apputils'
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea'
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime'

export const dispatchAction: CPW.DispatchAction = (id, payload) => {
  window.dispatchEvent(new CustomEvent(`cpw-action-${id}`, { detail: payload }))
}

/** notebook源码中的枚举状态一致，由translator获取的各状态中文名 */
export const kernelStatusLabel: Record<ISessionContext['kernelDisplayStatus'], string> = {
  'unknown': '未知',
  'starting': '正在启动',
  'idle': '空闲',
  'busy': '忙碌',
  'terminating': '正在终止',
  'restarting': '正在重启',
  'autorestarting': '正在自动重启',
  'dead': '已死',
  'connected': '已连接',
  'connecting': '正在连接',
  'disconnected': '已断开连接',
  'initializing': '正在初始化',
  '': '',
}

const fillSvg = (path: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="${path}" /></svg>`

/** 给toolbar和contextmenu用的svg字符串，方便传参，并且避免了t-icon的svg精灵图请求 */
export const btnIcons = {
  save: fillSvg(mdiContentSave),
  runSingle: fillSvg(mdiPlay),
  runToCurrent: fillSvg(mdiSkipNext),
  runAll: fillSvg(mdiPlayCircle),
  copy: fillSvg(mdiContentCopy),
  stop: fillSvg(mdiStop),
  restart: fillSvg(mdiRefresh),
  kernel: fillSvg(mdiMemory),
  delete: fillSvg(mdiTrashCan),
  menuOpen: fillSvg(mdiMenuOpen),
  menuClose: fillSvg(mdiMenuClose),
  edit: fillSvg('M16.43 1.96l5.6 5.61L7.62 22H2V16.4L16.43 1.96zm0 2.83l-2.78 2.78 2.78 2.79 2.78-2.79-2.78-2.78zM15 11.77l-2.78-2.78L4 17.22V20h2.78l8.23-8.23zM22.22 22h-9.54v-2h9.54v2z'),
}

export type BtnIcon = keyof typeof btnIcons

export type ToolbarBtn = {
  title: string
  icon: BtnIcon
  disabled?: boolean
  onClick: (e: MouseEvent) => any
}

// Python 3.11 中的关键字列表，可根据Python版本更新此列表
const pythonKeywords = [
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
  'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
  'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
]
const pyidReg = /^[a-z_]\w*$/i
/** 判断是否为python的合法标识符 */
export const isLegalPythonIdentifier = (name: string) => {
  if (!name || !pyidReg.test(name)) return false
  return !pythonKeywords.includes(name)
}

export const formatFileContentSave = (json: CPW.FileSchema) => {
  json.cells.forEach(cell => {
    // 删除冗余配置
    if (cell.shape === CPW_NODE_SHAPE) {
      delete cell.data.node
      delete cell.ports
      cell.data.active = false
      // 不保存节点运行中的状态
      if (cell.data.status === 'running' || cell.data.status === 'waiting') cell.data.status = 'changed'
    }
    else if (cell.shape === CPW_EDGE_SHAPE) {
      delete cell.attrs
    }
  })
  return JSON.stringify(json)
}

export const formatFileContentLoad = (json: CPW.FileSchema) => {
  return json.cells.map(c => {
    const cell = { ...c }
    if (cell.shape === CPW_NODE_SHAPE) {
      cell.ports = cell.data.type === 'condition' ? cpwConditionPortConfig : cpwPortConfig
    }
    else if (cell.shape === CPW_EDGE_SHAPE) {
      cell.attrs = { line: { strokeDasharray: '' } }
    }
    return cell
  })
}

export const newOutputArea = (rendermime: IRenderMimeRegistry) => new OutputArea({
  model: new OutputAreaModel({ trusted: true }),
  maxNumberOutputs: 50, // 50和notebook的默认值一致
  rendermime,
})
