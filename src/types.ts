import { Extension } from "@codemirror/state"
import { MarkdownExtension } from "@lezer/markdown"
import { Language, LanguageDescription } from "@codemirror/language"

export interface MarkMirrorOptions {
  extensions?: Extension[],
  addKeymap?: boolean,
  mdBase?: Language,
  mdExtensions?: MarkdownExtension,
  codeLanguages?: readonly LanguageDescription[],
}
