import { keymap } from "@codemirror/view"
import { indentMore, indentLess } from "@codemirror/commands"
import { insertLinebreak, toggleHorizontalRule } from "./extra"
import {
  toggleBold,
  toggleItalic,
  toggleInlineCode,
  toggleStrikethrough,
} from "./markers"
import {
  toggleLink,
  toggleImage,
} from "./links"
import {
  toggleH1,
  toggleH2,
  toggleH3,
  toggleH4,
  toggleH5,
  toggleH6,
} from "./heading"
import { toggleBlockcode  } from "./codeblock"
import { toggleBlockquote } from "./blockquote"
import { toggleOrderedList, toggleBulletList } from "./lists"

// Keyboard shortcuts
// Keymap inspired by https://wordpress.org/support/article/keyboard-shortcuts/
export const markdownKeymap = keymap.of([
  { key: 'Mod-]', run: indentMore },
  { key: 'Mod-[', run: indentLess },
  { key: 'Mod-b', run: toggleBold },
  { key: 'Mod-i', run: toggleItalic },
  { key: 'Mod-k', run: toggleLink },
  { key: 'Mod-e', run: toggleInlineCode },
  { key: 'Alt-Shift-m', mac: 'Alt-Mod-m', run: toggleImage },
  { key: 'Alt-Shift-x', mac: 'Alt-Mod-x', run: toggleStrikethrough },
  { key: 'Alt-Shift-q', mac: 'Alt-Mod-q', run: toggleBlockquote },
  { key: 'Alt-Shift-c', mac: 'Alt-Mod-c', run: toggleBlockcode },
  { key: 'Alt-Shift-o', mac: 'Alt-Mod-o', run: toggleOrderedList },
  { key: 'Alt-Shift-u', mac: 'Alt-Mod-u', run: toggleBulletList },
  { key: 'Alt-Shift-1', mac: 'Alt-Mod-1', run: toggleH1 },
  { key: 'Alt-Shift-2', mac: 'Alt-Mod-2', run: toggleH2 },
  { key: 'Alt-Shift-3', mac: 'Alt-Mod-3', run: toggleH3 },
  { key: 'Alt-Shift-4', mac: 'Alt-Mod-4', run: toggleH4 },
  { key: 'Alt-Shift-5', mac: 'Alt-Mod-5', run: toggleH5 },
  { key: 'Alt-Shift-6', mac: 'Alt-Mod-6', run: toggleH6 },
  { key: 'Alt-Shift-Enter', mac: 'Alt-Mod-Enter', run: toggleHorizontalRule },
  { key: 'Shift-Enter', run: insertLinebreak },
])
