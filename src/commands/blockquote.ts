import { ChangeSpec, EditorSelection, Line } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { getSelectedNode, SelectionRange } from "../cursor"


export function toggleBlockquote (view: EditorView) {
  const { state, dispatch } = view
  let dedent = false
  const mutations = state.changeByRange(range => {
    const changes: ChangeSpec[] = []
    dedent = Boolean(getSelectedNode(state, range, "Blockquote"))

    const startLine = state.doc.lineAt(range.from)
    let line = startLine
    let endLine = startLine
    if (!range.empty) {
      endLine = state.doc.lineAt(range.to)
    }
    const quoteRange = { from: range.from, to: range.to }

    let dedent2 = dedent

    while (line.number < endLine.number) {
      dedent2 = handleLine(line, dedent, changes, quoteRange)
      line = state.doc.line(line.number + 1)
    }
    if (/^\s*$/.test(line.text)) {
      quoteRange.to -= 1
    } else {
      dedent2 = handleLine(line, dedent, changes, quoteRange)
    }

    dedent = dedent2
    return { range: EditorSelection.range(quoteRange.from, quoteRange.to), changes }
  })
  const userEvent = dedent ? "delete.dedent" : "input"
  dispatch(mutations, { userEvent })
  return true
}


function handleLine (line: Line, dedent: boolean, changes: ChangeSpec[], range: SelectionRange ) {
  const m = line.text.match(/^ {0,3}>\s/)
  if (m && dedent) {
    const width = m[0].length
    if (range.from >= line.from) {
      range.from -= Math.min(range.from - line.from, width)
    }
    if (range.to >= line.from) {
      range.to -= Math.min(range.to - line.from, width)
    }
    changes.push({ from: line.from, to: line.from + width })
  } else if (!m) {
    changes.push({ from: line.from, insert: '> ' })
    if (range.from >= line.from) {
      range.from += 2
    }
    if (range.to >= line.from ) {
      range.to += 2
    }
    return false
  }
  return true
}
