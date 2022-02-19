import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'

import { Copyright, Link, Page } from '../src/components'

const About: NextPage = () => {
  return (
    <Page title="About">
      <Typography variant="body1" gutterBottom>
        I am a Berlin-based software engineer
      </Typography>
      <Box maxWidth="sm">
        <Button variant="contained" component={Link} noLinkStyle href="/">
          Go to the home page
        </Button>
      </Box>
      <Copyright />
    </Page>
  )
}

export default About
