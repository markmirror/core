import { EditorView, ViewUpdate } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { syntaxTree } from "@codemirror/language"
import { SyntaxNode } from "@lezer/common"

export interface SelectionRange {
  from: number
  to: number
}

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

  let isBlock = false
  if (node.name === "Document") {
    const line = state.doc.lineAt(range.from)
    if (line.to > line.from) {
      node = syntaxTree(state).resolve(line.to - 1)
      isBlock = true
    }
  }

  if (range.from === range.to && /BulletList|OrderedList/.test(node.name)) {
    const line = state.doc.lineAt(range.from)
    if (line.to > line.from) {
      node = syntaxTree(state).resolve(line.to - 1)
      isBlock = true
    }
  }

  if (node.name === "ListItem") {
    // special case for task list items
    const markerNode = node.firstChild
    if (markerNode && markerNode.name === "ListMark") {
      if (markerNode.nextSibling && markerNode.nextSibling.name === "Task") {
        node = markerNode.nextSibling
        isBlock = true
      }
    }
  }

  while (node && node.name !== "Document") {
    if (isBlock && node.type.is("Block") && node.to >= range.to) {
      nodes.push(node)
    } else {
      if (node.from <= range.from && node.to >= range.to) {
        nodes.push(node)
      }
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
