// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

// Hardcoded articles from pages/articles/index.tsx
const articles = [
  {
    title: 'TBM 406: Seeing Everything, Understanding Nothing',
    author: 'John Cutler',
    source: 'cutlefish.substack.com',
    url: 'https://cutlefish.substack.com/p/tbm-406-seeing-everything-understanding',
    description:
      'The context trap - AI is supercharging legacy leadership assumptions about context and control.',
    tags: ['AI', 'Leadership', 'Thinking'],
    comment:
      'Essential reading on the dangers of over-contextualizing in AI systems.',
    date: '2026-02-13',
  },
  {
    title: 'The Harness Problem',
    author: 'Can Bölük',
    source: 'blog.can.ac',
    url: 'https://blog.can.ac/2026/02/12/the-harness-problem/',
    description:
      'Improving 15 LLMs at coding in one afternoon. Only the harness changed.',
    tags: ['AI', 'Agents', 'Engineering'],
    comment:
      'The edit tool is the variable that matters most for coding agents.',
    date: '2026-02-12',
  },
  {
    title: 'Perplexity Computer Launches AI Tool with Autonomous Capabilities',
    author: "Tim O'Neill",
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/timoneill_who-guessed-that-perplexity-would-be-first-activity-7432537799150665728-CpeC',
    description:
      'The race is to the top right, where AI agents work autonomously and have real control over your desktop.',
    tags: ['AI', 'Agents', 'Tools'],
    comment: 'Analysis of where AI tools are headed in 2026.',
    date: '2026-02-07',
  },
  {
    title: "AINews: Anthropic's Agent Autonomy Study",
    author: 'Swyx',
    source: 'latent.space',
    url: 'https://www.latent.space/p/ainews-anthropics-agent-autonomy',
    description:
      "Anthropic's study of its own API usage patterns measuring AI agent autonomy in practice.",
    tags: ['AI', 'Agents', 'Research'],
    comment: 'Data on how Claude Code usage grew from 25 mins to 45+ mins.',
    date: '2026-02-06',
  },
  {
    title: "OpenAI's Agent-First Codebase Learnings",
    author: 'Alex Lavaee',
    source: 'alexlavaee.me',
    url: 'https://alexlavaee.me/blog/openai-agent-first-codebase-learnings/',
    description:
      '5-month experiment: build and ship a real product with zero manually-written code.',
    tags: ['AI', 'Agents', 'Engineering'],
    comment:
      "OpenAI's Harness team produced ~1,500 merged PRs with 3 engineers.",
    date: '2026-02-05',
  },
  {
    title: 'Anthropic Releases SKILLS for AI Agents',
    author: 'Dallin Bentley',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/dallinbentley_the-next-big-thing-in-ai-is-file-systems-activity-7415180783226855425-UX6R',
    description:
      'Files that live alongside your AI agent. The agent can read these files just like it would when working with a codebase.',
    tags: ['AI', 'Agents', 'Tools'],
    comment: 'A shift toward file-system-based agent memory.',
    date: '2026-02-04',
  },
  {
    title: 'The "AI Grifter" Crowd and Claude Code',
    author: 'Giorgio Vilardo',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/giorgiovilardo_the-ai-grifter-crowd-has-officially-hopped-activity-7418297453428449280-nKnt',
    description:
      'Moving away from the "VS Code clone sidebar" and towards CLI agents.',
    tags: ['AI', 'Agents', 'Tools'],
    comment: 'Architectural shift from GUI to CLI-based AI agents.',
    date: '2026-02-02',
  },
  {
    title: 'AGENTS.md Outperforms Skills in Our Agent Evals',
    author: 'Jude Gao',
    source: 'vercel.com',
    url: 'https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals',
    description:
      'A compressed 8KB docs index embedded directly in AGENTS.md achieved a 100% pass rate, while skills maxed out at 79%.',
    tags: ['AI', 'Agents', 'Engineering'],
    comment: 'Passive context beats active retrieval for AI coding agents.',
    date: '2026-01-28',
  },
  {
    title: 'So You Want to Hire a Forward Deployed Engineer',
    author: 'Tiffany Siu',
    source: 'review.firstround.com',
    url: 'https://review.firstround.com/so-you-want-to-hire-a-forward-deployed-engineer/',
    description:
      'What FDEs actually do and how to hire the right one for your team.',
    tags: ['Career', 'Engineering', 'Hiring'],
    comment:
      'FDEs help build incrementally more valuable products from concrete use cases.',
    date: '2026-01-20',
  },
  {
    title: "2026 Interview Questions I'm Asking Engineers",
    author: 'Punn Kam',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/punnkam_2026-interview-questions-im-asking-engineers-activity-7414697854138531840-69wW',
    description:
      '"You\'re in the middle of a refactor and the model says 8% context left before auto-compaction. What do you do?"',
    tags: ['AI', 'Career', 'Hiring'],
    comment:
      'Questions that tell you more than any Leetcode problem ever could.',
    date: '2026-01-15',
  },
  {
    title: 'Effective Harnesses for Long-Running Agents',
    author: 'Anthropic',
    source: 'anthropic.com',
    url: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents',
    description:
      'Creating a more effective harness for long-running agents, inspired by human engineers.',
    tags: ['AI', 'Agents', 'Engineering'],
    comment:
      'How to make agents make consistent progress across multiple context windows.',
    date: '2025-11-26',
  },
  {
    title:
      'Speed at the Cost of Quality: How Cursor AI Increases Short-Term Velocity and Long-Term Complexity',
    author: 'Multiple Authors',
    source: 'arxiv.org',
    url: 'https://arxiv.org/abs/2511.04427',
    description:
      'How Cursor AI increases short-term velocity and long-term complexity in open-source projects.',
    tags: ['AI', 'Agents', 'Research'],
    comment: 'MSR 2026 paper on the tradeoffs of AI-assisted coding.',
    date: '2025-11-08',
  },
  {
    title: 'When ChatGPT Broke an Entire Field: An Oral History',
    author: 'John Pavlus',
    source: 'quantamagazine.org',
    url: 'https://www.quantamagazine.org/when-chatgpt-broke-an-entire-field-an-oral-history-20250430/',
    description: 'How LLMs upended the field of NLP in just a few years.',
    tags: ['AI', 'History', 'Research'],
    comment: 'Fascinating oral history of the AI paradigm shift.',
    date: '2025-04-30',
  },
  {
    title: 'How We Solved Hallucination in LLMs with Open Source Code',
    author: 'Leon Chlon, PhD',
    source: 'linkedin.com',
    url: 'https://www.linkedin.com/posts/leochlon_ai-machinelearning-opensource-activity-7373621516581773312-sad6',
    description:
      "LLM hallucinations aren't bugs - they're compression artifacts.",
    tags: ['AI', 'Research', 'Open Source'],
    comment: 'Revolutionary approach to hallucination detection.',
    date: '2024-12-15',
  },
  {
    title: 'The Prompt Report',
    author: 'Sander Schulhoff',
    source: 'learnprompting.org',
    url: 'https://learnprompting.org/blog/the_prompt_report',
    description:
      'The most comprehensive study of prompting ever done - 1,500+ academic papers analyzed.',
    tags: ['AI', 'Prompt Engineering', 'Research'],
    comment: '80+ page survey of all prompting techniques.',
    date: '2024-12-12',
  },
  {
    title: 'Building Effective AI Agents',
    author: 'Erik Schluntz & Barry Zhang',
    source: 'anthropic.com',
    url: 'https://www.anthropic.com/research/building-effective-agents',
    description:
      'Best practices and patterns for building production AI agents.',
    tags: ['AI', 'Agents', 'Best Practices'],
    comment:
      'The definitive guide to agent architecture from the team behind Claude.',
    date: '2024-10-01',
  },
  {
    title: 'Claude Squad',
    author: 'SMTG-AI',
    source: 'github.com',
    url: 'https://github.com/smtg-ai/claude-squad',
    description:
      'Manage multiple AI terminal agents like Claude Code, Aider, Codex, OpenCode, and Amp.',
    tags: ['AI', 'Tools', 'Open Source'],
    comment: 'Multi-agent orchestration for terminal-based AI coding.',
    date: '2024-06-15',
  },
  {
    title: 'The Rise of the AI Engineer',
    author: 'Swyx',
    source: 'latent.space',
    url: 'https://www.latent.space/p/ai-engineer',
    description: 'Why AI engineering is becoming the hottest role in tech.',
    tags: ['AI', 'Career', 'Engineering'],
    comment: 'Required reading for anyone building with LLMs professionally.',
    date: '2023-09-01',
  },
  {
    title: 'LLM Powered Autonomous Agents',
    author: 'Lilian Weng',
    source: 'lilianweng.github.io',
    url: 'https://lilianweng.github.io/posts/2023-06-23-agent/',
    description: 'Comprehensive overview of agent architectures and patterns.',
    tags: ['AI', 'LLM', 'Agents', 'Research'],
    comment: 'The canonical reference for understanding agent design patterns.',
    date: '2023-06-23',
  },
]

const VAULT_INBOX = path.join(process.env.HOME, 'vault/000 Inbox')

if (!fs.existsSync(VAULT_INBOX)) {
  console.log('Creating inbox directory...')
  fs.mkdirSync(VAULT_INBOX, { recursive: true })
}

console.log(`Writing ${articles.length} articles to ${VAULT_INBOX}...`)

articles.forEach((article) => {
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const fileName = `${slug}.md`
  const filePath = path.join(VAULT_INBOX, fileName)

  const fileContent = `---
title: "${article.title}"
author: "${article.author}"
source: "${article.source}"
url: "${article.url}"
description: "${article.description}"
tags: ${JSON.stringify(article.tags)}
comment: "${article.comment}"
date: "${article.date}"
published: true
---

# ${article.title}

[Link to original article](${article.url})

> ${article.comment}

${article.description}
`

  fs.writeFileSync(filePath, fileContent)
  console.log(`✓ Created: ${fileName}`)
})

console.log('Done!')
