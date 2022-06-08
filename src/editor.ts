import { EditorView } from "@codemirror/view"
import { EditorState, Extension } from "@codemirror/state"
import { markdown } from '@codemirror/lang-markdown'
import { MarkdownExtension } from "@lezer/markdown"
import { markdownLanguage, codeLanguages, markdownHighlight } from "./markdown"
import { blockElements } from './elements'
import { styles } from './styles'
import { MarkMirrorOptions } from "./types"


export class MarkMirror {
  public view?: EditorView
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
    const mdExtensions: MarkdownExtension[] = [ markdownHighlight ]
    if (this.options.mdExtensions) {
      mdExtensions.push(this.options.mdExtensions)
    }
    return [
      markdown({
        base: this.options.mdBase || markdownLanguage,
        extensions: mdExtensions,
        codeLanguages: this.options.codeLanguages || codeLanguages,
      }),
      blockElements,
      styles,
    ]
  }

  get extensions () {
    const extensions = [...this.defaultExtensions, ...this._extensions]
    if (this.options.extensions) {
      extensions.push(this.options.extensions)
    }
    return extensions
  }

  addExtension (extension: Extension) {
    this._extensions.push(extension)
  }

  createState (doc: string, extensions?: Extension[]) {
    if (!extensions) {
      extensions = this.extensions
    } else {
      extensions = [ ...this.extensions, ...extensions ]
    }
    return EditorState.create({ doc, extensions })
  }

  render (element: HTMLElement, options: { extensions?: Extension[], content?: string } = {}) {
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
    const state = this.createState(doc, options.extensions)
    this.view = new EditorView({ state, parent })
  }

  destroy () {
    if (this.view) {
      this.view.destroy()
    }
  }
}
