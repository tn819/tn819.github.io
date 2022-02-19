import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'

import HideOnScroll from './HideOnScroll'
import NavBar from './NavBar'

const Page: NextPage<{ title: string }> = ({ children, title }) => {
  return (
    <Container maxWidth="lg">
      <HideOnScroll>
        <NavBar />
      </HideOnScroll>
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {children}
      </Box>
    </Container>
  )
}

export default Page
