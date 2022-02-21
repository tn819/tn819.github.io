import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Link from 'next/link'

const pages = [
  { href: '/', label: 'home' },
  { href: '/about', label: 'about' },
]

const NavBar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
          >
            {pages.map(({ href, label }) => (
              <Link key={href} href={href} passHref>
                <Button sx={{ my: 2, color: 'black', display: 'block' }}>
                  {label}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ p: 0 }}>
              <Avatar alt="Thomas Neil" src="/images/profile.jpg" />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NavBar
