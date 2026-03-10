/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const https = require('https')
const { parseFrontmatter, generateSlug } = require('./sync-shared')

const VAULT_ARTICLES = path.join(
  process.env.HOME,
  'Documents/personal/300 Articles'
)

function needsEnrichment(data) {
  return (
    !data.author ||
    !data.source ||
    !data.url ||
    !data.description ||
    !data.comment ||
    (data.tags || []).some((t) =>
      ['inbox', 'article', 'clippings', 'Article'].includes(t)
    )
  )
}

function callClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')

  const body = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            resolve(parsed.content?.[0]?.text || '')
          } catch {
            reject(new Error('Failed to parse Claude response'))
          }
        })
      }
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function enrichFile(filePath) {
  const filename = path.basename(filePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, body } = parseFrontmatter(raw)

  if (!needsEnrichment(data)) return false

  const preview = body.substring(0, 1500)
  const prompt = `You are enriching metadata for a saved article. Based on the title, existing metadata, and content preview, fill in any missing fields.

Current metadata:
- title: ${data.title || '(missing)'}
- author: ${data.author || '(missing)'}
- source: ${data.source || '(missing)'}
- url: ${data.url || '(missing)'}
- description: ${data.description || '(missing)'}
- tags: ${JSON.stringify(data.tags || [])}
- comment: ${data.comment || '(missing)'}

Content preview:
${preview}

Return ONLY a JSON object with these fields (use null for anything you cannot confidently infer):
{
  "author": "...",
  "source": "domain.com only, not full URL",
  "url": "full URL if found in content",
  "description": "1-2 sentence summary",
  "tags": ["2-4 specific tags, no generic ones like inbox/article/clippings"],
  "comment": "1-2 sentence personal take on why this is interesting"
}`

  let result
  try {
    const response = await callClaude(prompt)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return false
    result = JSON.parse(jsonMatch[0])
  } catch {
    console.error(`  ⚠️  Claude failed for ${filename}`)
    return false
  }

  // Merge — only fill gaps, don't overwrite existing good values
  const updated = { ...data }
  if (!data.author && result.author) updated.author = result.author
  if (!data.source && result.source) updated.source = result.source
  if (!data.url && result.url) updated.url = result.url
  if (!data.description && result.description) updated.description = result.description
  if (!data.comment && result.comment) updated.comment = result.comment
  if (result.tags?.length) {
    const hasGeneric = (data.tags || []).every((t) =>
      ['inbox', 'article', 'clippings', 'Article'].includes(t)
    )
    if (hasGeneric) updated.tags = result.tags
  }

  // Rewrite frontmatter
  const tagLines = (updated.tags || []).map((t) => `  - ${t}`).join('\n')
  const lines = [
    `title: ${JSON.stringify(updated.title || '')}`,
    `author: ${JSON.stringify(updated.author || '')}`,
    `source: ${JSON.stringify(updated.source || '')}`,
    `url: ${JSON.stringify(updated.url || '')}`,
    `description: ${JSON.stringify(updated.description || '')}`,
    `tags:\n${tagLines}`,
    `published: ${updated.published === true ? 'true' : 'false'}`,
    `comment: ${JSON.stringify(updated.comment || '')}`,
    `date: "${updated.date || ''}"`,
  ]
  const newContent = `---\n${lines.join('\n')}\n---\n\n${body}`
  fs.writeFileSync(filePath, newContent)
  return result
}

async function run() {
  if (!fs.existsSync(VAULT_ARTICLES)) {
    console.error(`❌ Vault not found: ${VAULT_ARTICLES}`)
    process.exit(1)
  }

  const files = fs
    .readdirSync(VAULT_ARTICLES)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

  const toEnrich = files.filter((f) => {
    const raw = fs.readFileSync(path.join(VAULT_ARTICLES, f), 'utf8')
    const { data } = parseFrontmatter(raw)
    return needsEnrichment(data)
  })

  if (toEnrich.length === 0) {
    console.log('✓ All articles are already complete.')
    return
  }

  console.log(`Found ${toEnrich.length} article(s) needing enrichment...\n`)

  for (const filename of toEnrich) {
    process.stdout.write(`  ${filename.substring(0, 60)}... `)
    const result = await enrichFile(path.join(VAULT_ARTICLES, filename))
    if (result) {
      const filled = Object.entries(result)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(', ')
      console.log(`✅ filled: ${filled}`)
    } else {
      console.log('(skipped)')
    }
  }

  console.log('\n📊 Done — run sync:articles to update site content.')
}

run().catch(console.error)
