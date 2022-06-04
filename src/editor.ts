import { EditorState, Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { Language, LanguageDescription } from "@codemirror/language"
import { history } from "@codemirror/commands"
import { markdown } from '@codemirror/lang-markdown'
import { historyKeymap } from "@codemirror/commands"
import { MarkdownExtension } from "@lezer/markdown"
import { markdownLanguage, codeLanguages, markdownHighlight } from "./markdown"
import { blockElements } from './elements'
import { markdownKeymap } from "./commands"
import { styles } from './styles'

interface MarkMirrorOptions {
  extensions?: Extension[],
  addKeymap?: boolean,
  mdBase?: Language,
  mdExtensions?: MarkdownExtension,
  codeLanguages?: readonly LanguageDescription[],
}

export const localHistory = [ history(), historyKeymap ]

export class MarkMirror {
  private view?: EditorView

  constructor (private options: MarkMirrorOptions = {}) {
    this.options = options
  }

  get state () : EditorState | null {
    if (this.view) {
      return this.view.state
    } else {
      return null
    }
  }

  // default extensions
  get extensions () {
    const mdExtensions: MarkdownExtension[] = [ markdownHighlight ]
    if (this.options.mdExtensions) {
      mdExtensions.push(this.options.mdExtensions)
    }
    return [
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ spellcheck: 'true' }),
      markdown({
        base: this.options.mdBase || markdownLanguage,
        extensions: mdExtensions,
        codeLanguages: this.options.codeLanguages || codeLanguages,
      }),
      blockElements,
      styles,
    ]
  }

  createState (doc: string) {
    const extensions = this.extensions
    if (this.options.addKeymap !== false) {
      extensions.push(markdownKeymap)
    }
    if (this.options.extensions) {
      extensions.push(this.options.extensions)
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
    const state = this.createState(doc)
    this.view = new EditorView({ state, parent })
  }

  destroy () {
    if (this.view) {
      this.view.destroy()
    }
  }
}
