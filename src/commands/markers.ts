import { ChangeSpec, EditorSelection } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { getSelectedNode } from "../cursor"

export function toggleMarker (type: string, marker: string) {
  return (view: EditorView) => {
    const { state, dispatch } = view
    let userEvent = "input"
    const mutations = state.changeByRange(range => {
      const changes: ChangeSpec[] = []
      const node = getSelectedNode(state, range, type)
      let from = range.from, to = range.to
      if (node) {
        from = node.from
        to = node.to
        if (node.firstChild) {
          const prevMarker = node.firstChild
          to = to - (prevMarker.to - prevMarker.from)
          changes.push({ from: prevMarker.from, to: prevMarker.to })
        }
        if (node.lastChild) {
          const lastMarker = node.lastChild
          to = to - (lastMarker.to - lastMarker.from)
          changes.push({ from: lastMarker.from, to: lastMarker.to })
        }
        userEvent = "delete"
      } else {
        from += marker.length
        to += marker.length
        changes.push({ from: range.from, insert: marker })
        changes.push({ from: range.to, insert: marker })
      }
      return { range: EditorSelection.range(from, to), changes }
    })
    dispatch(mutations, { scrollIntoView: true, userEvent })
    return true
  }
}

export const toggleItalic = toggleMarker("Emphasis", "*")
export const toggleBold = toggleMarker("StrongEmphasis", "**")
export const toggleInlineCode = toggleMarker("InlineCode", "`")
export const toggleStrikethrough = toggleMarker("Strikethrough", "~~")
