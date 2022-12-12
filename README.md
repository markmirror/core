# @markmirror/core

The fundamentals of MarkMirror - a Markdown Editor based on CodeMirror 6.

## Usage

### 1. Install the package

Get the source code via npm:

```shell
npm install @markmirror/core
```

The package contains the fundamentals of the editor, and you can create
a basic editor with only the core code.

### 2. Prepare the element

Prepare a HTML element to mount the editor. For instance a `<div>`:

```html
<div id="editor"></div>
```

You can also use a `<textarea>` as the mounting element. In this case,
the editor will use the value of the textarea as the editor's content.

```html
<textarea id="editor"></textarea>
```

### 3. Insert the style

MarkMirror has a beautiful built-in CSS file. You can include the `style.css`:

```javascript
import "@markmirror/core/style.css"
```

If you don't like it, you can always use your own CSS file.

### 4. Initialize the editor

When everything is ready, you can create the javascript code:

```javascript
import { MarkMirror, markdown } from "@markmirror/core"

// initialize the editor
const editor = new MarkMirror([
  markdown(),
])
```

You can put more extensions when initializing the editor. The extensions
are compatible with codemirror. For example:

```javascript
import { keymap } from "@codemirror/view"
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands"

const editor = new MarkMirror([
  markdown(),
  history(),
  keymap.of([...defaultKeymap, ...historyKeymap]),
])
```

### 5. Render the editor

The final step is mounting the editor to the prepared element above.

```javascript
// mount the editor to #editor element
editor.render(document.getElementById("editor"))
```

If you are using a `<div>` element, and you want to add the default
content for the editor:

```javascript
const content = 'Hello **world**'
editor.render(document.getElementById("editor"), content)
```

All settled, open your browser and play with the editor.
