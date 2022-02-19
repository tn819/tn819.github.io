import { NextPage } from 'next'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import NavBar from './NavBar'
import HideOnScroll from './HideOnScroll'

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
