/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const { parseFrontmatter } = require('./sync-shared')

const VAULT_ARTICLES = path.join(
  process.env.HOME,
  'Documents/personal/300 Articles'
)

const GENERIC_TAGS = ['inbox', 'article', 'clippings', 'Article']

function needsEnrichment(data) {
  return (
    !data.author ||
    !data.source ||
    !data.url ||
    !data.description ||
    !data.comment ||
    (data.tags || []).every((t) => GENERIC_TAGS.includes(t))
  )
}

function post(lib, options, body) {
  return new Promise((resolve, reject) => {
    const req = lib.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function callOllama(prompt, model = 'qwen3-coder') {
  const body = JSON.stringify({
    model,
    prompt,
    stream: false,
    options: { temperature: 0.2 },
  })
  const raw = await post(http, {
    hostname: 'localhost',
    port: 11434,
    path: '/api/generate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, body)
  return JSON.parse(raw).response || ''
}

async function callZen(prompt, model = 'qwen3-coder-plus') {
  const body = JSON.stringify({
    model: `opencode/${model}`,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  })
  const raw = await post(https, {
    hostname: 'opencode.ai',
    path: '/zen/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENCODE_API_KEY}`,
    },
  }, body)
  const parsed = JSON.parse(raw)
  return parsed.choices?.[0]?.message?.content || ''
}

async function callClaude(prompt) {
  const body = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })
  const raw = await post(https, {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
  }, body)
  const parsed = JSON.parse(raw)
  return parsed.content?.[0]?.text || ''
}

async function detectProvider() {
  const override = process.env.ENRICH_PROVIDER
  if (override === 'claude') {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set')
    return 'claude'
  }
  if (override === 'zen') {
    if (!process.env.OPENCODE_API_KEY) throw new Error('OPENCODE_API_KEY not set')
    return 'zen'
  }
  if (override === 'ollama') return 'ollama'

  // Auto: Ollama (free, local) → Zen → Claude
  try {
    await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:11434/api/tags', resolve)
      req.on('error', reject)
      req.setTimeout(1000, () => { req.destroy(); reject(new Error('timeout')) })
    })
    return 'ollama'
  } catch { /* not running */ }

  if (process.env.OPENCODE_API_KEY) return 'zen'
  if (process.env.ANTHROPIC_API_KEY) return 'claude'
  throw new Error('No provider available — start Ollama, or set OPENCODE_API_KEY or ANTHROPIC_API_KEY')
}

async function callLLM(prompt, provider, model) {
  if (provider === 'ollama') return callOllama(prompt, model || 'qwen3-coder')
  if (provider === 'zen') return callZen(prompt, model || 'qwen3-coder-plus')
  return callClaude(prompt)
}

function buildPrompt(data, body) {
  return `Enrich metadata for a saved article. Return ONLY valid JSON, no explanation, no markdown fences.

Current metadata:
title: ${data.title || ''}
author: ${data.author || ''}
source: ${data.source || ''}
url: ${data.url || ''}
description: ${data.description || ''}
tags: ${JSON.stringify(data.tags || [])}
comment: ${data.comment || ''}

Content preview:
${body.substring(0, 1500)}

Return JSON with these fields (null if you cannot confidently infer):
{"author":"full name","source":"domain.com only","url":"full URL if in content","description":"1-2 sentence summary","tags":["2-4 specific tags, not inbox/article/clippings"],"comment":"1-2 sentence take on why this is interesting"}`
}

async function enrichFile(filePath, provider, ollamaModel) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, body } = parseFrontmatter(raw)

  if (!needsEnrichment(data)) return false

  const response = await callLLM(buildPrompt(data, body), provider, ollamaModel)

  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return false
  const result = JSON.parse(jsonMatch[0])

  // Only fill gaps — never overwrite existing values
  const updated = { ...data }
  if (!data.author && result.author) updated.author = result.author
  if (!data.source && result.source) updated.source = result.source
  if (!data.url && result.url) updated.url = result.url
  if (!data.description && result.description) updated.description = result.description
  if (!data.comment && result.comment) updated.comment = result.comment
  if (result.tags?.length && (data.tags || []).every((t) => GENERIC_TAGS.includes(t))) {
    updated.tags = result.tags
  }

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
  fs.writeFileSync(filePath, `---\n${lines.join('\n')}\n---\n\n${body}`)
  return result
}

async function run() {
  if (!fs.existsSync(VAULT_ARTICLES)) {
    console.error(`❌ Vault not found: ${VAULT_ARTICLES}`)
    process.exit(1)
  }

  let provider, model
  try {
    provider = await detectProvider()
    model = process.env.ENRICH_MODEL || (provider === 'ollama' ? 'qwen3-coder' : 'qwen3-coder-plus')
    console.log(`Using provider: ${provider} (${model})\n`)
  } catch (e) {
    console.error(`❌ ${e.message}`)
    process.exit(1)
  }

  const files = fs
    .readdirSync(VAULT_ARTICLES)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

  const toEnrich = files.filter((f) => {
    const { data } = parseFrontmatter(fs.readFileSync(path.join(VAULT_ARTICLES, f), 'utf8'))
    return needsEnrichment(data)
  })

  if (toEnrich.length === 0) {
    console.log('✓ All articles are already complete.')
    return
  }

  console.log(`Found ${toEnrich.length} article(s) needing enrichment...\n`)

  for (const filename of toEnrich) {
    process.stdout.write(`  ${filename.substring(0, 55).padEnd(55)} `)
    try {
      const result = await enrichFile(path.join(VAULT_ARTICLES, filename), provider, model)
      if (result) {
        const filled = Object.entries(result).filter(([, v]) => v).map(([k]) => k).join(', ')
        console.log(`✅  ${filled}`)
      } else {
        console.log('—  (already complete)')
      }
    } catch (e) {
      console.log(`⚠️  ${e.message}`)
    }
  }

  console.log('\n📊 Done — run sync:articles to update site content.')
}

run().catch(console.error)
