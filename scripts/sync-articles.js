/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const { parseFrontmatter, generateSlug, extractH1, extractDescription } = require('./sync-shared')

const SITE_ARTICLES = path.join(process.cwd(), 'content/articles')

function writeFrontmatter(data, body) {
  const tagLines = (data.tags || []).map((t) => `  - ${t}`).join('\n')
  const lines = [
    `title: ${JSON.stringify(data.title)}`,
    `description: ${JSON.stringify(data.description)}`,
    `date: "${data.date}"`,
    `tags:\n${tagLines}`,
    `published: ${data.published}`,
    `comment: ${JSON.stringify(data.comment)}`,
    `author: ${JSON.stringify(data.author)}`,
    `source: ${JSON.stringify(data.source)}`,
    `url: ${JSON.stringify(data.url)}`,
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
    tags: data.tags || [],
    published: data.published === true,
    comment: data.comment || '',
    author: data.author || '',
    source: data.source || '',
    url: data.url || '',
  }

  const updated = writeFrontmatter(merged, body)
  return { slug: generateSlug(filename), data: merged, content: updated }
}

function resolveVaultPath(argPath) {
  if (argPath) return path.resolve(argPath.replace(/^~/, process.env.HOME))
  const readline = require('readline')
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question('Vault articles path: ', (answer) => {
      rl.close()
      resolve(path.resolve(answer.trim().replace(/^~/, process.env.HOME)))
    })
  })
}

async function syncArticles(argPath) {
  const vaultArticles = await resolveVaultPath(argPath)
  console.log(`🔄 Syncing articles from ${vaultArticles}...\n`)

  if (!fs.existsSync(vaultArticles)) {
    console.error(`❌ Vault not found: ${vaultArticles}`)
    process.exit(1)
  }

  if (!fs.existsSync(SITE_ARTICLES)) fs.mkdirSync(SITE_ARTICLES, { recursive: true })

  const files = fs
    .readdirSync(vaultArticles)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

  console.log(`Found ${files.length} article(s) in vault\n`)

  files.forEach((filename) => {
    const vaultPath = path.join(vaultArticles, filename)
    const { slug, data, content } = processVaultFile(vaultPath)
    fs.writeFileSync(path.join(SITE_ARTICLES, `${slug}.mdx`), content)
    console.log(`✅ ${slug}  (published: ${data.published})`)
  })

  console.log('\n📊 Done')
}

if (require.main === module) {
  syncArticles(process.argv[2])
}

module.exports = { syncArticles }
