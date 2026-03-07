#!/usr/bin/env node

/**
 * Vault Sync Skill
 *
 * Syncs content from Obsidian vault to the website:
 * - /vault/999 Blog/ → /content/blog/ (blog posts)
 * - /vault/300 Articles/ → /content/articles/ (external article references)
 *
 * Only syncs files with `published: true` in frontmatter.
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// Paths
const VAULT_PATH = path.join(process.env.HOME, 'vault')
const BLOG_SOURCE = path.join(VAULT_PATH, '999 Blog')
const ARTICLES_SOURCE = path.join(VAULT_PATH, '300 Articles')
const REPO_ROOT = path.join(__dirname, '../..')
const BLOG_TARGET = path.join(REPO_ROOT, 'content/blog')
const ARTICLES_TARGET = path.join(REPO_ROOT, 'content/articles')

// Ensure target directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✓ Created directory: ${dir}`)
  }
}

// Convert markdown file to MDX with proper frontmatter
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const parsed = matter(content)

  // Check if published
  if (!parsed.data.published) {
    return null
  }

  // Get filename without extension
  const baseName = path.basename(filePath, path.extname(filePath))

  // Create slug from title or filename
  const slug = parsed.data.title
    ? parsed.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

  // Ensure required fields
  const frontmatter = {
    title: parsed.data.title || baseName,
    description: parsed.data.description || '',
    date: parsed.data.date || new Date().toISOString().split('T')[0],
    tags: parsed.data.tags || [],
    published: true,
    summary: parsed.data.summary || '',
    comment: parsed.data.comment || '',
    ...parsed.data, // Include any other custom fields
  }

  // Reconstruct with new frontmatter
  const mdxContent = matter.stringify(parsed.content, frontmatter)

  return {
    slug,
    content: mdxContent,
    originalName: baseName,
  }
}

// Sync a directory
function syncDirectory(sourceDir, targetDir, type) {
  console.log(`\n📁 Syncing ${type}...`)
  console.log(`   From: ${sourceDir}`)
  console.log(`   To: ${targetDir}`)

  if (!fs.existsSync(sourceDir)) {
    console.log(`   ⚠️  Source directory doesn't exist, skipping`)
    return { synced: 0, skipped: 0 }
  }

  ensureDir(targetDir)

  const files = fs
    .readdirSync(sourceDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

  let synced = 0
  let skipped = 0

  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file)
    const processed = processFile(sourcePath)

    if (!processed) {
      console.log(`   ⏭️  Skipped (not published): ${file}`)
      skipped++
      return
    }

    const targetPath = path.join(targetDir, `${processed.slug}.mdx`)
    fs.writeFileSync(targetPath, processed.content)
    console.log(`   ✓ Synced: ${file} → ${processed.slug}.mdx`)
    synced++
  })

  return { synced, skipped }
}

// Main sync function
function main() {
  console.log('🔄 Vault Sync Starting...\n')
  console.log(`Vault path: ${VAULT_PATH}`)
  console.log(`Repo root: ${REPO_ROOT}`)

  // Sync blog posts
  const blogResults = syncDirectory(BLOG_SOURCE, BLOG_TARGET, 'Blog Posts')

  // Sync articles
  const articlesResults = syncDirectory(
    ARTICLES_SOURCE,
    ARTICLES_TARGET,
    'Articles'
  )

  // Summary
  console.log('\n📊 Sync Summary:')
  console.log(
    `   Blog Posts: ${blogResults.synced} synced, ${blogResults.skipped} skipped`
  )
  console.log(
    `   Articles: ${articlesResults.synced} synced, ${articlesResults.skipped} skipped`
  )
  console.log('\n✅ Sync complete!')
  console.log('\nNext steps:')
  console.log('   1. Review the synced files')
  console.log('   2. Run: npm run build')
  console.log('   3. Test locally: npm run dev')
  console.log('   4. Commit and push when ready')
}

// Run if called directly
if (require.main === module) {
  try {
    main()
  } catch (error) {
    console.error('❌ Sync failed:', error.message)
    process.exit(1)
  }
}

module.exports = { syncDirectory, processFile }
