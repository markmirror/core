import { EditorView } from "@codemirror/view"
import { EditorSelection } from "@codemirror/state"
import { getSelectedNode } from "../cursor"


export function toggleHorizontalRule (view: EditorView) : boolean {
  const { state, dispatch } = view

  let userEvent = ''
  const mutations = state.changeByRange(range => {
    if (!range.empty) {
      return { range }
    }
    const node = getSelectedNode(state, range, "HorizontalRule")
    const line = state.doc.lineAt(range.from)
    if (node) {
      userEvent = "delete"
      return { range: EditorSelection.cursor(line.from), changes: [{ from: line.from, to: line.to }] }
    }

    userEvent = "input"
    let insert = '---\n'
    if (!/^\s*$/.test(line.text)) {
      insert = "\n\n---\n"
      return { range: EditorSelection.cursor(line.to + insert.length), changes: [{ from: line.to, insert }] }
    }

    if (line.number) {
      const prevLine = state.doc.line(line.number - 1)
      if (!/^\s*$/.test(prevLine.text)) {
        insert = '\n' + insert
      }
    }
    const changes = [{ from: line.from, to: line.to, insert }]
    return { range: EditorSelection.cursor(line.from + insert.length), changes }
  })
  if (userEvent) {
    dispatch(mutations, { userEvent })
    return true
  }
  return false
}


export function insertLinebreak (view: EditorView) : boolean {
  const { state, dispatch } = view
  const mutations = state.changeByRange(range => {
    const line = state.doc.lineAt(range.to)
    const changes = [{ from: line.to, insert: '  \n'}]
    return { range: EditorSelection.cursor(line.to + 3), changes }
  })
  dispatch(mutations, { userEvent: 'input' })
  return true
}


export function insertText (view: EditorView, text: string) {
  const mutations = view.state.replaceSelection(text)
  view.dispatch(mutations, { userEvent: 'input' })
}
