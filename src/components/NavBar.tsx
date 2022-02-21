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

          <Box
            sx={{ display: 'flex', flexGrow: 0, alignItems: 'center', gap: 2 }}
          >
            <IconButton
              sx={{ p: 1, backgroundColor: 'white' }}
              href={'https://www.linkedin.com/in/thomas-neil/'}
              target="_blank"
            >
              <Avatar
                alt="Linkedin"
                src="/images/social/linkedin.svg"
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <IconButton
              sx={{ p: 1, backgroundColor: 'white' }}
              href={'https://www.goodreads.com/user/show/96474981-thomas-neil'}
              target="_blank"
            >
              <Avatar
                alt="Goodreads"
                src="/images/social/goodreads.svg"
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <IconButton
              sx={{ p: 1, backgroundColor: 'white' }}
              href={'https://github.com/tn819'}
              target="_blank"
            >
              <Avatar
                alt="Github"
                src="/images/social/github.svg"
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <IconButton
              sx={{ p: 1, backgroundColor: 'white' }}
              href={'https://medium.com/@thomasneil819'}
              target="_blank"
            >
              <Avatar
                alt="Medium"
                src="/images/social/medium.svg"
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NavBar
