import { LanguageDescription } from "@codemirror/language"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
export { markdownLanguage } from "@codemirror/lang-markdown"


export const codeLanguages = [
  LanguageDescription.of({
    name: "html",
    load: async () => {
      return html()
    }
  }),
  LanguageDescription.of({
    name: "css",
    load: async () => {
      return css()
    }
  }),
  LanguageDescription.of({
    name: "javascript",
    alias: ["js", "javascript"],
    load: async () => {
      return javascript()
    }
  }),
  LanguageDescription.of({
    name: "typescript",
    alias: ["ts", "typescript"],
    load: async () => {
      return javascript()
    }
  }),
  LanguageDescription.of({
    name: "jsx",
    load: async () => {
      return javascript({ jsx: true })
    }
  }),
  LanguageDescription.of({
    name: "tsx",
    load: async () => {
      return javascript({ jsx: true, typescript: true })
    }
  }),
]
