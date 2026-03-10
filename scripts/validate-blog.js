/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const SITE_BLOG = path.join(process.cwd(), 'content/blog')

// Convert heading text to a valid anchor slug
function headingToAnchor(text) {
  return text
    .toLowerCase()
    .replace(/[`*_[\]()]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Fix anchor links that use unencoded spaces or wrong casing
function fixAnchorLinks(body) {
  return body.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, (match, text, anchor) => {
    if (anchor.includes(' ') || anchor !== anchor.toLowerCase()) {
      return `[${text}](#${headingToAnchor(anchor)})`
    }
    return match
  })
}

// Extract heading text without inline markdown (links, bold, code)
function cleanHeadingText(raw) {
  return raw
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
    .replace(/[*_`]/g, '')
    .trim()
}

// Generate a TOC from all ## headings, replacing any existing ## Table of Contents block
function regenerateTOC(body) {
  const lines = body.split('\n')
  const headings = []

  // Collect all ## headings (skip TOC itself)
  for (const line of lines) {
    const m = line.match(/^## (.+)/)
    if (!m) continue
    const text = cleanHeadingText(m[1])
    if (text.toLowerCase() === 'table of contents') continue
    headings.push(text)
  }

  if (headings.length === 0) return body

  const tocLines = headings.map(
    (text, i) => `${i + 1}. [${text}](#${headingToAnchor(text)})`
  )
  const newTOC = `## Table of Contents\n\n${tocLines.join('\n')}`

  // Replace existing TOC block if present
  const tocPattern = /^## Table of Contents\n[\s\S]*?(?=\n---\n|\n## |\n$)/m
  if (tocPattern.test(body)) {
    return body.replace(tocPattern, newTOC + '\n')
  }

  // No existing TOC — insert after the first paragraph
  const firstHeadingIdx = lines.findIndex((l) => /^## /.test(l))
  if (firstHeadingIdx > 2) {
    lines.splice(firstHeadingIdx, 0, newTOC, '')
    return lines.join('\n')
  }

  return body
}

// Strip inline links from heading lines (## Heading [text](url) → ## Heading)
function cleanInlineLinksInHeadings(body) {
  return body
    .replace(/^(#{1,6} .*?)\s*\[[^\]]*\]\([^)]*\)\s*$/gm, '$1')
}

// Ensure a blank line exists before every heading (## or deeper) that follows
// non-blank content — unless the heading immediately follows the frontmatter or another heading.
function fixHeadingSpacing(body) {
  return body.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
}

// Collapse 3+ consecutive blank lines to 2
function collapseExcessiveBlankLines(body) {
  return body.replace(/\n{3,}/g, '\n\n')
}

// Remove trailing whitespace from each line
function removeTrailingWhitespace(body) {
  return body
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
}

function validateAndFix(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const fixes = []

  // Split off frontmatter
  let body = raw
  let frontmatter = ''
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3)
    if (end !== -1) {
      frontmatter = raw.substring(0, end + 4)
      body = raw.substring(end + 4).replace(/^\n+/, '') // strip leading blank lines
    }
  }

  let fixed = body

  const beforeHeadingLinks = fixed
  fixed = cleanInlineLinksInHeadings(fixed)
  if (fixed !== beforeHeadingLinks) fixes.push('removed inline links from headings')

  const beforeTOC = fixed
  fixed = regenerateTOC(fixed)
  if (fixed !== beforeTOC) fixes.push('regenerated table of contents')

  const beforeAnchor = fixed
  fixed = fixAnchorLinks(fixed)
  if (fixed !== beforeAnchor) fixes.push('fixed anchor links (spaces/casing)')

  const beforeHeadings = fixed
  fixed = fixHeadingSpacing(fixed)
  if (fixed !== beforeHeadings) fixes.push('added blank lines before headings')

  const beforeBlanks = fixed
  fixed = collapseExcessiveBlankLines(fixed)
  if (fixed !== beforeBlanks) fixes.push('collapsed excessive blank lines')

  const beforeTrailing = fixed
  fixed = removeTrailingWhitespace(fixed)
  if (fixed !== beforeTrailing) fixes.push('removed trailing whitespace')

  // Ensure file ends with single newline
  fixed = fixed.trimEnd() + '\n'

  const result = frontmatter
    ? `${frontmatter}\n\n${fixed}`
    : fixed

  if (result !== raw) {
    fs.writeFileSync(filePath, result)
    return fixes
  }
  return []
}

function run() {
  const files = fs
    .readdirSync(SITE_BLOG)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

  if (files.length === 0) {
    console.log('No blog files found.')
    return
  }

  console.log(`Validating ${files.length} blog file(s)...\n`)
  let anyFixed = false

  files.forEach((filename) => {
    const filePath = path.join(SITE_BLOG, filename)
    const fixes = validateAndFix(filePath)
    if (fixes.length > 0) {
      console.log(`✅ ${filename}`)
      fixes.forEach((f) => console.log(`   · ${f}`))
      anyFixed = true
    } else {
      console.log(`✓  ${filename}  (no issues)`)
    }
  })

  if (anyFixed) console.log('\nDone — all issues fixed.')
  else console.log('\nAll files are clean.')
}

if (require.main === module) {
  run()
}

module.exports = { validateAndFix }
