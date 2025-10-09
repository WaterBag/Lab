import type { CommandRegistry } from '@lumino/commands'
import { Widget } from '@lumino/widgets'
import { ABCWidgetFactory, type DocumentRegistry, DocumentWidget } from '@jupyterlab/docregistry'
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime'
import { renderCPW } from './core'
import { SessionContextDialogs } from '@jupyterlab/apputils'
import type { CodeMirrorEditor } from '@jupyterlab/codemirror'
import { Signal } from '@lumino/signaling'

const dispatchEvent: CPW.DispatchEvent = (id, payload) => {
  window.dispatchEvent(new CustomEvent(`cpw-event-${id}`, { detail: payload }))
}

const defaultFileContent: CPW.FileSchema = {
  cells: [],
}

class CPWWidget extends Widget {
  constructor(options: ICPWFactoryOptions & { context: DocumentRegistry.Context }) {
    super()
    this._commands = options.commands
    this._context = options.context
    this._rendermime = options.renderMimeRegistry

    this._context.ready.then(() => {
      const content = this._context.model.toString()
      if (!content) {
        this._context.model.fromString(JSON.stringify(defaultFileContent)) // 画布对象
        this.save()
      }
      window.addEventListener(`cpw-action-${this.id}`, this)
      renderCPW(
        this.node,
        this.id,
        this._context.model.toString(),
        this._rendermime,
        this._context.sessionContext,
      )
    })
  }

  private _commands: CommandRegistry
  private _context: DocumentRegistry.Context
  private _sessionContextDialogs = new SessionContextDialogs()
  private _rendermime: IRenderMimeRegistry

  private _activeEditorChanged = new Signal<this, CodeMirrorEditor | null>(this)
  get activeEditorChanged() {
    return this._activeEditorChanged
  }

  private _activeEditor: CodeMirrorEditor | null = null
  get activeEditor() {
    return this._activeEditor
  }

  get session() {
    return this._context.sessionContext.session
  }

  handleEvent(e: CustomEvent<CPW.ActionPayload<CPW.ActionType>>) {
    this[e.detail.type]?.(e.detail.data as any)
  }

  kernelChange() {
    this._sessionContextDialogs.selectKernel(this._context.sessionContext)
  }

  change(payload: CPW.ActionPayloadData['change']) {
    const { content } = payload
    this._context.model.fromString(content)
  }

  setCurrentEditor(payload: CPW.ActionPayloadData['setCurrentEditor']) {
    if (this._activeEditor === payload.editor) return
    if (this._activeEditor) Signal.disconnectAll(this._activeEditor.model.sharedModel.changed)
    this._activeEditor = payload.editor
    this._activeEditorChanged.emit(payload.editor)
  }

  save() {
    this._commands.execute('docmanager:save')
  }

  exportIpynb() {
    // todo 流水线导出为notebook
  }

  dispose() {
    window.removeEventListener(`cpw-action-${this.id}`, this, false)
    dispatchEvent(this.id, { type: 'dispose', data: null })
    super.dispose()
  }
}

export class CPWDocumentWidget extends DocumentWidget<CPWWidget> {
  constructor(options: DocumentWidget.IOptions<CPWWidget, DocumentRegistry.IModel>) {
    super(options)
    this.toolbar.dispose() // 不要默认的toolbar
  }
}

interface ICPWFactoryOptions extends DocumentRegistry.IWidgetFactoryOptions {
  commands: CommandRegistry
  renderMimeRegistry: IRenderMimeRegistry
}

export class CPWFactory extends ABCWidgetFactory<CPWDocumentWidget, DocumentRegistry.IModel> {
  constructor(options: ICPWFactoryOptions) {
    super(options)
    this._options = options
  }

  private _options: ICPWFactoryOptions

  protected createNewWidget(context: DocumentRegistry.Context): CPWDocumentWidget {
    return new CPWDocumentWidget({
      context,
      content: new CPWWidget({ context, ...this._options }),
    })
  }
}
