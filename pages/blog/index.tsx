import { useState, useMemo, useEffect } from 'react'

import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Page } from '../../src/components'
import { getAllBlogPosts, BlogPost } from '../../src/lib/blog'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'

interface BlogIndexProps {
  posts: BlogPost[]
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

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
    const newUrl = params.toString() ? `/blog?${params.toString()}` : '/blog'
    router.replace(newUrl, undefined, { shallow: true })
  }

  const filteredPosts = useMemo(() => {
    let result = posts

    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return result
  }, [selectedTags, searchQuery, posts])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    filteredPosts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag))
    })
    selectedTags.forEach((tag) => tags.add(tag))
    return Array.from(tags).sort()
  }, [filteredPosts, selectedTags])

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
    router.replace('/blog', undefined, { shallow: true })
  }

  const hasActiveFilters =
    selectedTags.length > 0 || searchQuery.trim().length > 0

  return (
    <Page title="Blog">
      <Box sx={{ width: '100%', maxWidth: '900px' }}>
        {/* Search and Tags */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search posts..."
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
              Showing {filteredPosts.length} of {posts.length} posts
            </Typography>
          )}
        </Box>

        {/* Posts Grid */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredPosts.map((post) => (
            <Card
              key={post.slug}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => router.push(`/blog/${post.slug}`)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTag(tag)
                      }}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
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

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {post.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.description}
                </Typography>

                {/* Summary preview */}
                {post.summary && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      fontStyle: 'italic',
                      color: 'text.secondary',
                    }}
                  >
                    &ldquo;{post.summary}&rdquo;
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {filteredPosts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              No posts match your filters.
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
  const posts = getAllBlogPosts()

  // Remove content from props to reduce bundle size
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const postsWithoutContent = posts.map(({ content, ...post }) => post)

  return {
    props: {
      posts: postsWithoutContent,
    },
  }
}
