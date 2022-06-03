import { EditorSelection } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { getSelectedNode } from "../cursor"


export function insertLink (view: EditorView, text: string, url: string, title?: string) {
  return _insertLink(view, "[", text, url, title)
}

export function insertImage (view: EditorView, text: string, url: string, title?: string) {
  return _insertLink(view, "![", text, url, title)
}

function _insertLink (view: EditorView, marker: string, text: string, url: string, title?: string) {
  const { state, dispatch } = view
  const mutations = state.changeByRange(range => {
    let insert = `${marker}${text}](<${url}>`
    if (title) {
      insert += ' "' + title + '")'
    } else {
      insert += ")"
    }
    const pos = range.from + insert.length
    return {
      range: EditorSelection.cursor(pos),
      changes: [
        { from: range.from, to: range.to, insert },
      ],
    }
  })
  dispatch(mutations, { userEvent: "input" })
  return true
}

export const toggleLink = _toggleLink("Image", "[")
export const toggleImage = _toggleLink("Image", "![")

function _toggleLink (type: string, marker: string) {
  return (view: EditorView) => {
    const { state, dispatch } = view
    const mutations = state.changeByRange(range => {
      const node = getSelectedNode(state, range, type)
      if (node) {
        const leftMarker = node.firstChild
        const rightMarker = leftMarker?.nextSibling
        if (leftMarker && rightMarker) {
          return {
            range: EditorSelection.range(leftMarker.from, rightMarker.from - marker.length),
            changes: [
              { from: leftMarker.from, to: leftMarker.to },
              { from: rightMarker.from, to: node.to },
            ],
          }
        } else {
          return { range }
        }
      }
      if (range.from === range.to) {
        return {
          range: EditorSelection.range(range.from + marker.length, range.from + marker.length),
          changes: [ { from: range.from, insert: marker + '](<url>)' }],
        }
      } else {
        return {
          range: EditorSelection.range(range.to + 3 + marker.length, range.to + 6 + marker.length),
          changes: [
            { from: range.from, insert: marker },
            { from: range.to, insert: '](<url>)' },
          ],
        }
      }
    })
    dispatch(mutations, { userEvent: "input" })
    return true
  }
}
