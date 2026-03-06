import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#475569',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    info: {
      main: '#3B82F6',
    },
    success: {
      main: '#10B981',
    },
  },
  spacing: 4,
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      '"Electrolize", -apple-system, BlinkMacSystemFont, "Segoe UI", monospace',
    h1: {
      fontWeight: 400,
      letterSpacing: '0.05em',
      fontSize: '3rem',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 400,
      letterSpacing: '0.03em',
      fontSize: '2rem',
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 400,
      fontSize: '1.5rem',
      letterSpacing: '0.02em',
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.25rem',
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.1rem',
      letterSpacing: '0.01em',
    },
    h6: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.02em',
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    button: {
      letterSpacing: '0.1em',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 400,
          borderRadius: 4,
          padding: '10px 24px',
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), inset 0 1px 0 0 rgb(255 255 255 / 0.6)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00D9FF',
      light: '#66E8FF',
      dark: '#00A8CC',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FF006E',
      light: '#FF4D9A',
      dark: '#CC0058',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0A0A0F',
      paper: '#12121A',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#888899',
    },
    error: {
      main: '#FF3860',
    },
    warning: {
      main: '#FFB800',
    },
    info: {
      main: '#00D9FF',
    },
    success: {
      main: '#00E676',
    },
  },
  spacing: 4,
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      '"Electrolize", -apple-system, BlinkMacSystemFont, "Segoe UI", monospace',
    h1: {
      fontWeight: 400,
      letterSpacing: '0.05em',
      fontSize: '3rem',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 400,
      letterSpacing: '0.03em',
      fontSize: '2rem',
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 400,
      fontSize: '1.5rem',
      letterSpacing: '0.02em',
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.25rem',
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.1rem',
      letterSpacing: '0.01em',
    },
    h6: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.02em',
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    button: {
      letterSpacing: '0.1em',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 400,
          borderRadius: 4,
          padding: '10px 24px',
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow:
            '0 0 30px rgba(0, 217, 255, 0.15), 0 4px 6px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(0, 217, 255, 0.3)',
        },
      },
    },
  },
})

export default responsiveFontSizes(theme)
