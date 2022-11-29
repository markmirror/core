import { EditorView, ViewUpdate } from "@codemirror/view"
import { EditorState, Extension } from "@codemirror/state"
import { markdown } from '@codemirror/lang-markdown'
import { MarkdownExtension } from "@lezer/markdown"
import { markdownLanguage, codeLanguages, markdownHighlight } from "./markdown"
import { blockElements } from './elements'
import { styles } from './styles'
import { MarkMirrorOptions } from "./types"

export type EventHandler = (data: any, editor: MarkMirror) => void

export class MarkMirror {
  public view?: EditorView
  public element?: Element

  private _handlers: {[event: string]: EventHandler[]} = {}
  private _extensions: Extension[] = []
  // TODO: find a better way to attach methods on instance
  private _methods: {[name: string]: (data: any) => any } = {}

  constructor (public options: MarkMirrorOptions = {}) {}

  get state () : EditorState | null {
    if (this.view) {
      return this.view.state
    } else {
      return null
    }
  }

  private get markdownExtension () {
    const mdExtensions: MarkdownExtension[] = [ markdownHighlight ]
    if (this.options.mdExtensions) {
      mdExtensions.push(this.options.mdExtensions)
    }
    return markdown({
      base: this.options.mdBase || markdownLanguage,
      extensions: mdExtensions,
      codeLanguages: this.options.codeLanguages || codeLanguages,
    })
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
      this.markdownExtension,
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

  registerMethod (name: string, fn: (data: any) => any) {
    if (this._methods[name]) {
      throw new Error('Method: `' + name + '` has been registered.')
    } else {
      this._methods[name] = fn
    }
  }

  runMethod (name: string, data: any) {
    const fn = this._methods[name]
    if (fn) {
      return fn(data)
    }
  }

  private createState (doc: string) {
    let extensions = [...this.defaultExtensions, ...this._extensions]
    if (this.options.extensions) {
      extensions = [...extensions, ...this.options.extensions]
    }
    return EditorState.create({ doc, extensions })
  }

  render (element: HTMLElement, options: { content?: string } = {}) {
    let doc = options.content || '', parent = element
    if (!options.content && element instanceof HTMLTextAreaElement) {
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
