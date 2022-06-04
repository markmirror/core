import { EditorView } from "@codemirror/view"
import { EditorSelection } from "@codemirror/state"


export function insertLinebreak (view: EditorView) {
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
