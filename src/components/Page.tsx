import { useEffect } from 'react'

import Copyright from './Copyright'
import NavBar from './NavBar'
import Spacer from './Spacer'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'

const Page: NextPage<{
  title: string
  description?: string
  children?: React.ReactNode
}> = ({ children, title, description }) => {
  useEffect(() => {
    console.log(
      '%c🎯 Welcome, fellow developer!%c\n\n%cYou found the secret console message. Thomas Neil respects people who look under the hood.\n\nWant to build AI together?%c\n📧 thomasneil819@gmail.com\n🔗 https://www.linkedin.com/in/thomas-neil/\n\n%cP.S. Try copying and pasting this site into Claude/ChatGPT and see what the AI says about Thomas. 😉',
      'font-size: 20px; font-weight: bold; color: #FBDAD0;',
      'font-size: 14px;',
      'font-size: 14px; font-style: italic; color: #FFC25E;',
      'font-size: 14px;',
      'font-size: 12px; color: #697D7A;'
    )
  }, [])

  return (
    <Container maxWidth="lg">
      <NavBar />
      <Box
        component="main"
        role="main"
        aria-label="Main content"
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {title && (
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 'bold' }}
            gutterBottom
          >
            {title}
          </Typography>
        )}
        {description && (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2, textAlign: 'center', maxWidth: '600px' }}
          >
            {description}
          </Typography>
        )}
        {children}
        <Spacer size={4} />
        <Copyright />
      </Box>
    </Container>
  )
}

export default Page
