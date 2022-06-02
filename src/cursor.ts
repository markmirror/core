import { EditorView, ViewUpdate } from '@codemirror/view'
import { EditorState, SelectionRange } from '@codemirror/state'
import { syntaxTree } from "@codemirror/language"
import { SyntaxNode } from "@lezer/common"


export function onSelectionSet (cb: (nodes: SyntaxNode[]) => void) {
  return EditorView.updateListener.of((update: ViewUpdate) => {
    if (update.selectionSet) {
      const range: SelectionRange = update.state.selection.ranges[0]
      const nodes = getSelectedNodes(update.state, range)
      cb(nodes)
    }
  })
}


export function getSelectedNodes (state: EditorState, range: SelectionRange): SyntaxNode[] {
  const nodes: SyntaxNode[] = []

  let node: SyntaxNode | null
  node = syntaxTree(state).resolve(range.from)

  if (node.name === "Document") {
    const line = state.doc.lineAt(range.from)
    node = node.enter(line.to, -1)
    if (node) {
      nodes.push(node)
    }
    return nodes
  }

  while (node && node.name !== "Document") {
    if (node.from <= range.from && node.to >= range.to) {
      nodes.push(node)
    }
    if (node.parent) {
      node = node.parent
    } else {
      node = null
    }
  }
  return nodes
}


export function getSelectedNode (state: EditorState, range: SelectionRange, type: string): SyntaxNode {
  return getSelectedNodes(state, range).filter(node => node.name === type)[0]
}
