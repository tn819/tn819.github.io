import { useState, useMemo, useEffect } from 'react'

import { Page } from '../../src/components'

import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SearchIcon from '@mui/icons-material/Search'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

interface ExternalArticle {
  title: string
  author: string
  source: string
  url: string
  description: string
  tags: string[]
  comment: string
  date: string
}

const articles: ExternalArticle[] = [
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

const ArticlesIndex: NextPage = () => {
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    if (!router.isReady) return

    const { tags, q } = router.query

    if (tags) {
      const tagParam = Array.isArray(tags) ? tags.join(',') : tags
      setSelectedTags(tagParam.split(',').filter(Boolean))
    }

    if (q && typeof q === 'string') {
      setSearchQuery(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const updateUrl = (tags: string[], query: string) => {
    const params = new URLSearchParams()
    if (tags.length > 0) {
      params.set('tags', tags.join(','))
    }
    if (query) {
      params.set('q', query)
    }
    const newUrl = params.toString()
      ? `/articles?${params.toString()}`
      : '/articles'
    router.replace(newUrl, undefined, { shallow: true })
  }

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    articles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  const filteredArticles = useMemo(() => {
    let result = articles

    if (selectedTags.length > 0) {
      result = result.filter((article) =>
        selectedTags.some((tag) => article.tags.includes(tag))
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return result
  }, [selectedTags, searchQuery])

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(newTags)
    updateUrl(newTags, searchQuery)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    updateUrl(selectedTags, query)
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
    router.replace('/articles', undefined, { shallow: true })
  }

  const hasActiveFilters =
    selectedTags.length > 0 || searchQuery.trim().length > 0

  return (
    <Page
      title="ARTICLES"
      description="High signal writing on AI, engineering, and building"
    >
      <Box sx={{ width: '100%', maxWidth: '900px' }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              High signal writing on AI, engineering, and building
            </Typography>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{ color: 'text.secondary' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: 'text.secondary', fontSize: '1.2rem' }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
              alignItems: 'center',
            }}
          >
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onClick={() => toggleTag(tag)}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                  },
                }}
              />
            ))}
            {hasActiveFilters && (
              <Chip
                label="Clear"
                size="small"
                onClick={clearFilters}
                color="secondary"
                variant="outlined"
                sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {hasActiveFilters && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              Showing {filteredArticles.length} of {articles.length} articles
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: expanded ? 3 : 1.5,
          }}
        >
          {filteredArticles.map((article, index) => (
            <Card
              key={index}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => window.open(article.url, '_blank')}
            >
              <CardContent
                sx={{
                  p: expanded ? 3 : 1.5,
                  '&:last-child': { pb: expanded ? 3 : 1.5 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: expanded ? 'flex-start' : 'center',
                    mb: expanded ? 1 : 0,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant={expanded ? 'h6' : 'body1'}
                      fontWeight={600}
                      sx={{
                        lineHeight: expanded ? 1.3 : 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: expanded ? 'normal' : 'nowrap',
                      }}
                    >
                      {article.title}
                    </Typography>
                    {expanded && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 0.5 }}
                      >
                        {article.date} · {article.author} · {article.source}
                      </Typography>
                    )}
                    {!expanded && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {article.date}
                      </Typography>
                    )}
                  </Box>
                  <OpenInNewIcon
                    sx={{
                      fontSize: expanded ? '1rem' : '0.9rem',
                      color: 'text.secondary',
                      ml: 1,
                      flexShrink: 0,
                    }}
                  />
                </Box>

                {expanded && (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontStyle: 'italic' }}
                    >
                      &ldquo;{article.comment}&rdquo;
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {article.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTag(tag)
                          }}
                          color={
                            selectedTags.includes(tag) ? 'primary' : 'default'
                          }
                          variant={
                            selectedTags.includes(tag) ? 'filled' : 'outlined'
                          }
                          sx={{
                            mr: 1,
                            mb: 1,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        />
                      ))}
                    </Box>

                    <Typography variant="body2">
                      {article.description}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {filteredArticles.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              No articles match your filters.
            </Typography>
            <Chip
              label="CLEAR FILTERS"
              size="small"
              onClick={clearFilters}
              color="primary"
              sx={{ mt: 2, cursor: 'pointer' }}
            />
          </Box>
        )}
      </Box>
    </Page>
  )
}

export default ArticlesIndex
