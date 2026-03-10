/* eslint-disable @typescript-eslint/no-require-imports */

function generateSlug(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/\.mdx$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function stripCodeBlocks(content) {
  return content.replace(/```[\s\S]*?```/g, '')
}

function extractH1(content) {
  const match = stripCodeBlocks(content).match(/^#\s+([^{\n]+)/m)
  return match ? match[1].trim() : null
}

function extractDescription(content) {
  const match = stripCodeBlocks(content).match(
    /^(?!#)[^\n]+(?:\n(?!#)[^\n]+)*/m
  )
  if (!match) return ''
  const text = match[0].trim().substring(0, 200)
  return text.length === 200 ? text + '...' : text
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return { data: {}, body: content }
  const end = content.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: content }
  const block = content.substring(4, end)
  const body = content.substring(end + 4).replace(/^\n/, '')
  const data = {}
  let currentKey = null
  block.split('\n').forEach((line) => {
    if (/^\s+-\s+/.test(line) && currentKey) {
      const item = line.replace(/^\s+-\s+/, '').trim()
      if (!Array.isArray(data[currentKey])) data[currentKey] = []
      data[currentKey].push(item)
      return
    }
    const colon = line.indexOf(':')
    if (colon === -1) return
    currentKey = line.substring(0, colon).trim()
    let value = line.substring(colon + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (currentKey === 'tags') {
      if (value === '') {
        data[currentKey] = []
      } else {
        try {
          data[currentKey] = JSON.parse(value)
        } catch {
          data[currentKey] = value ? [value] : []
        }
      }
    } else if (value === 'true') {
      data[currentKey] = true
    } else if (value === 'false') {
      data[currentKey] = false
    } else {
      data[currentKey] = value
    }
  })
  return { data, body }
}

module.exports = { generateSlug, stripCodeBlocks, extractH1, extractDescription, parseFrontmatter }
