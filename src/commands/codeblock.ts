import { ChangeSpec, EditorSelection, EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { SyntaxNode } from "@lezer/common"
import { getSelectedNodes } from "../cursor"


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
  let to = endLine.from - (startLine.to - startLine.from) - 2

  const changes: ChangeSpec[] = [
    { from: from, to: startLine.to + 1 },
    { from: endLine.from, to: endLine.to + 1 },
  ]
  return { range: EditorSelection.range(startLine.from, to), changes }
}
