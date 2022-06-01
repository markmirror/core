import { EditorState, Extension } from "@codemirror/state"
import { EditorView, highlightActiveLine } from "@codemirror/view"
import { Language, LanguageDescription } from "@codemirror/language"
import { MarkdownExtension } from "@lezer/markdown"
import { markdown } from '@codemirror/lang-markdown'
import { styles } from './styles'

interface MarkMirrorOptions {
  extensions?: Extension[],
  addKeymap?: boolean,
  mdBase?: Language,
  mdExtensions?: MarkdownExtension,
  codeLanguages?: readonly LanguageDescription[],
}

export class MarkMirror {
  private view?: EditorView

  constructor (private options: MarkMirrorOptions = {}) {
    this.options = options
  }

  get state () : EditorState | null {
    if (this.view) {
      return this.view?.state
    } else {
      return null
    }
  }

  render (element: HTMLElement, content: string = '') {
    let doc = content
    if (!content && element instanceof HTMLTextAreaElement) {
      doc = element.value
    }
    const extensions = [
      highlightActiveLine(),
      markdown({
        base: this.options.mdBase,
        extensions: this.options.mdExtensions,
        codeLanguages: this.options.codeLanguages,
        addKeymap: this.options.addKeymap,
      }),
      styles,
    ]
    if (this.options.extensions) {
      extensions.push(this.options.extensions)
    }
    const state = EditorState.create({ doc, extensions })
    this.view = new EditorView({ state, parent: element })
  }

  destroy () {
    if (this.view) {
      this.view.destroy()
    }
  }
}
