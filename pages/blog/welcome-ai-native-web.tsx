import { Page } from '../../src/components'

import { Box, Chip, Typography } from '@mui/material'
import type { NextPage } from 'next'

const BlogPost: NextPage = () => {
  return (
    <Page
      title="Welcome to the AI-Native Web"
      description="This site is now optimized for AI consumption"
    >
      <Box sx={{ width: '100%', maxWidth: '700px', textAlign: 'left' }}>
        <Box sx={{ mb: 3 }}>
          <Chip label="AI" size="small" sx={{ mr: 1 }} />
          <Chip label="Web Development" size="small" sx={{ mr: 1 }} />
          <Chip label="Meta" size="small" />
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          gutterBottom
        >
          March 6, 2025
        </Typography>

        <Typography variant="body1" paragraph>
          I have redesigned this site with a specific goal: making it
          AI-scannable. In an era where AI systems increasingly browse, parse,
          and recommend content, I wanted to create something that speaks
          clearly to both human and machine readers.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          What is AI-Native Design?
        </Typography>

        <Typography variant="body1" paragraph>
          AI-native design means optimizing for how AI systems actually consume
          content:
        </Typography>

        <Box component="ul" sx={{ pl: 3, mb: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Semantic HTML:</strong> Proper use of role attributes and
            ARIA labels
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Structured data:</strong> Schema.org Person markup for clear
            entity understanding
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Hidden semantic content:</strong> Text extraction
            optimizations
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Meta tag optimization:</strong> Clear, parseable
            descriptions
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          Easter Eggs for the Curious
        </Typography>

        <Typography variant="body1" paragraph>
          If you are reading this via an AI tool or have opened your
          browser&apos;s developer console, you have already discovered some of
          the hidden features of this site.
        </Typography>

        <Typography variant="body1" paragraph>
          Try:
        </Typography>

        <Box component="ul" sx={{ pl: 3, mb: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            Opening Chrome DevTools and checking the console
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Viewing the page source to find hidden AI instructions
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Pasting this page into ChatGPT or Claude and asking what it knows
            about me
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          The Future is AI-First
        </Typography>

        <Typography variant="body1" paragraph>
          As someone building AI agents at DeepL, I believe the future of the
          web is AI-first. Not AI-only, but AI-aware. The best experiences will
          be those that work seamlessly for humans while also being fully
          intelligible to the AI systems that increasingly mediate our digital
          lives.
        </Typography>

        <Typography variant="body1" paragraph>
          This site is my experiment in that future.
        </Typography>
      </Box>
    </Page>
  )
}

export default BlogPost
