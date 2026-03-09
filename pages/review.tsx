import { GetStaticProps } from 'next'
import { Page } from '../src/components'
import { articles as allArticles, Article } from '../src/data/articles'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Card, CardContent, Chip, Typography } from '@mui/material'

interface ReviewPageProps {
  toReview: Article[]
}

export default function ReviewPage({ toReview }: ReviewPageProps) {
  return (
    <Page title="Weekly review">
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {toReview.length} article{toReview.length !== 1 ? 's' : ''} need a
            comment
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {toReview.map((article) => (
            <Card
              key={article.slug}
              component="a"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{ lineHeight: 1.3, mb: 0.5 }}
                    >
                      {article.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 1 }}
                    >
                      {article.date}
                      {article.author ? ` · ${article.author}` : ''}
                      {article.source ? ` · ${article.source}` : ''}
                    </Typography>
                    {article.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        {article.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {article.tags.filter(Boolean).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <OpenInNewIcon
                    sx={{
                      fontSize: '1rem',
                      color: 'text.secondary',
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {toReview.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              All articles have comments.
            </Typography>
          </Box>
        )}
      </Box>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const toReview = allArticles
    .filter((a) => !a.comment || a.comment.trim() === '')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return {
    props: { toReview },
  }
}
