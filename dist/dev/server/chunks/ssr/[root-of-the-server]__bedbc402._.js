module.exports = [
  '[externals]/react [external] (react, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('react', () => require('react'))

    module.exports = mod
  },
  '[project]/src/createEmotionCache.ts [ssr] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    return __turbopack_context__.a(
      async (
        __turbopack_handle_async_dependencies__,
        __turbopack_async_result__
      ) => {
        try {
          __turbopack_context__.s(['default', () => createEmotionCache])
          var __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$cache__$5b$external$5d$__$2840$emotion$2f$cache$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$29$__ =
            __turbopack_context__.i(
              '[externals]/@emotion/cache [external] (@emotion/cache, esm_import, [project]/node_modules/@emotion/cache)'
            )
          var __turbopack_async_dependencies__ =
            __turbopack_handle_async_dependencies__([
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$cache__$5b$external$5d$__$2840$emotion$2f$cache$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$29$__,
            ])
          ;[
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$cache__$5b$external$5d$__$2840$emotion$2f$cache$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$29$__,
          ] = __turbopack_async_dependencies__.then
            ? (await __turbopack_async_dependencies__)()
            : __turbopack_async_dependencies__
          function createEmotionCache() {
            return (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$cache__$5b$external$5d$__$2840$emotion$2f$cache$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$29$__[
              'default'
            ])({
              key: 'css',
              prepend: true,
            })
          }
          __turbopack_async_result__()
        } catch (e) {
          __turbopack_async_result__(e)
        }
      },
      false
    )
  },
  '[project]/src/DarkModeContext.tsx [ssr] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    return __turbopack_context__.a(
      async (
        __turbopack_handle_async_dependencies__,
        __turbopack_async_result__
      ) => {
        try {
          __turbopack_context__.s([
            'DarkModeProvider',
            () => DarkModeProvider,
            'useDarkMode',
            () => useDarkMode,
          ])
          var __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__ =
            __turbopack_context__.i(
              '[externals]/@emotion/react/jsx-dev-runtime [external] (@emotion/react/jsx-dev-runtime, esm_import, [project]/node_modules/@emotion/react)'
            )
          var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ =
            __turbopack_context__.i('[externals]/react [external] (react, cjs)')
          var __turbopack_async_dependencies__ =
            __turbopack_handle_async_dependencies__([
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__,
            ])
          ;[
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__,
          ] = __turbopack_async_dependencies__.then
            ? (await __turbopack_async_dependencies__)()
            : __turbopack_async_dependencies__
          const DarkModeContext = /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__[
            'createContext'
          ])(undefined)
          function getInitialMode() {
            if (('TURBOPACK compile-time truthy', 1)) return true
            //TURBOPACK unreachable
            const saved = undefined
          }
          function DarkModeProvider({ children }) {
            const [darkMode, setDarkMode] = (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__[
              'useState'
            ])(true)
            const [mounted, setMounted] = (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__[
              'useState'
            ])(false)
            ;(0,
            __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__[
              'useEffect'
            ])(() => {
              // This runs once on mount to set the correct initial mode
              const initialMode = getInitialMode()
              if (initialMode !== darkMode) {
                setDarkMode(initialMode)
              }
              setMounted(true)
              // We only want this to run once, but ESLint wants darkMode in deps
              // The check above prevents infinite loops
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [])
            ;(0,
            __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__[
              'useEffect'
            ])(() => {
              if (mounted) {
                localStorage.setItem('darkMode', darkMode.toString())
              }
            }, [darkMode, mounted])
            const toggleDarkMode = () => setDarkMode(!darkMode)
            return /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
              'jsxDEV'
            ])(
              DarkModeContext.Provider,
              {
                value: {
                  darkMode,
                  toggleDarkMode,
                },
                children: children,
              },
              void 0,
              false,
              {
                fileName: '[project]/src/DarkModeContext.tsx',
                lineNumber: 50,
                columnNumber: 5,
              },
              this
            )
          }
          function useDarkMode() {
            const context = (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__[
              'useContext'
            ])(DarkModeContext)
            if (context === undefined) {
              throw new Error(
                'useDarkMode must be used within a DarkModeProvider'
              )
            }
            return context
          }
          __turbopack_async_result__()
        } catch (e) {
          __turbopack_async_result__(e)
        }
      },
      false
    )
  },
  '[project]/src/theme.ts [ssr] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s([
      'darkTheme',
      () => darkTheme,
      'default',
      () => __TURBOPACK__default__export__,
    ])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/styles/createTheme.js [ssr] (ecmascript) <export default as createTheme>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$responsiveFontSizes$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__responsiveFontSizes$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/styles/responsiveFontSizes.js [ssr] (ecmascript) <export default as responsiveFontSizes>'
      )
    const theme = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__[
      'createTheme'
    ])({
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
      shape: {
        borderRadius: 8,
      },
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
    const darkTheme = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__[
      'createTheme'
    ])({
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
      shape: {
        borderRadius: 8,
      },
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
              background: 'linear-gradient(135deg, #12121A 0%, #1A1A24 100%)',
            },
          },
        },
      },
    })
    const __TURBOPACK__default__export__ = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$responsiveFontSizes$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__responsiveFontSizes$3e$__[
      'responsiveFontSizes'
    ])(theme)
  },
  '[externals]/react/jsx-runtime [external] (react/jsx-runtime, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('react/jsx-runtime', () =>
      require('react/jsx-runtime')
    )

    module.exports = mod
  },
  '[externals]/next/dist/compiled/next-server/pages-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-turbo.runtime.dev.js, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x(
      'next/dist/compiled/next-server/pages-turbo.runtime.dev.js',
      () => require('next/dist/compiled/next-server/pages-turbo.runtime.dev.js')
    )

    module.exports = mod
  },
  '[project]/pages/_app.tsx [ssr] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    return __turbopack_context__.a(
      async (
        __turbopack_handle_async_dependencies__,
        __turbopack_async_result__
      ) => {
        try {
          __turbopack_context__.s(['default', () => MyApp])
          var __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__ =
            __turbopack_context__.i(
              '[externals]/@emotion/react/jsx-dev-runtime [external] (@emotion/react/jsx-dev-runtime, esm_import, [project]/node_modules/@emotion/react)'
            )
          var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ =
            __turbopack_context__.i('[externals]/react [external] (react, cjs)')
          var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              '[project]/src/createEmotionCache.ts [ssr] (ecmascript)'
            )
          var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              '[project]/src/DarkModeContext.tsx [ssr] (ecmascript)'
            )
          var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i('[project]/src/theme.ts [ssr] (ecmascript)')
          var __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react__$5b$external$5d$__$2840$emotion$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__ =
            __turbopack_context__.i(
              '[externals]/@emotion/react [external] (@emotion/react, esm_import, [project]/node_modules/@emotion/react)'
            )
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              '[project]/node_modules/@mui/material/esm/CssBaseline/CssBaseline.js [ssr] (ecmascript)'
            )
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ =
            __turbopack_context__.i(
              '[project]/node_modules/@mui/material/esm/styles/ThemeProvider.js [ssr] (ecmascript) <export default as ThemeProvider>'
            )
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              '[project]/node_modules/next/head.js [ssr] (ecmascript)'
            )
          var __turbopack_async_dependencies__ =
            __turbopack_handle_async_dependencies__([
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react__$5b$external$5d$__$2840$emotion$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__,
            ])
          ;[
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react__$5b$external$5d$__$2840$emotion$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__,
          ] = __turbopack_async_dependencies__.then
            ? (await __turbopack_async_dependencies__)()
            : __turbopack_async_dependencies__
          const clientSideEmotionCache = (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__[
            'default'
          ])()
          function AppContent({ Component, pageProps }) {
            const { darkMode } = (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__[
              'useDarkMode'
            ])()
            const currentTheme = (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__[
              'useMemo'
            ])(
              () =>
                darkMode
                  ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__[
                      'darkTheme'
                    ]
                  : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__[
                      'default'
                    ],
              [darkMode]
            )
            return /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__[
                'ThemeProvider'
              ],
              {
                theme: currentTheme,
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__[
                      'default'
                    ],
                    {},
                    void 0,
                    false,
                    {
                      fileName: '[project]/pages/_app.tsx',
                      lineNumber: 28,
                      columnNumber: 7,
                    },
                    this
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                    'jsxDEV'
                  ])(
                    Component,
                    {
                      ...pageProps,
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/pages/_app.tsx',
                      lineNumber: 29,
                      columnNumber: 7,
                    },
                    this
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/pages/_app.tsx',
                lineNumber: 27,
                columnNumber: 5,
              },
              this
            )
          }
          function MyApp(props) {
            const {
              Component,
              emotionCache = clientSideEmotionCache,
              pageProps,
            } = props
            return /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react__$5b$external$5d$__$2840$emotion$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                'CacheProvider'
              ],
              {
                value: emotionCache,
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__[
                      'default'
                    ],
                    {
                      children: /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                        'jsxDEV'
                      ])(
                        'meta',
                        {
                          name: 'viewport',
                          content: 'initial-scale=1, width=device-width',
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/pages/_app.tsx',
                          lineNumber: 40,
                          columnNumber: 9,
                        },
                        this
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/pages/_app.tsx',
                      lineNumber: 39,
                      columnNumber: 7,
                    },
                    this
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__[
                      'DarkModeProvider'
                    ],
                    {
                      children: /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                        'jsxDEV'
                      ])(
                        AppContent,
                        {
                          Component: Component,
                          pageProps: pageProps,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/pages/_app.tsx',
                          lineNumber: 43,
                          columnNumber: 9,
                        },
                        this
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/pages/_app.tsx',
                      lineNumber: 42,
                      columnNumber: 7,
                    },
                    this
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/pages/_app.tsx',
                lineNumber: 38,
                columnNumber: 5,
              },
              this
            )
          }
          __turbopack_async_result__()
        } catch (e) {
          __turbopack_async_result__(e)
        }
      },
      false
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__bedbc402._.js.map
