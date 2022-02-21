import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'

import NavBar from './NavBar'

const Page: NextPage<{ title: string }> = ({ children, title }) => {
  return (
    <Container maxWidth="lg">
      <NavBar />
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold' }}
          gutterBottom
        >
          {title}
        </Typography>
        {children}
      </Box>
    </Container>
  )
}

export default Page
