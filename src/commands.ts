import { ChangeSpec, EditorSelection, EditorState } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { SyntaxNode } from "@lezer/common"
import { getSelectedNode, getSelectedNodes } from "./cursor"


export const markdownKeymap = keymap.of([
  indentWithTab,
  { key: 'Mod-b', run: toggleBold },
  { key: 'Mod-i', run: toggleItalic },
  { key: 'Mod-d', run: toggleStrikethrough },
  { key: 'Mod-`', run: toggleInlineCode },
  { key: 'Mod-Enter', run: insertLinebreak },
  { key: 'Mod-"', run: toggleBlockquote },
])


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


export function toggleList (ordered: Boolean) {
  return (view: EditorView) => {
  }
}

export function toggleBlockcode (view: EditorView) {
  const { state, dispatch } = view
  let userEvent = 'input'
  const mutations = state.changeByRange(range => {
    const nodes = getSelectedNodes(state, range)
    const indentCodeNode = nodes.filter(node => node.name === 'CodeBlock')[0]
    if (indentCodeNode) {
      userEvent = "delete.dedent"
      return removeCodeBlock(state, indentCodeNode)
    }

    const fencedCodeNode = nodes.filter(node => node.name === 'FencedCode')[0]
    if (fencedCodeNode) {
      userEvent = "delete.dedent"
      return removeFencedCode(state, fencedCodeNode)
    }

    const startLine = state.doc.lineAt(range.from)
    const endLine = state.doc.lineAt(range.to)
    const changes: ChangeSpec[] = [
      { from : startLine.from, insert: '```\n' },
      { from : endLine.to, insert: '\n```' },
    ]
    return { range: EditorSelection.range(startLine.from + 4, endLine.to + 4), changes }
  })
  dispatch(mutations, { userEvent })
  return true
}


function removeCodeBlock (state: EditorState, node: SyntaxNode) {
  const startLine = state.doc.lineAt(node.from)
  const endLine = state.doc.lineAt(node.to)
  const changes: ChangeSpec[] = []

  let line = startLine
  let to = endLine.to
  while (line.number <= endLine.number) {
    changes.push({ from: line.from, to: line.from + 4 })
    to -= 4
    line = state.doc.line(line.number + 1)
  }

  return { range: EditorSelection.range(startLine.from, to), changes }
}


function removeFencedCode (state: EditorState, node: SyntaxNode) {
  const startLine = state.doc.lineAt(node.from)
  const endLine = state.doc.lineAt(node.to)

  let from = startLine.from
  let to = endLine.from - (startLine.to - startLine.from)
  if (startLine.from) {
    const prevLine = state.doc.line(startLine.number - 1)
    if (/^\s*$/.test(prevLine.text)) {
      from -= 1
      to -= 1
    }
  }

  if (node.lastChild && node.lastChild.name === 'CodeMark') {
    to -= 1
  }

  const changes: ChangeSpec[] = [
    { from: from, to: startLine.to },
    { from: endLine.from, to: endLine.to },
  ]
  return { range: EditorSelection.range(startLine.from, to), changes }
}


export function toggleBlockquote (view: EditorView) {
  const { state, dispatch } = view
  let userEvent = 'input'
  const mutations = state.changeByRange(range => {
    const changes: ChangeSpec[] = []
    const startLine = state.doc.lineAt(range.from)
    const endLine = state.doc.lineAt(range.to)
    let line = startLine
    let { from, to } = range
    while (line.number <= endLine.number) {
      const m = line.text.match(/^ {0,3}>\s/)
      if (m) {
        userEvent = "delete.dedent"
        const width = m[0].length
        if (from >= line.from) {
          from -= Math.min(from - line.from, width)
        }
        if (to >= line.from) {
          to -= Math.min(to - line.from, width)
        }
        changes.push({ from: line.from, to: line.from + width })
      } else {
        changes.push({ from: line.from, insert: '> ' })
        if (from >= line.from) {
          from += 2
        }
        if (to >= line.from ) {
          to += 2
        }
      }
      line = state.doc.line(line.number + 1)
    }
    return { range: EditorSelection.range(from, to), changes }
  })
  dispatch(mutations, { userEvent })
  return true
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
