/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const SITE_BLOG = path.join(process.cwd(), 'content/blog')

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
    // YAML list item: "  - value" belongs to the previous key
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
        // multi-line YAML list — items will be added by subsequent lines
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

function writeFrontmatter(data, body) {
  const tagLines = (data.tags || []).map((t) => `  - ${t}`).join('\n')
  const lines = [
    `title: ${JSON.stringify(data.title)}`,
    `description: ${JSON.stringify(data.description)}`,
    `date: "${data.date}"`,
    `tags:\n${tagLines}`,
    `published: ${data.published}`,
    `summary: ${JSON.stringify(data.summary)}`,
    `comment: ${JSON.stringify(data.comment)}`,
  ]
  return `---\n${lines.join('\n')}\n---\n\n${body}`
}

function processVaultFile(filePath) {
  const filename = path.basename(filePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, body } = parseFrontmatter(raw)

  const titleFromFilename = filename
    .replace(/\.md$/, '')
    .replace(/\.mdx$/, '')
    .replace(/^Blog Post - /, '')
    .replace(/[-_]/g, ' ')
    .trim()

  const title = extractH1(body) || data.title || titleFromFilename
  const description = data.description || extractDescription(body)
  const date =
    data.date || fs.statSync(filePath).mtime.toISOString().split('T')[0]

  const merged = {
    title,
    description,
    date,
    tags: data.tags || ['Blog'],
    published: data.published !== undefined ? data.published : false,
    summary: data.summary || description,
    comment: data.comment || '',
  }

  const updated = writeFrontmatter(merged, body)
  return { slug: generateSlug(filename), data: merged, content: updated }
}

function resolveVaultPath(argPath) {
  if (argPath) return path.resolve(argPath.replace(/^~/, process.env.HOME))
  const readline = require('readline')
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question('Vault blog path: ', (answer) => {
      rl.close()
      resolve(path.resolve(answer.trim().replace(/^~/, process.env.HOME)))
    })
  })
}

async function syncBlogs(argPath) {
  const vaultBlog = await resolveVaultPath(argPath)
  console.log(`🔄 Syncing blogs from ${vaultBlog}...\n`)

  if (!fs.existsSync(vaultBlog)) {
    console.error(`❌ Vault not found: ${vaultBlog}`)
    process.exit(1)
  }

  if (!fs.existsSync(SITE_BLOG)) fs.mkdirSync(SITE_BLOG, { recursive: true })

  const files = fs
    .readdirSync(vaultBlog)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

  console.log(`Found ${files.length} blog file(s) in vault\n`)

  files.forEach((filename) => {
    const vaultPath = path.join(vaultBlog, filename)
    const { slug, data, content } = processVaultFile(vaultPath)
    fs.writeFileSync(path.join(SITE_BLOG, `${slug}.mdx`), content)
    console.log(`✅ ${slug}  (published: ${data.published})`)
  })

  console.log('\n📊 Done')
}

if (require.main === module) {
  syncBlogs(process.argv[2])
}

module.exports = { syncBlogs }
