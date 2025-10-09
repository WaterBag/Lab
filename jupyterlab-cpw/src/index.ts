import {
  ILabShell,
  ILayoutRestorer,
  JupyterFrontEnd,
  type JupyterFrontEndPlugin,
} from '@jupyterlab/application'
import { ILauncher } from '@jupyterlab/launcher'
import { ISanitizer, WidgetTracker } from '@jupyterlab/apputils'
import { type CPWDocumentWidget, CPWFactory } from './cpw/widget'
import { ITranslator } from '@jupyterlab/translation'
import { LabIcon } from '@jupyterlab/ui-components'
import { DatasourcePanel } from './datasource/wdiget'
import { IDefaultFileBrowser } from '@jupyterlab/filebrowser'
import { ILSPCodeExtractorsManager, ILSPDocumentConnectionManager, ILSPFeatureManager, IWidgetLSPAdapterTracker, type WidgetLSPAdapterTracker } from '@jupyterlab/lsp'
import { isDev } from './config'
import 'tdesign-vue-next/es/style/index.css'
import { CPWAdapter } from './cpw/lspAdapter'
import type { IRenderMime } from '@jupyterlab/rendermime'
import { IRenderMimeRegistry } from '@jupyterlab/rendermime'

const cpwIcon = new LabIcon({
  name: 'cpw:icon',
  svgstr: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="#f37626" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4c0-1.655.345-2 2-2h4c1.655 0 2 .345 2 2s-.345 2-2 2H5c-1.655 0-2-.345-2-2m10 9c0-1.655.345-2 2-2h4c1.655 0 2 .345 2 2s-.345 2-2 2h-4c-1.655 0-2-.345-2-2m-9 7c0-1.655.345-2 2-2h4c1.655 0 2 .345 2 2s-.345 2-2 2H6c-1.655 0-2-.345-2-2m13-9c0-.465 0-.697-.038-.89a2 2 0 0 0-1.572-1.572c-.193-.038-.425-.038-.89-.038h-5c-.465 0-.697 0-.89-.038A2 2 0 0 1 7.038 6.89C7 6.697 7 6.465 7 6m10 9v1c0 1.886 0 2.828-.586 3.414S14.886 20 13 20h-1" color="#f37626"/></svg>',
})
const cpwIcon64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjM3NjI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNMyA0YzAtMS42NTUuMzQ1LTIgMi0yaDRjMS42NTUgMCAyIC4zNDUgMiAycy0uMzQ1IDItMiAySDVjLTEuNjU1IDAtMi0uMzQ1LTItMm0xMCA5YzAtMS42NTUuMzQ1LTIgMi0yaDRjMS42NTUgMCAyIC4zNDUgMiAycy0uMzQ1IDItMiAyaC00Yy0xLjY1NSAwLTItLjM0NS0yLTJtLTkgN2MwLTEuNjU1LjM0NS0yIDItMmg0YzEuNjU1IDAgMiAuMzQ1IDIgMnMtLjM0NSAyLTIgMkg2Yy0xLjY1NSAwLTItLjM0NS0yLTJtMTMtOWMwLS40NjUgMC0uNjk3LS4wMzgtLjg5YTIgMiAwIDAgMC0xLjU3Mi0xLjU3MmMtLjE5My0uMDM4LS40MjUtLjAzOC0uODktLjAzOGgtNWMtLjQ2NSAwLS42OTcgMC0uODktLjAzOEEyIDIgMCAwIDEgNy4wMzggNi44OUM3IDYuNjk3IDcgNi40NjUgNyA2bTEwIDl2MWMwIDEuODg2IDAgMi44MjgtLjU4NiAzLjQxNFMxNC44ODYgMjAgMTMgMjBoLTEiIGNvbG9yPSIjZjM3NjI2Ii8+PC9zdmc+'

const COMMAND = 'cpw:new'

const FACTORY = 'CPW'


