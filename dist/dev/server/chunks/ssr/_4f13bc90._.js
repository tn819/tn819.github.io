module.exports = [
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

//# sourceMappingURL=_4f13bc90._.js.map
