import { useDarkMode } from '../DarkModeContext'

import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'

const pages = [
  { href: '/about', label: 'about' },
  { href: '/blog', label: 'blog' },
  { href: '/articles', label: 'articles' },
]

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/thomas-neil/',
    label: 'LinkedIn',
    icon: '/images/social/linkedin.svg',
  },
  {
    href: 'https://github.com/tn819',
    label: 'GitHub',
    icon: '/images/social/github.svg',
  },
  {
    href: 'https://bsky.app/profile/thomas-neil.bsky.social',
    label: 'Bluesky',
    icon: '/images/social/bluesky.svg',
  },
  {
    href: 'https://mastodon.social/@thomasneil',
    label: 'Mastodon',
    icon: '/images/social/mastodon.svg',
  },
]

const NavBar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(href)
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        width: '100%',
        background: 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: '64px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              fontWeight: 400,
              letterSpacing: '0.1em',
              color: 'primary.main',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            THOMAS NEIL
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {pages.map(({ href, label }) => {
              const active = isActive(href)
              return (
                <Button
                  key={href}
                  href={href}
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    fontWeight: active ? 600 : 400,
                    letterSpacing: '0.1em',
                    fontSize: '0.8rem',
                    position: 'relative',
                    '&:hover': {
                      color: 'primary.main',
                    },
                    '&::after': active
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '60%',
                          height: 2,
                          bgcolor: 'primary.main',
                          borderRadius: 1,
                        }
                      : {},
                  }}
                >
                  {label}
                </Button>
              )
            })}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {socialLinks.map(({ href, label, icon }) => (
            <Tooltip key={href} title={label}>
              <IconButton
                size="small"
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Avatar
                  alt={label}
                  src={icon}
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: '#E0E0E0',
                    p: 0.5,
                    borderRadius: 1,
                    '& img': {
                      objectFit: 'contain',
                    },
                  }}
                  variant="square"
                />
              </IconButton>
            </Tooltip>
          ))}

          <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
            <IconButton
              size="small"
              onClick={toggleDarkMode}
              sx={{
                ml: 2,
                color: darkMode ? 'warning.main' : 'text.secondary',
                '&:hover': {
                  color: 'warning.main',
                },
              }}
            >
              {darkMode ? (
                <LightbulbIcon sx={{ fontSize: 22 }} />
              ) : (
                <LightbulbOutlinedIcon sx={{ fontSize: 22 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export default NavBar
