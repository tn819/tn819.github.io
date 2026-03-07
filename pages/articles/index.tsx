import { useState, useMemo, useEffect } from 'react'

import { Page } from '../../src/components'
import { getAllArticles, Article } from '../../src/lib/articles'

import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SearchIcon from '@mui/icons-material/Search'
import DensitySmallIcon from '@mui/icons-material/DensitySmall'
import DensityLargeIcon from '@mui/icons-material/DensityLarge'
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'

interface ArticlesIndexProps {
  articles: Article[]
}

export default function ArticlesIndex({ articles }: ArticlesIndexProps) {
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
  }, [selectedTags, searchQuery, articles])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    filteredArticles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag))
    })
    selectedTags.forEach((tag) => tags.add(tag))
    return Array.from(tags).sort()
  }, [filteredArticles, selectedTags])

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
      title="High signal articles on AI, engineering, or whatever"
      action={
        <Tooltip title={expanded ? 'Collapse all' : 'Expand all'}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ color: 'text.secondary' }}
          >
            {expanded ? <DensityLargeIcon /> : <DensitySmallIcon />}
          </IconButton>
        </Tooltip>
      }
    >
      <Box sx={{ width: '100%', maxWidth: '900px' }}>
        <Box sx={{ mb: 4 }}>
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

export const getStaticProps: GetStaticProps = async () => {
  const articles = getAllArticles()

  // Remove content from props to reduce bundle size
  const articlesWithoutContent = articles.map((article) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...rest } = article
    return rest
  })

  return {
    props: {
      articles: articlesWithoutContent,
    },
  }
}
