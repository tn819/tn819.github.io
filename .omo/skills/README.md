# Vault Sync Skill

This skill syncs content from your Obsidian vault to the website repository.

## Workflow

### 1. Write in Obsidian

**For Blog Posts:**

- Create in `/vault/999 Blog/`
- Add frontmatter with `published: true` to publish
- Use standard markdown with YAML frontmatter

Example:

```yaml
---
title: 'Your Post Title'
description: 'Brief description'
date: 2025-03-07
tags: ['Tag1', 'Tag2']
published: true
summary: 'Shown on blog index cards'
comment: 'Personal comment shown in quote box'
---
# Your Content Here
```

**For Articles (External Links):**

- Save to `/vault/300 Articles/`
- Same frontmatter structure
- Include the external URL in the content

### 2. Sync to Website

Run the sync command:

```bash
npm run sync:vault
```

This will:

- Copy blog posts from `/vault/999 Blog/` → `/content/blog/`
- Copy articles from `/vault/300 Articles/` → `/content/articles/`
- Only sync files with `published: true`
- Convert to MDX format with proper frontmatter

### 3. Build and Deploy

```bash
npm run build    # Build the site
npm run dev      # Test locally
# Commit and push when ready
```

## File Structure

```
vault/
├── 999 Blog/                    # Blog posts (personal writing)
│   ├── complete-gtd-setup-guide.md
│   └── welcome-ai-native-web.md
│
└── 300 Articles/                # External articles with commentary
    ├── article-with-commentary.md
    └── another-article.md

repo/
├── content/
│   ├── blog/                    # Synced from 999 Blog
│   │   ├── complete-gtd-setup-guide-from-chaos-to-clarity.mdx
│   │   └── welcome-to-the-ai-native-web.mdx
│   │
│   └── articles/                # Synced from 300 Articles
│       ├── harness-engineering-leveraging-codex-in-an-agent-first-world.mdx
│       └── the-2026-global-intelligence-crisis.mdx
│
└── .omo/skills/
    ├── vault-sync.js            # The sync script
    └── vault-sync.json          # Skill metadata
```

## Frontmatter Fields

| Field         | Required | Description                |
| ------------- | -------- | -------------------------- |
| `title`       | ✅       | Post title                 |
| `description` | ✅       | SEO description            |
| `date`        | ✅       | Publish date (YYYY-MM-DD)  |
| `tags`        | ✅       | Array of tags              |
| `published`   | ✅       | Must be `true` to sync     |
| `summary`     | Optional | Shows on blog index cards  |
| `comment`     | Optional | Personal note in quote box |

## Commands

- `npm run sync:vault` - Sync content from vault to repo
- `npm run build` - Build the website
- `npm run dev` - Test locally

## Tips

1. **Draft Mode**: Set `published: false` (or omit) while writing
2. **Date Format**: Use `YYYY-MM-DD` format
3. **Tags**: Use lowercase, hyphenated tags: `productivity`, `ai-agents`
4. **Images**: Store in vault's attachments folder, reference with relative paths
5. **Links**: Use standard markdown links - they'll be converted automatically
