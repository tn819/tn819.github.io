module.exports = [
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
  '[externals]/react [external] (react, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('react', () => require('react'))

    module.exports = mod
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
  '[externals]/path [external] (path, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('path', () => require('path'))

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
  '[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x(
      'next/dist/compiled/@opentelemetry/api',
      () => require('next/dist/compiled/@opentelemetry/api')
    )

    module.exports = mod
  },
  '[project]/pages/_document.tsx [ssr] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    return __turbopack_context__.a(
      async (
        __turbopack_handle_async_dependencies__,
        __turbopack_async_result__
      ) => {
        try {
          __turbopack_context__.s(['default', () => MyDocument])
          var __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__ =
            __turbopack_context__.i(
              '[externals]/@emotion/react/jsx-dev-runtime [external] (@emotion/react/jsx-dev-runtime, esm_import, [project]/node_modules/@emotion/react)'
            )
          var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              '[project]/src/createEmotionCache.ts [ssr] (ecmascript)'
            )
          var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i('[project]/src/theme.ts [ssr] (ecmascript)')
          var __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$server$2f$create$2d$instance__$5b$external$5d$__$2840$emotion$2f$server$2f$create$2d$instance$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$server$29$__ =
            __turbopack_context__.i(
              '[externals]/@emotion/server/create-instance [external] (@emotion/server/create-instance, esm_import, [project]/node_modules/@emotion/server)'
            )
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              '[project]/node_modules/next/document.js [ssr] (ecmascript)'
            )
          var __turbopack_async_dependencies__ =
            __turbopack_handle_async_dependencies__([
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$server$2f$create$2d$instance__$5b$external$5d$__$2840$emotion$2f$server$2f$create$2d$instance$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$server$29$__,
            ])
          ;[
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$server$2f$create$2d$instance__$5b$external$5d$__$2840$emotion$2f$server$2f$create$2d$instance$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$server$29$__,
          ] = __turbopack_async_dependencies__.then
            ? (await __turbopack_async_dependencies__)()
            : __turbopack_async_dependencies__
          class MyDocument extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__[
            'default'
          ] {
            render() {
              return /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                'jsxDEV'
              ])(
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__[
                  'Html'
                ],
                {
                  lang: 'en',
                  children: [
                    /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                      'jsxDEV'
                    ])(
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__[
                        'Head'
                      ],
                      {
                        children: [
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'theme-color',
                              content:
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__[
                                  'default'
                                ].palette.primary.main,
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 38,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'link',
                            {
                              rel: 'shortcut icon',
                              href: '/favicon.ico',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 39,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'description',
                              content:
                                'Thomas Neil - Full-Stack AI Builder and Implementer. Building AI-native applications at DeepL. Expert in TypeScript, React, Node.js, and agentic systems.',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 42,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'keywords',
                              content:
                                'AI Engineer, Full-Stack Developer, TypeScript, React, Node.js, DeepL, Agentic Systems, Berlin',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 46,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'author',
                              content: 'Thomas Neil',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 50,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'robots',
                              content:
                                'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 51,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              property: 'og:type',
                              content: 'website',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 57,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              property: 'og:title',
                              content: 'Thomas Neil - Full-Stack AI Builder',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 58,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              property: 'og:description',
                              content:
                                'Building AI-native applications. Full-Stack AI Implementer at DeepL.',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 62,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              property: 'og:site_name',
                              content: 'Thomas Neil',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 66,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'twitter:card',
                              content: 'summary_large_image',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 69,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'twitter:creator',
                              content: '@thomasneil819',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 70,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'twitter:title',
                              content: 'Thomas Neil - Full-Stack AI Builder',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 71,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'meta',
                            {
                              name: 'twitter:description',
                              content:
                                'Building AI-native applications at DeepL. Full-Stack AI Implementer.',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 75,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'script',
                            {
                              type: 'application/ld+json',
                              dangerouslySetInnerHTML: {
                                __html: JSON.stringify({
                                  '@context': 'https://schema.org',
                                  '@type': 'Person',
                                  name: 'Thomas Neil',
                                  jobTitle:
                                    'Full-Stack AI Builder and Implementer',
                                  description:
                                    'Building a horizontal browser use agent at DeepL. Expert in TypeScript, React, Node.js, and agentic systems.',
                                  url: 'https://thomas-neil.vercel.app',
                                  sameAs: [
                                    'https://www.linkedin.com/in/thomas-neil/',
                                    'https://github.com/tn819',
                                    'https://bsky.app/profile/thomas-neil.bsky.social',
                                    'https://mastodon.social/@thomasneil',
                                    'https://medium.com/@thomasneil819',
                                    'https://www.goodreads.com/user/show/96474981-thomas-neil',
                                  ],
                                  worksFor: {
                                    '@type': 'Organization',
                                    name: 'DeepL',
                                    description:
                                      'AI company building best-in-class translation and language models',
                                  },
                                  knowsAbout: [
                                    'Artificial Intelligence',
                                    'Agentic Systems',
                                    'Browser Automation',
                                    'TypeScript',
                                    'React',
                                    'Node.js',
                                    'Full-Stack Development',
                                    'AI Applications',
                                  ],
                                  skills:
                                    'TypeScript, JavaScript, Python, React, Next.js, Node.js, AI/ML Integration, Browser Automation, API Design, System Architecture',
                                }),
                              },
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 81,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'link',
                            {
                              rel: 'preconnect',
                              href: 'https://fonts.googleapis.com',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 123,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'link',
                            {
                              rel: 'preconnect',
                              href: 'https://fonts.gstatic.com',
                              crossOrigin: 'anonymous',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 124,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'link',
                            {
                              href: 'https://fonts.googleapis.com/css2?family=Electrolize&display=swap',
                              rel: 'stylesheet',
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 129,
                              columnNumber: 11,
                            },
                            this
                          ),
                          this.props.emotionStyleTags,
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: '[project]/pages/_document.tsx',
                        lineNumber: 13,
                        columnNumber: 9,
                      },
                      this
                    ),
                    /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                      'jsxDEV'
                    ])(
                      'body',
                      {
                        children: [
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            'script',
                            {
                              dangerouslySetInnerHTML: {
                                __html: `
                (function() {
                  try {
                    const saved = localStorage.getItem('darkMode')
                    if (saved !== null) {
                      if (saved === 'false') document.documentElement.classList.add('light')
                    } else if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('light')
                    }
                  } catch (e) {}
                })()
              `,
                              },
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 139,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__[
                              'Main'
                            ],
                            {},
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 178,
                              columnNumber: 11,
                            },
                            this
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                            'jsxDEV'
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__[
                              'NextScript'
                            ],
                            {},
                            void 0,
                            false,
                            {
                              fileName: '[project]/pages/_document.tsx',
                              lineNumber: 179,
                              columnNumber: 11,
                            },
                            this
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: '[project]/pages/_document.tsx',
                        lineNumber: 138,
                        columnNumber: 9,
                      },
                      this
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: '[project]/pages/_document.tsx',
                  lineNumber: 12,
                  columnNumber: 7,
                },
                this
              )
            }
          }
          // `getInitialProps` belongs to `_document` (instead of `_app`)
          MyDocument.getInitialProps = async (ctx) => {
            const originalRenderPage = ctx.renderPage
            const cache = (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__[
              'default'
            ])()
            const { extractCriticalToChunks } = (0,
            __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$server$2f$create$2d$instance__$5b$external$5d$__$2840$emotion$2f$server$2f$create$2d$instance$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$server$29$__[
              'default'
            ])(cache)
            ctx.renderPage = () =>
              originalRenderPage({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                enhanceApp: (App) =>
                  function EnhanceApp(props) {
                    return /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                      'jsxDEV'
                    ])(
                      App,
                      {
                        emotionCache: cache,
                        ...props,
                      },
                      void 0,
                      false,
                      {
                        fileName: '[project]/pages/_document.tsx',
                        lineNumber: 197,
                        columnNumber: 18,
                      },
                      this
                    )
                  },
              })
            const initialProps =
              await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__[
                'default'
              ].getInitialProps(ctx)
            const emotionStyles = extractCriticalToChunks(initialProps.html)
            const emotionStyleTags = emotionStyles.styles.map((style) =>
              /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$externals$5d2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$2840$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$29$__[
                'jsxDEV'
              ])(
                'style',
                {
                  'data-emotion': `${style.key} ${style.ids.join(' ')}`,
                  dangerouslySetInnerHTML: {
                    __html: style.css,
                  },
                },
                style.key,
                false,
                {
                  fileName: '[project]/pages/_document.tsx',
                  lineNumber: 204,
                  columnNumber: 5,
                },
                ('TURBOPACK compile-time value', void 0)
              )
            )
            return {
              ...initialProps,
              emotionStyleTags,
            }
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

//# sourceMappingURL=%5Broot-of-the-server%5D__a530268d._.js.map
