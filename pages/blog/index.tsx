import { Page } from '../../src/components'

import { Box, Typography } from '@mui/material'
import type { NextPage } from 'next'

const BlogIndex: NextPage = () => {
  return (
    <Page
      title="Blog"
      description="Thoughts on AI, engineering, and building the future"
    >
      <Box
        sx={{ width: '100%', maxWidth: '800px', textAlign: 'center', py: 8 }}
      >
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Blog posts are being written. Check back later!
        </Typography>
      </Box>
    </Page>
  )
}

export default BlogIndex
