import { Extension } from "@codemirror/state"
import { syntaxHighlighting, HighlightStyle, Language, LanguageDescription } from "@codemirror/language"
import { markdown as _md, markdownLanguage } from "@codemirror/lang-markdown"
import { MarkdownExtension } from "@lezer/markdown"
import { Tag, styleTags } from "@lezer/highlight"
import { codeLanguages } from "./languages"


const tags = {
  codeinfo: Tag.define(),
  hardbreak: Tag.define(),
  taskmarker: Tag.define(),
}


const markdownHighlight = {
  props: [
    styleTags({
      "CodeInfo": tags.codeinfo,
      "HardBreak": tags.hardbreak,
      "TaskMarker": tags.taskmarker,
    })
  ],
}


const classHighlightStyle = HighlightStyle.define([
  { tag: tags.codeinfo, class: "cmt-codeinfo" },
  { tag: tags.taskmarker, class: "cmt-taskmarker" },
  { tag: tags.hardbreak, class: "cmt-hardbreak" },
])


interface MarkdownOptions {
  base: Language;
  codeLanguages: LanguageDescription[];
  extensions: MarkdownExtension[];
}

export function markdown (options: MarkdownOptions = {
  base: markdownLanguage,
  codeLanguages: codeLanguages,
  extensions: [],
}) : Extension[] {
  options.extensions.push(markdownHighlight)
  return [
    _md(options),
    syntaxHighlighting(classHighlightStyle, {fallback: true}),
  ]
}
