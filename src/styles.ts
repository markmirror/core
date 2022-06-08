import { EditorView } from '@codemirror/view'
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language"
import { tags as t } from "@lezer/highlight"
import { tags as t2 } from "./markdown"

const themeStyle = EditorView.baseTheme({
  "&.cm-editor.cm-focused": {
    outline: "none",
  },
  ".cm-content": {
    caretColor: "var(--mm-c-caret)",
    fontFamily: "var(--mm-f-content)",
  },
})

const classHighlightStyle = HighlightStyle.define([
  { tag: t.link, class: "cmt-link" },
  { tag: t.emphasis, class: "cmt-emphasis" },
  { tag: t.strong, class: "cmt-strong" },
  { tag: t.keyword, class: "cmt-keyword" },
  { tag: t.atom, class: "cmt-atom" },
  { tag: t.bool, class: "cmt-bool" },
  { tag: t.url, class: "cmt-url" },
  { tag: t.labelName, class: "cmt-labelName" },
  { tag: t.inserted, class: "cmt-inserted" },
  { tag: t.deleted, class: "cmt-deleted" },
  { tag: t.strikethrough, class: "cmt-strikethrough" },
  { tag: t.literal, class: "cmt-literal" },
  { tag: t.string, class: "cmt-string" },
  { tag: t.number, class: "cmt-number" },
  { tag: [ t.escape, t.special(t.string) ], class: "cmt-string2" },
  { tag: t.regexp, class: "cmt-regexp" },
  { tag: t.variableName, class: "cmt-variableName" },
  { tag: t.local(t.variableName), class: "cmt-variableName cmt-local" },
  { tag: t.definition(t.variableName), class: "cmt-variableName cmt-definition" },
  { tag: t.special(t.variableName), class: "cmt-variableName2" },
  { tag: t.definition(t.propertyName), class: "cmt-propertyName cmt-definition" },
  { tag: t.typeName, class: "cmt-typeName" },
  { tag: t.namespace, class: "cmt-namespace" },
  { tag: t.className, class: "cmt-className" },
  { tag: t.macroName, class: "cmt-macroName" },
  { tag: t.propertyName, class: "cmt-propertyName" },
  { tag: t.operator, class: "cmt-operator" },
  { tag: t.comment, class: "cmt-comment" },
  { tag: t.meta, class: "cmt-meta" },
  { tag: t.invalid, class: "cmt-invalid" },
  { tag: t.punctuation, class: "cmt-punctuation" },
  { tag: t.heading1, class: "cmt-h1" },
  { tag: t.heading2, class: "cmt-h2" },
  { tag: t.heading3, class: "cmt-h3" },
  { tag: t.heading4, class: "cmt-h4" },
  { tag: t.heading5, class: "cmt-h5" },
  { tag: t.heading6, class: "cmt-h6" },
  { tag: t.monospace, class: "cmt-code" },
  { tag: t2.codeinfo, class: "cmt-codeinfo" },
  { tag: t2.taskmarker, class: "cmt-taskmarker" },
  { tag: t2.hardbreak, class: "cmt-hardbreak" },
])


export const styles = [
  themeStyle,
  syntaxHighlighting(classHighlightStyle, {fallback: true}),
]
