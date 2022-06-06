import { keymap, Command } from "@codemirror/view"
import { StateCommand } from "@codemirror/state"
import { indentMore, indentLess, undo, redo } from "@codemirror/commands"
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


export const markdownActionMap : {[key: string]: Command | StateCommand} = {
  'undo': undo,
  'redo': redo,
  'bold': toggleBold,
  'italic': toggleItalic,
  'codespan': toggleInlineCode,
  'link': toggleLink,
  'image': toggleImage,
  'strikethrough': toggleStrikethrough,
  'codeblock': toggleBlockcode,
  'blockquote': toggleBlockquote,
  'br': insertLinebreak,
  'ul': toggleBulletList,
  'ol': toggleOrderedList,
  'hr': toggleHorizontalRule,
  'h1': toggleH1,
  'h2': toggleH2,
  'h3': toggleH3,
  'h4': toggleH4,
  'h5': toggleH5,
  'h6': toggleH6,
}


export const markdownNodeMenus : {[key: string]: string} = {
  "StrongEmphasis": "bold",
  "Emphasis": "italic",
  "InlineCode": "codespan",
  "Link": "link",
  "Image": "image",
  "Strikethrough": "strikethrough",
  "FencedCode": "codeblock",
  "CodeBlock": "codeblock",
  "Blockquote": "blockquote",
  "BulletList": "ul",
  "OrderedList": "ol",
  "HorizontalRule": "hr",
  "ATXHeading1": "h1",
  "ATXHeading2": "h2",
  "ATXHeading3": "h3",
  "ATXHeading4": "h4",
  "ATXHeading5": "h5",
  "ATXHeading6": "h6",
}
