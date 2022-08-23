import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'
import { RangeSet, RangeSetBuilder } from '@codemirror/state'
import { syntaxTree } from "@codemirror/language"
import { SyntaxNode } from "@lezer/common"

const _lineDecorations: { [key: string]: Decoration } = {}

function getLineDecoration (name: string, attrs = {}) {
  let deco = _lineDecorations[name]
  if (!deco) {
    let className = name
    if (/-(open|close)$/.test(name)) {
      className = name.replace(/-(open|close)$/, ' ') + name
    }
    deco = Decoration.line({ attributes: { class: className, ...attrs } })
    _lineDecorations[name] = deco
  }
  return deco
}

function buildBlockDecoration(view: EditorView): RangeSet<Decoration> {
  const builder = new RangeSetBuilder<Decoration>()

  const addRangeSet = (node: SyntaxNode, className: string, attrs = {}) => {
    let line = view.state.doc.lineAt(node.from)
    const endLine = view.state.doc.lineAt(node.to)
    builder.add(line.from, line.from, getLineDecoration(className + '-open', attrs))
    while (line.number < endLine.number - 1) {
      line = view.state.doc.line(line.number + 1)
      builder.add(line.from, line.from, getLineDecoration(className, attrs))
    }
    builder.add(endLine.from, endLine.from, getLineDecoration(className + '-close', attrs))
  }

  for (let {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: ({ node }) => {
        if (node.name === "Document") {
          return true
        }
        if (/CodeBlock|FencedCode|CommentBlock/.test(node.name)) {
          addRangeSet(node, 'cmb-code', { spellcheck: 'false' })
        } else if (node.name === "HTMLBlock") {
          // pre, script, style, textarea are treated as code blocks
          const line = view.state.doc.lineAt(node.from)
          if (line.text.match(/^ {0,3}<(pre|script|style|textarea)/)) {
            addRangeSet(node, 'cmb-code', { spellcheck: 'false' })
          }
        } else if (node.name === "Blockquote") {
          addRangeSet(node, 'cmb-quote')
        } else if (/ATXHeading/.test(node.name)) {
          builder.add(node.from, node.from, getLineDecoration('cmb-heading'))
        } else if (/SetextHeading/.test(node.name)) {
          addRangeSet(node, 'cmb-m-heading')
        } else if (node.name === "Table") {
          addRangeSet(node, 'cmb-table')
        }
        return false
      }
    })
  }
  return builder.finish()
}

export const blockElements = ViewPlugin.define((view: EditorView) => {
  return {
    update: () => {
      return buildBlockDecoration(view)
    }
  }
}, { decorations: (plugin) => plugin.update() })
