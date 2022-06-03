import { keymap } from "@codemirror/view"
import { indentWithTab, indentMore, indentLess, historyKeymap } from "@codemirror/commands"
import { insertLinebreak  } from "./extra"
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
// Keymap borrowed from https://wordpress.org/support/article/keyboard-shortcuts/
export const markdownKeymap = keymap.of([
  indentWithTab,
  ...historyKeymap,
  { key: 'Mod-]', run: indentMore },
  { key: 'Mod-[', run: indentLess },
  { key: 'Mod-b', run: toggleBold },
  { key: 'Mod-i', run: toggleItalic },
  { key: 'Mod-k', run: toggleLink },
  { key: 'Mod-`', run: toggleInlineCode },
  { key: 'Alt-Shift-m', mac: 'Alt-Mod-m', run: toggleImage },
  { key: 'Alt-Shift-d', mac: 'Alt-Mod-d', run: toggleStrikethrough },
  { key: 'Alt-Shift-q', mac: 'Alt-Mod-q', run: toggleBlockquote },
  { key: 'Alt-Shift-`', mac: 'Alt-Mod-`', run: toggleBlockcode },
  { key: 'Alt-Shift-o', mac: 'Alt-Mod-o', run: toggleOrderedList },
  { key: 'Alt-Shift-u', mac: 'Alt-Mod-u', run: toggleBulletList },
  { key: 'Alt-Shift-1', mac: 'Alt-Mod-1', run: toggleH1 },
  { key: 'Alt-Shift-2', mac: 'Alt-Mod-2', run: toggleH2 },
  { key: 'Alt-Shift-3', mac: 'Alt-Mod-3', run: toggleH3 },
  { key: 'Alt-Shift-4', mac: 'Alt-Mod-4', run: toggleH4 },
  { key: 'Alt-Shift-5', mac: 'Alt-Mod-5', run: toggleH5 },
  { key: 'Alt-Shift-6', mac: 'Alt-Mod-6', run: toggleH6 },
  { key: 'Shift-Enter', run: insertLinebreak },
])
