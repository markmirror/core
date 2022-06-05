# @markmirror/core

The fundamentals of MarkMirror - a Markdown Editor based on CodeMirror 6.

## Usage

```
// <div id="editor"></div>

const editor = new MarkMirror()
editor.render(document.getElementById("editor"))

// set default content string
// editor.render(document.getElementById("editor"), { content: '....' })
```

If mount on a `<textarea>`, it will take the textarea value as the default content string.
