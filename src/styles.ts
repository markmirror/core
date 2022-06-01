import { EditorView } from '@codemirror/view'
import { classHighlighter } from "@lezer/highlight"
import { syntaxHighlighting } from "@codemirror/language"


const themeStyle = EditorView.theme({
  '.cm-content': {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    caretColor: 'var(--mm-caret-color)',
    fontFamily: 'var(--mm-font-family)',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--mm-active-line-background-color)',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
})

export const styles = [
  themeStyle,
  syntaxHighlighting(classHighlighter, {fallback: true}),
]
