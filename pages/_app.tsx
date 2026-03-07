import { useMemo } from 'react'

import createEmotionCache from '../src/createEmotionCache'
import { DarkModeProvider, useDarkMode } from '../src/DarkModeContext'
import theme, { darkTheme } from '../src/theme'

import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function AppContent({
  Component,
  pageProps,
}: Pick<MyAppProps, 'Component' | 'pageProps'>) {
  const { darkMode } = useDarkMode()
  const currentTheme = useMemo(() => (darkMode ? darkTheme : theme), [darkMode])

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Thomas Neil — AI Engineer & Builder ⚡</title>
      </Head>
      <DarkModeProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </DarkModeProvider>
    </CacheProvider>
  )
}
