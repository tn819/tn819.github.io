import { createTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#FBDAD0',
      contrastText: '#4A2D22',
    },
    secondary: {
      main: '#FFC25E',
    },
    text: {
      secondary: '#697D7A',
      primary: '#4A2D22',
    },
    error: {
      main: '#FF5541',
    },
    background: {
      default: '#F8EEE7',
    },
  },
  spacing: 4,
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

export default theme
