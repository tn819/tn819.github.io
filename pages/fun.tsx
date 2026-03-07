import { Page } from '../src/components'

import StarIcon from '@mui/icons-material/Star'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

import type { GoodreadsBook } from './api/goodreads'
import type { LetterboxdFilm } from './api/letterboxd'

function StarRating({
  rating,
  maxStars = 5,
}: {
  rating: number
  maxStars?: number
}) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
      {[...Array(maxStars)].map((_, i) => (
        <StarIcon
          key={i}
          sx={{
            fontSize: 14,
            color:
              i < fullStars
                ? '#FFD700'
                : i === fullStars && hasHalfStar
                ? '#FFD700'
                : 'text.disabled',
            opacity:
              i < fullStars || (i === fullStars && hasHalfStar) ? 1 : 0.3,
          }}
        />
      ))}
      <Typography
        variant="caption"
        sx={{ ml: 0.5, fontWeight: 600, color: 'text.secondary' }}
      >
        {rating.toFixed(1)}
      </Typography>
    </Box>
  )
}

const FunPage: NextPage = () => {
  const [films, setFilms] = useState<LetterboxdFilm[]>([])
  const [books, setBooks] = useState<GoodreadsBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filmsRes, booksRes] = await Promise.all([
          fetch('/api/letterboxd'),
          fetch('/api/goodreads'),
        ])

        if (!filmsRes.ok || !booksRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const filmsData = await filmsRes.json()
        const booksData = await booksRes.json()

        setFilms(filmsData)
        setBooks(booksData)
      } catch {
        setError('Could not load your media data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Page title="">
      <Box sx={{ width: '100%', maxWidth: '900px' }}>
        {/* Movies Section Header */}
        <Box
          sx={{
            width: '100%',
            mb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              Movies
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Recently watched and rated
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            href="https://letterboxd.com/tommylvberlin"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
            sx={{
              textTransform: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Follow on Letterboxd
          </Button>
        </Box>

        {/* Movies Grid */}
        <Box sx={{ width: '100%', mb: 6 }}>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, i) => (
                <Grid key={i} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Box sx={{ height: '100%' }}>
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        width: '100%',
                        aspectRatio: '2/3',
                        borderRadius: 1,
                        mb: 1.5,
                        minHeight: { xs: 180, sm: 220, md: 260 },
                      }}
                    />
                    <Skeleton variant="text" width="95%" sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Grid container spacing={3}>
              {films.map((film) => (
                <Grid key={film.link} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Card
                    component="a"
                    href={film.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textDecoration: 'none',
                      bgcolor: 'background.paper',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 8px 24px rgba(255, 107, 107, 0.15)'
                            : '0 8px 24px rgba(255, 107, 107, 0.2)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        film.imageUrl ||
                        'https://via.placeholder.com/300x450?text=No+Poster'
                      }
                      alt={film.title}
                      sx={{
                        aspectRatio: '2/3',
                        objectFit: 'cover',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.3,
                          mb: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {film.title}
                      </Typography>
                      {film.directors.length > 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          {film.directors[0]}
                        </Typography>
                      )}
                      {film.rating && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <StarIcon sx={{ fontSize: 14, color: '#FFD700' }} />
                          <Typography variant="caption" fontWeight={600}>
                            {film.rating}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Books Section Header */}
        <Box
          sx={{
            width: '100%',
            mb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              Books
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Currently reading and recently finished
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            href="https://www.goodreads.com/user/show/96474981"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
            sx={{
              textTransform: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Connect on Goodreads
          </Button>
        </Box>

        {/* Books Grid */}
        <Box sx={{ width: '100%' }}>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(4)].map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={150}
                      sx={{ borderRadius: 1, flexShrink: 0 }}
                    />
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        pt: 1,
                      }}
                    >
                      <Skeleton variant="text" width="95%" sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="70%" sx={{ mb: 2 }} />
                      <Skeleton
                        variant="rounded"
                        width={60}
                        height={24}
                        sx={{ mt: 'auto' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid key={book.link} size={{ xs: 12, sm: 6, md: 4 }}>
                  <BookCard book={book} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Page>
  )
}

function BookCard({ book }: { book: GoodreadsBook }) {
  return (
    <Card
      component="a"
      href={book.link}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'flex',
        textDecoration: 'none',
        bgcolor: 'background.paper',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(78, 205, 196, 0.15)'
              : '0 8px 24px rgba(78, 205, 196, 0.2)',
        },
      }}
    >
      <CardMedia
        component="img"
        image={
          book.coverUrl || 'https://via.placeholder.com/150x220?text=No+Cover'
        }
        alt={book.title}
        sx={{
          width: 100,
          height: 150,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.author}
          </Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          {book.shelf === 'currently-reading' && (
            <Chip
              label="Reading"
              size="small"
              sx={{
                alignSelf: 'flex-start',
                bgcolor: '#4ECDC4',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}

          {book.shelf === 'read' && book.userRating && (
            <StarRating rating={book.userRating} />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default FunPage