function activate(
  app: JupyterFrontEnd,
  launcher: ILauncher,
  restorer: ILayoutRestorer,
  translator: ITranslator,
  renderMimeRegistry: IRenderMimeRegistry,
  paths: JupyterFrontEnd.IPaths,
  lspDocumentConnectionManager: ILSPDocumentConnectionManager,
  lspFeatureManager: ILSPFeatureManager,
  lspCodeExtractorsManager: ILSPCodeExtractorsManager,
  widgetLSPAdapterTracker: IWidgetLSPAdapterTracker,
  appSanitizer: IRenderMime.ISanitizer,
  completionProviderManager: ICompletionProviderManager,
) {
\n
  // 鍏ㄥ眬淇濆瓨project_id
  const serverPid = Number.parseInt(paths.urls.hubServerName?.replace('project_', '') || '')
  window.__CPW_PID = isDev ? 1 : (Number.isNaN(serverPid) ? 1 : serverPid)

  console.log('serverPid', serverPid)
  console.log('__CPW_PID', window.__CPW_PID)

  const tracker = new WidgetTracker<CPWDocumentWidget>({ namespace: 'cpw' })

  const obcb = () => {
    // console.log(document.body.getAttribute('data-jp-theme-light'))
    if (JSON.parse(document.body.getAttribute('data-jp-theme-light') || 'true')) {
      document.documentElement.removeAttribute('theme-mode')
    }
    else {
      document.documentElement.setAttribute('theme-mode', 'dark')
    }
  }
  const ob = new MutationObserver(obcb)
  ob.observe(document.body, { attributeFilter: ['data-jp-theme-light'] })
  obcb() // 鏈夋椂鍊欎細涓嶈嚜鍔ㄦ墽琛岋紝鎵嬪姩鎵ц涓€娆?

  // @ts-ignore
  restorer.restore(tracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: FACTORY }),
    name: widget => widget.context.path,
  })

  const trans = translator.load('jupyterlab')

  const factory = new CPWFactory({
    name: FACTORY,
    fileTypes: ['cpw'],
    defaultFor: ['cpw'],
    autoStartDefault: true,
    canStartKernel: true,
    // shutdownOnClose: true,
    shutdownOnClose: false,
    preferKernel: true,

    commands: app.commands,
    renderMimeRegistry,
  })

  factory.widgetCreated.connect((sender, widget) => {
    widget.title.icon = cpwIcon
    widget.context.pathChanged.connect(() => { tracker.save(widget) })
    tracker.add(widget)
  })

  app.docRegistry.addWidgetFactory(factory)

  app.docRegistry.addFileType({
    name: 'cpw',
    displayName: 'Workflow',
    extensions: ['.cpw'],
    icon: cpwIcon,
    fileFormat: 'text',
    contentType: 'file',
  })

  // 浠巐auncher鏂板缓cpw鏂囦欢
  app.commands.addCommand(COMMAND, {
    label: '娴佹按绾?,
    icon: cpwIcon,
    execute: args => {
      app.commands
        .execute('docmanager:new-untitled', { path: args.cwd, type: 'file', ext: '.cpw' })
        .then(model => app.commands.execute('docmanager:open', { path: model.path, factory: FACTORY }))
    },
  })

  launcher.add({
    command: COMMAND,
    category: trans.__('Notebook'),
    rank: 0,
    kernelIconUrl: cpwIcon64,
  })

  // ---------- 浠ｇ爜琛ュ叏鐩稿叧 ---------
  app.commands.addCommand('completer:invoke-cpw', {
    label: trans.__('Display the completion helper.'),
    execute: () => {
      const id = tracker.currentWidget?.id
      if (id) completionProviderManager.invoke(id)
    },
  })

  app.commands.addCommand('completer:select-cpw', {
    label: trans.__('Select the completion suggestion.'),
    execute: () => {
      const id = tracker.currentWidget?.id
      if (id) return completionProviderManager.select(id)
    },
  })

  app.commands.addKeyBinding({
    command: 'completer:select-cpw',
    keys: ['Enter'],
    selector: '.cpw-cell-editor-section-content .jp-mod-completer-active',
  })

  const updateCompleter = async (_: WidgetTracker<CPWDocumentWidget> | undefined, widget: CPWDocumentWidget) => {
    const completerContext = {
      editor: widget.content.activeEditor ?? null,
      session: widget.context.sessionContext.session,
      widget,
      sanitizer: appSanitizer,
    }
    await completionProviderManager.updateCompleter(completerContext)
    widget.content.activeEditorChanged.connect((_, editor) => {
      const newCompleterContext = {
        editor,
        session: widget.context.sessionContext.session,
        widget,
        sanitizer: appSanitizer,
      }
      return completionProviderManager.updateCompleter(newCompleterContext)
    })
    widget.context.sessionContext.sessionChanged.connect(() => {
      const newCompleterContext = {
        editor: widget.content.activeEditor ?? null,
        session: widget.context.sessionContext.session,
        widget,
      }
      return completionProviderManager.updateCompleter(newCompleterContext)
    })
  }

  tracker.widgetAdded.connect(updateCompleter)

  completionProviderManager.activeProvidersChanged.connect(() => {
    tracker.forEach(widget => updateCompleter(undefined, widget).catch(e => console.error(e)))
  })

  tracker.widgetAdded.connect((_, cpwDoc) => {
    const lspApdapt = new CPWAdapter(
      cpwDoc,
      {
        connectionManager: lspDocumentConnectionManager,
        featureManager: lspFeatureManager,
        foreignCodeExtractorsManager: lspCodeExtractorsManager,
      },
    )
    ;(widgetLSPAdapterTracker as WidgetLSPAdapterTracker).add(lspApdapt)
  })
}

const cpwPlugin: JupyterFrontEndPlugin<void> = {
  id: 'cpw:widget',
  description: 'Enable Canvas Pipeline Workflow.',
  autoStart: true,
  // optional: [],
  requires: [
    ILauncher,
    ILayoutRestorer,
    ITranslator,
    IRenderMimeRegistry,
    JupyterFrontEnd.IPaths,
    ILSPDocumentConnectionManager,
    ILSPFeatureManager,
    ILSPCodeExtractorsManager,
    IWidgetLSPAdapterTracker,
    ISanitizer,
    ICompletionProviderManager,
  ],
  activate,
}

// const cpwLanguageServerPlugin: JupyterFrontEndPlugin<void> = {
//   id: 'cpw:language-server',
//   description: 'Adds language server capability to the cpw',
//   autoStart: true,
//   requires: [ILauncher, ILayoutRestorer, ITranslator, JupyterFrontEnd.IPaths, ILSPDocumentConnectionManager, ILSPFeatureManager, ILSPCodeExtractorsManager],
//   activate: (app: JupyterFrontEnd) => {

//   })
// }

const datasourcePlugin: JupyterFrontEndPlugin<void> = {
  id: 'cpw-datasource:widget',
  description: 'Datasource Categories',
  autoStart: true,
  requires: [ILabShell, IDefaultFileBrowser, ILayoutRestorer],
  activate(
    app: JupyterFrontEnd,
    shell: ILabShell,
    filebrowser: IDefaultFileBrowser,
    restorer: ILayoutRestorer,
  ) {
    const ds = new DatasourcePanel({ filebrowser })
    shell.add(ds, 'right', { type: '鏁版嵁闆?, rank: 1001 }) // 1001姣旀墿灞曠鐞嗗櫒澶?锛屾斁鍦ㄥ畠涓嬮潰
    if (restorer) restorer.add(ds, 'cpw-ds:plugin')
  },
}

export default [cpwPlugin, datasourcePlugin]


