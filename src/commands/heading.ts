import { EditorSelection } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { getSelectedNodes } from "../cursor"

export function toggleHeading (level: number) {
  return (view: EditorView) => {
    const { state, dispatch } = view
    let userEvent = "input"
    const mutations = state.changeByRange(range => {
      const nodes = getSelectedNodes(state, range)
      const node = nodes[nodes.length - 1]
      if (node && /ATXHeading/.test(node.name)) {
        const startLine = state.doc.lineAt(node.from)
        const m = startLine.text.match(/^ {0,3}#{1,6}\s+/)
        if (m) {
          userEvent = "delete.dedent"
          const width = m[0].length
          return {
            range: EditorSelection.range(range.from - width, range.to - width),
            changes: [{ from: startLine.from, to: startLine.from + width }],
          }
        }
      }
      const line = state.doc.lineAt(range.from)
      return {
        range: EditorSelection.range(range.from + level + 1, range.to + level + 1),
        changes: [{ from: line.from, insert: '#'.repeat(level) + ' ' }],
      }
    })
    dispatch(mutations, { userEvent })
    return true
  }
}

export const toggleH1 = toggleHeading(1)
export const toggleH2 = toggleHeading(2)
export const toggleH3 = toggleHeading(3)
export const toggleH4 = toggleHeading(4)
export const toggleH5 = toggleHeading(5)
export const toggleH6 = toggleHeading(6)
