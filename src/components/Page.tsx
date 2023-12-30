import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'

import Copyright from './Copyright'
import NavBar from './NavBar'
import Spacer from './Spacer'

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
        <Spacer size={8} />
        <Copyright />
      </Box>
    </Container>
  )
}

export default Page
