import { EditorView, ViewUpdate } from "@codemirror/view"
import { EditorState, Extension } from "@codemirror/state"
export { EditorState, RangeSet, RangeSetBuilder } from "@codemirror/state"

import { blockElements } from './blocks'
import { styles } from './styles'

export type EventHandler = (data: any, editor: MarkMirror) => void

export interface MarkMirrorOptions {
  extensions?: Extension[],
}

export class MarkMirror {
  public view?: EditorView
  public element?: Element

  private _handlers: {[event: string]: EventHandler[]} = {}
  private _extensions: Extension[] = []

  constructor (public options: MarkMirrorOptions = {}) {}

  get state () : EditorState | null {
    if (this.view) {
      return this.view.state
    } else {
      return null
    }
  }

  // default extensions
  private get defaultExtensions () {
    const onDocChange = EditorView.updateListener.of((update: ViewUpdate) => {
      if (update.docChanged) {
        this.trigger('docChanged', update.state.doc.toString())
      }
    })
    return [
      onDocChange,
      EditorView.lineWrapping,
      blockElements,
      styles,
    ]
  }

  on (event: string, handler: EventHandler) {
    if (!this._handlers[event]) {
      this._handlers[event] = []
    }
    this._handlers[event].push(handler)
  }

  off (event: string, handler: EventHandler) {
    const handlers = this._handlers[event]
    if (handlers) {
      this._handlers[event] = handlers.filter(h => h !== handler)
    }
  }

  trigger (event: string, data: any) {
    const handlers = this._handlers[event]
    if (handlers) {
      handlers.forEach(h => h(data, this))
    }
  }

  addExtension (extension: Extension) {
    this._extensions.push(extension)
  }

  use (plugin: (ctx: MarkMirror) => Extension) {
    this._extensions.push(plugin(this))
  }

  private createState (doc: string) {
    let extensions = [...this.defaultExtensions, ...this._extensions]
    if (this.options.extensions) {
      extensions = [...extensions, ...this.options.extensions]
    }
    return EditorState.create({ doc, extensions })
  }

  render (element: HTMLElement, content: string = '') {
    let doc = content, parent = element
    if (!content && element instanceof HTMLTextAreaElement) {
      doc = element.value
    }
    if (element instanceof HTMLTextAreaElement) {
      parent = document.createElement('div')
      parent.id = element.id
      parent.className = element.className
      element.parentNode?.replaceChild(parent, element)
    }
    parent.classList.add('markmirror')
    this.element = parent
    const state = this.createState(doc)
    this.view = new EditorView({ state, parent })
  }

  focus () {
    this.view?.focus()
  }

  destroy () {
    this.view?.destroy()
  }
}
