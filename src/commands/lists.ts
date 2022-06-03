import { ChangeSpec, EditorSelection, EditorState, Line } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { getSelectedNode } from "../cursor"


export function toggleBulletList (view: EditorView) {
  const { state, dispatch } = view
  let userEvent = 'input'
  let dedent = false
  const mutations = state.changeByRange(range => {
    dedent = Boolean(getSelectedNode(state, range, "BulletList"))

    const startLine = state.doc.lineAt(range.from)
    let endLine = startLine
    let line = startLine
    if (!range.empty) {
      endLine = state.doc.lineAt(range.to)
    }

    const bulletRe = /^ {0,3}([*+-])\s/
    const bullet = getSurroundBullet(state, line, bulletRe)
    const changes: ChangeSpec[] = []
    const crange = { from: range.from, to: range.to }

    const recordLine = (line: Line) => {
      const m = line.text.match(bulletRe)
      if (m && dedent) {
        const width = m[0].length
        changes.push({ from: line.from, to: line.from + width })
        if (crange.from >= line.from) {
          crange.from -= Math.min(crange.from - line.from, width)
        }
        if (crange.to >= line.from) {
          crange.to -= Math.min(crange.to - line.from, width)
        }
      } else if (!m) {
        const insert = bullet
        if (crange.from >= line.from) {
          crange.from += insert.length
        }
        if (range.to >= line.from ) {
          crange.to += insert.length
        }
        changes.push({ from: line.from, insert })
        return false
      }
      return true
    }

    let dedent2 = recordLine(line)

    while (line.number < endLine.number) {
      line = state.doc.line(line.number + 1)
      dedent2 = recordLine(line)
    }
    dedent = dedent2

    return { range: EditorSelection.range(crange.from, crange.to), changes }
  })
  dispatch(mutations, { userEvent })
  return true
}

export function toggleOrderedList (view: EditorView) {
  const { state, dispatch } = view
  let userEvent = 'input'
  let dedent = false
  const mutations = state.changeByRange(range => {
    dedent = Boolean(getSelectedNode(state, range, "OrderedList"))

    const startLine = state.doc.lineAt(range.from)
    let endLine = startLine
    let line = startLine
    if (!range.empty) {
      endLine = state.doc.lineAt(range.to)
    }

    const bulletRe = /^ {0,3}(\d+)[.)]\s/
    let { index, marker } = getOrderedIndex(state, line, bulletRe)
    const changes: ChangeSpec[] = []
    const crange = { from: range.from, to: range.to }

    const recordLine = (line: Line) => {
      const m = line.text.match(bulletRe)
      if (m && dedent) {
        const width = m[0].length
        changes.push({ from: line.from, to: line.from + width })
        if (crange.from >= line.from) {
          crange.from -= Math.min(crange.from - line.from, width)
        }
        if (crange.to >= line.from) {
          crange.to -= Math.min(crange.to - line.from, width)
        }
      } else if (!m) {
        const insert = index + marker + ' '
        if (crange.from >= line.from) {
          crange.from += insert.length
        }
        if (range.to >= line.from ) {
          crange.to += insert.length
        }
        changes.push({ from: line.from, insert })
        return false
      }
      return true
    }

    let dedent2 = recordLine(line)

    while (line.number < endLine.number) {
      index += 1
      line = state.doc.line(line.number + 1)
      dedent2 = recordLine(line)
    }
    dedent = dedent2

    return { range: EditorSelection.range(crange.from, crange.to), changes }
  })
  dispatch(mutations, { userEvent })
  return true
}


export function toggleTaskList (view: EditorView) {
  const { state, dispatch } = view
  let userEvent = 'input'
  const mutations = state.changeByRange(range => {
    // TODO
    return { range }
  })
  dispatch(mutations, { userEvent })
  return true
}

function getSurroundBullet (state: EditorState, line: Line, regex: RegExp) {
  let marker = ''
  if (line.number) {
    const m1 = state.doc.line(line.number - 1).text.match(regex)
    if (m1) {
      marker = m1[1] + ' '
    }
  }
  if (!marker && line.number < state.doc.lines) {
    const m2 = state.doc.line(line.number + 1).text.match(regex)
    if (m2) {
      marker = m2[1] + ' '
    }
  }
  if (!marker) {
    return '- '
  }
  return marker
}

function getOrderedIndex (state: EditorState, line: Line, regex: RegExp) {
  let index = 0
  let marker = ''
  if (line.number) {
    const m1 = state.doc.line(line.number - 1).text.match(regex)
    if (m1) {
      if (/\.\s/.test(m1[0])) {
        marker = '.'
      } else {
        marker = ')'
      }
      index = parseInt(m1[1]) + 1
    }
  }
  if (!index && line.number < state.doc.lines) {
    const m2 = state.doc.line(line.number + 1).text.match(regex)
    if (m2) {
      if (/\.\s/.test(m2[0])) {
        marker = '.'
      } else {
        marker = ')'
      }
      index = parseInt(m2[1]) - 1
    }
  }
  if (!index) {
    index = 1
  }
  if (!marker) {
    marker = '.'
  }
  return { index, marker }
}
