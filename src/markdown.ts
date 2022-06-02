import { LanguageDescription } from "@codemirror/language"
import { html } from "@codemirror/lang-html"
export { markdownLanguage } from "@codemirror/lang-markdown"


export const codeLanguages = [
  LanguageDescription.of({
    name: "html",
    load: async () => {
      return html()
    }
  })
]
