import { ChangeSpec, EditorSelection } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { getSelectedNode } from "./cursor"


export const markdownKeymap = keymap.of([
  { key: 'Mod-b', run: toggleBold },
  { key: 'Mod-i', run: toggleItalic },
  { key: 'Mod-d', run: toggleStrikethrough },
  { key: 'Mod-`', run: toggleInlineCode },
])


export function toggleHeading (level: number) {
  return (view: EditorView) => {
  }
}


export function toggleBold (view: EditorView) {
  return toggleMarker(view, "StrongEmphasis", "**")
}

export function toggleItalic (view: EditorView) {
  return toggleMarker(view, "Emphasis", "*")
}

export function toggleInlineCode (view: EditorView) {
  return toggleMarker(view, "InlineCode", "`")
}

export function toggleStrikethrough(view: EditorView) {
  return toggleMarker(view, "Strikethrough", "~~")
}


export function toggleMarker (view: EditorView, type: string, marker: string) {
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
