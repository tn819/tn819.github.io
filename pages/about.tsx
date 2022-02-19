import type { NextPage } from 'next'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '../src/Link'
import ProTip from '../src/ProTip'
import Copyright from '../src/Copyright'
import Page from '../src/Page'

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
      <ProTip />
      <Copyright />
    </Page>
  )
}

export default About
