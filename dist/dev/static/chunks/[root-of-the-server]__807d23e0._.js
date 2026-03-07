;(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  typeof document === 'object' ? document.currentScript : undefined,
  '[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    /// <reference path="../../../shared/runtime-types.d.ts" />
    /// <reference path="../../runtime/base/dev-globals.d.ts" />
    /// <reference path="../../runtime/base/dev-protocol.d.ts" />
    /// <reference path="../../runtime/base/dev-extensions.ts" />
    __turbopack_context__.s([
      'connect',
      () => connect,
      'setHooks',
      () => setHooks,
      'subscribeToUpdate',
      () => subscribeToUpdate,
    ])
    function connect({
      addMessageListener,
      sendMessage,
      onUpdateError = console.error,
    }) {
      addMessageListener((msg) => {
        switch (msg.type) {
          case 'turbopack-connected':
            handleSocketConnected(sendMessage)
            break
          default:
            try {
              if (Array.isArray(msg.data)) {
                for (let i = 0; i < msg.data.length; i++) {
                  handleSocketMessage(msg.data[i])
                }
              } else {
                handleSocketMessage(msg.data)
              }
              applyAggregatedUpdates()
            } catch (e) {
              console.warn(
                '[Fast Refresh] performing full reload\n\n' +
                  "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" +
                  'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' +
                  'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' +
                  'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' +
                  'Fast Refresh requires at least one parent function component in your React tree.'
              )
              onUpdateError(e)
              location.reload()
            }
            break
        }
      })
      const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS
      if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered')
      }
      globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback]) => {
          subscribeToChunkUpdate(chunkPath, sendMessage, callback)
        },
      }
      if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued) {
          subscribeToChunkUpdate(chunkPath, sendMessage, callback)
        }
      }
    }
    const updateCallbackSets = new Map()
    function sendJSON(sendMessage, message) {
      sendMessage(JSON.stringify(message))
    }
    function resourceKey(resource) {
      return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null,
      })
    }
    function subscribeToUpdates(sendMessage, resource) {
      sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource,
      })
      return () => {
        sendJSON(sendMessage, {
          type: 'turbopack-unsubscribe',
          ...resource,
        })
      }
    }
    function handleSocketConnected(sendMessage) {
      for (const key of updateCallbackSets.keys()) {
        subscribeToUpdates(sendMessage, JSON.parse(key))
      }
    }
    // we aggregate all pending updates until the issues are resolved
    const chunkListsWithPendingUpdates = new Map()
    function aggregateUpdates(msg) {
      const key = resourceKey(msg.resource)
      let aggregated = chunkListsWithPendingUpdates.get(key)
      if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(
          aggregated.instruction,
          msg.instruction
        )
      } else {
        chunkListsWithPendingUpdates.set(key, msg)
      }
    }
    function applyAggregatedUpdates() {
      if (chunkListsWithPendingUpdates.size === 0) return
      hooks.beforeRefresh()
      for (const msg of chunkListsWithPendingUpdates.values()) {
        triggerUpdate(msg)
      }
      chunkListsWithPendingUpdates.clear()
      finalizeUpdate()
    }
    function mergeChunkListUpdates(updateA, updateB) {
      let chunks
      if (updateA.chunks != null) {
        if (updateB.chunks == null) {
          chunks = updateA.chunks
        } else {
          chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks)
        }
      } else if (updateB.chunks != null) {
        chunks = updateB.chunks
      }
      let merged
      if (updateA.merged != null) {
        if (updateB.merged == null) {
          merged = updateA.merged
        } else {
          // Since `merged` is an array of updates, we need to merge them all into
          // one, consistent update.
          // Since there can only be `EcmascriptMergeUpdates` in the array, there is
          // no need to key on the `type` field.
          let update = updateA.merged[0]
          for (let i = 1; i < updateA.merged.length; i++) {
            update = mergeChunkListEcmascriptMergedUpdates(
              update,
              updateA.merged[i]
            )
          }
          for (let i = 0; i < updateB.merged.length; i++) {
            update = mergeChunkListEcmascriptMergedUpdates(
              update,
              updateB.merged[i]
            )
          }
          merged = [update]
        }
      } else if (updateB.merged != null) {
        merged = updateB.merged
      }
      return {
        type: 'ChunkListUpdate',
        chunks,
        merged,
      }
    }
    function mergeChunkListChunks(chunksA, chunksB) {
      const chunks = {}
      for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)) {
        const chunkUpdateB = chunksB[chunkPath]
        if (chunkUpdateB != null) {
          const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB)
          if (mergedUpdate != null) {
            chunks[chunkPath] = mergedUpdate
          }
        } else {
          chunks[chunkPath] = chunkUpdateA
        }
      }
      for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)) {
        if (chunks[chunkPath] == null) {
          chunks[chunkPath] = chunkUpdateB
        }
      }
      return chunks
    }
    function mergeChunkUpdates(updateA, updateB) {
      if (
        (updateA.type === 'added' && updateB.type === 'deleted') ||
        (updateA.type === 'deleted' && updateB.type === 'added')
      ) {
        return undefined
      }
      if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported')
      }
      if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported')
      }
      return undefined
    }
    function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
      const entries = mergeEcmascriptChunkEntries(
        mergedA.entries,
        mergedB.entries
      )
      const chunks = mergeEcmascriptChunksUpdates(
        mergedA.chunks,
        mergedB.chunks
      )
      return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks,
      }
    }
    function mergeEcmascriptChunkEntries(entriesA, entriesB) {
      return {
        ...entriesA,
        ...entriesB,
      }
    }
    function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
      if (chunksA == null) {
        return chunksB
      }
      if (chunksB == null) {
        return chunksA
      }
      const chunks = {}
      for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)) {
        const chunkUpdateB = chunksB[chunkPath]
        if (chunkUpdateB != null) {
          const mergedUpdate = mergeEcmascriptChunkUpdates(
            chunkUpdateA,
            chunkUpdateB
          )
          if (mergedUpdate != null) {
            chunks[chunkPath] = mergedUpdate
          }
        } else {
          chunks[chunkPath] = chunkUpdateA
        }
      }
      for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)) {
        if (chunks[chunkPath] == null) {
          chunks[chunkPath] = chunkUpdateB
        }
      }
      if (Object.keys(chunks).length === 0) {
        return undefined
      }
      return chunks
    }
    function mergeEcmascriptChunkUpdates(updateA, updateB) {
      if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined
      }
      if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = []
        const deleted = []
        const deletedModules = new Set(updateA.modules ?? [])
        const addedModules = new Set(updateB.modules ?? [])
        for (const moduleId of addedModules) {
          if (!deletedModules.has(moduleId)) {
            added.push(moduleId)
          }
        }
        for (const moduleId of deletedModules) {
          if (!addedModules.has(moduleId)) {
            deleted.push(moduleId)
          }
        }
        if (added.length === 0 && deleted.length === 0) {
          return undefined
        }
        return {
          type: 'partial',
          added,
          deleted,
        }
      }
      if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
          ...(updateA.added ?? []),
          ...(updateB.added ?? []),
        ])
        const deleted = new Set([
          ...(updateA.deleted ?? []),
          ...(updateB.deleted ?? []),
        ])
        if (updateB.added != null) {
          for (const moduleId of updateB.added) {
            deleted.delete(moduleId)
          }
        }
        if (updateB.deleted != null) {
          for (const moduleId of updateB.deleted) {
            added.delete(moduleId)
          }
        }
        return {
          type: 'partial',
          added: [...added],
          deleted: [...deleted],
        }
      }
      if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
          ...(updateA.modules ?? []),
          ...(updateB.added ?? []),
        ])
        for (const moduleId of updateB.deleted ?? []) {
          modules.delete(moduleId)
        }
        return {
          type: 'added',
          modules: [...modules],
        }
      }
      if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? [])
        if (updateA.added != null) {
          for (const moduleId of updateA.added) {
            modules.delete(moduleId)
          }
        }
        return {
          type: 'deleted',
          modules: [...modules],
        }
      }
      // Any other update combination is invalid.
      return undefined
    }
    function invariant(_, message) {
      throw new Error(`Invariant: ${message}`)
    }
    const CRITICAL = ['bug', 'error', 'fatal']
    function compareByList(list, a, b) {
      const aI = list.indexOf(a) + 1 || list.length
      const bI = list.indexOf(b) + 1 || list.length
      return aI - bI
    }
    const chunksWithIssues = new Map()
    function emitIssues() {
      const issues = []
      const deduplicationSet = new Set()
      for (const [_, chunkIssues] of chunksWithIssues) {
        for (const chunkIssue of chunkIssues) {
          if (deduplicationSet.has(chunkIssue.formatted)) continue
          issues.push(chunkIssue)
          deduplicationSet.add(chunkIssue.formatted)
        }
      }
      sortIssues(issues)
      hooks.issues(issues)
    }
    function handleIssues(msg) {
      const key = resourceKey(msg.resource)
      let hasCriticalIssues = false
      for (const issue of msg.issues) {
        if (CRITICAL.includes(issue.severity)) {
          hasCriticalIssues = true
        }
      }
      if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues)
      } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key)
      }
      emitIssues()
      return hasCriticalIssues
    }
    const SEVERITY_ORDER = ['bug', 'fatal', 'error', 'warning', 'info', 'log']
    const CATEGORY_ORDER = [
      'parse',
      'resolve',
      'code generation',
      'rendering',
      'typescript',
      'other',
    ]
    function sortIssues(issues) {
      issues.sort((a, b) => {
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity)
        if (first !== 0) return first
        return compareByList(CATEGORY_ORDER, a.category, b.category)
      })
    }
    const hooks = {
      beforeRefresh: () => {},
      refresh: () => {},
      buildOk: () => {},
      issues: (_issues) => {},
    }
    function setHooks(newHooks) {
      Object.assign(hooks, newHooks)
    }
    function handleSocketMessage(msg) {
      sortIssues(msg.issues)
      handleIssues(msg)
      switch (msg.type) {
        case 'issues':
          break
        case 'partial':
          // aggregate updates
          aggregateUpdates(msg)
          break
        default:
          // run single update
          const runHooks = chunkListsWithPendingUpdates.size === 0
          if (runHooks) hooks.beforeRefresh()
          triggerUpdate(msg)
          if (runHooks) finalizeUpdate()
          break
      }
    }
    function finalizeUpdate() {
      hooks.refresh()
      hooks.buildOk()
      // This is used by the Next.js integration test suite to notify it when HMR
      // updates have been completed.
      // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
      if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB()
        globalThis.__NEXT_HMR_CB = null
      }
    }
    function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
      return subscribeToUpdate(
        {
          path: chunkListPath,
        },
        sendMessage,
        callback
      )
    }
    function subscribeToUpdate(resource, sendMessage, callback) {
      const key = resourceKey(resource)
      let callbackSet
      const existingCallbackSet = updateCallbackSets.get(key)
      if (!existingCallbackSet) {
        callbackSet = {
          callbacks: new Set([callback]),
          unsubscribe: subscribeToUpdates(sendMessage, resource),
        }
        updateCallbackSets.set(key, callbackSet)
      } else {
        existingCallbackSet.callbacks.add(callback)
        callbackSet = existingCallbackSet
      }
      return () => {
        callbackSet.callbacks.delete(callback)
        if (callbackSet.callbacks.size === 0) {
          callbackSet.unsubscribe()
          updateCallbackSets.delete(key)
        }
      }
    }
    function triggerUpdate(msg) {
      const key = resourceKey(msg.resource)
      const callbackSet = updateCallbackSets.get(key)
      if (!callbackSet) {
        return
      }
      for (const callback of callbackSet.callbacks) {
        callback(msg)
      }
      if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key)
      }
    }
  },
  '[project]/src/createEmotionCache.ts [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => createEmotionCache])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$2f$dist$2f$emotion$2d$cache$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js [client] (ecmascript)'
      )
    function createEmotionCache() {
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$2f$dist$2f$emotion$2d$cache$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'default'
      ])({
        key: 'css',
        prepend: true,
      })
    }
    if (
      typeof globalThis.$RefreshHelpers$ === 'object' &&
      globalThis.$RefreshHelpers !== null
    ) {
      __turbopack_context__.k.registerExports(
        __turbopack_context__.m,
        globalThis.$RefreshHelpers$
      )
    }
  },
  '[project]/src/DarkModeContext.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s([
      'DarkModeProvider',
      () => DarkModeProvider,
      'useDarkMode',
      () => useDarkMode,
    ])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/react/index.js [client] (ecmascript)'
      )
    var _s = __turbopack_context__.k.signature(),
      _s1 = __turbopack_context__.k.signature()
    const DarkModeContext = /*#__PURE__*/ (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
      'createContext'
    ])(undefined)
    function getInitialMode() {
      if (
        ('TURBOPACK compile-time falsy', 0) //TURBOPACK unreachable
      );
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) return saved === 'true'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    function DarkModeProvider({ children }) {
      _s()
      const [darkMode, setDarkMode] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])(true)
      const [mounted, setMounted] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])(false)
      ;(0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useEffect'
      ])(
        {
          'DarkModeProvider.useEffect': () => {
            // This runs once on mount to set the correct initial mode
            const initialMode = getInitialMode()
            if (initialMode !== darkMode) {
              setDarkMode(initialMode)
            }
            setMounted(true)
            // We only want this to run once, but ESLint wants darkMode in deps
            // The check above prevents infinite loops
            // eslint-disable-next-line react-hooks/exhaustive-deps
          },
        }['DarkModeProvider.useEffect'],
        []
      )
      ;(0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useEffect'
      ])(
        {
          'DarkModeProvider.useEffect': () => {
            if (mounted) {
              localStorage.setItem('darkMode', darkMode.toString())
            }
          },
        }['DarkModeProvider.useEffect'],
        [darkMode, mounted]
      )
      const toggleDarkMode = () => setDarkMode(!darkMode)
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
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
    _s(DarkModeProvider, 'zCcB9/FUWWM1CpsPgfc0QP3xPuo=')
    _c = DarkModeProvider
    function useDarkMode() {
      _s1()
      const context = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useContext'
      ])(DarkModeContext)
      if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider')
      }
      return context
    }
    _s1(useDarkMode, 'b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=')
    var _c
    __turbopack_context__.k.register(_c, 'DarkModeProvider')
    if (
      typeof globalThis.$RefreshHelpers$ === 'object' &&
      globalThis.$RefreshHelpers !== null
    ) {
      __turbopack_context__.k.registerExports(
        __turbopack_context__.m,
        globalThis.$RefreshHelpers$
      )
    }
  },
  '[project]/src/theme.ts [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s([
      'darkTheme',
      () => darkTheme,
      'default',
      () => __TURBOPACK__default__export__,
    ])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/styles/createTheme.js [client] (ecmascript) <export default as createTheme>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$responsiveFontSizes$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__responsiveFontSizes$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/styles/responsiveFontSizes.js [client] (ecmascript) <export default as responsiveFontSizes>'
      )
    const theme = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__[
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
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__[
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
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$responsiveFontSizes$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__responsiveFontSizes$3e$__[
      'responsiveFontSizes'
    ])(theme)
    if (
      typeof globalThis.$RefreshHelpers$ === 'object' &&
      globalThis.$RefreshHelpers !== null
    ) {
      __turbopack_context__.k.registerExports(
        __turbopack_context__.m,
        globalThis.$RefreshHelpers$
      )
    }
  },
  '[project]/pages/_app.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => MyApp])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/react/index.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/createEmotionCache.ts [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/DarkModeContext.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/src/theme.ts [client] (ecmascript)')
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$dist$2f$emotion$2d$element$2d$489459f2$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__C__as__CacheProvider$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js [client] (ecmascript) <export C as CacheProvider>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/CssBaseline/CssBaseline.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/styles/ThemeProvider.js [client] (ecmascript) <export default as ThemeProvider>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/next/head.js [client] (ecmascript)'
      )
    var _s = __turbopack_context__.k.signature()
    const clientSideEmotionCache = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createEmotionCache$2e$ts__$5b$client$5d$__$28$ecmascript$29$__[
      'default'
    ])()
    function AppContent({ Component, pageProps }) {
      _s()
      const { darkMode } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
        'useDarkMode'
      ])()
      const currentTheme = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useMemo'
      ])(
        {
          'AppContent.useMemo[currentTheme]': () =>
            darkMode
              ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__[
                  'darkTheme'
                ]
              : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__[
                  'default'
                ],
        }['AppContent.useMemo[currentTheme]'],
        [darkMode]
      )
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__[
          'ThemeProvider'
        ],
        {
          theme: currentTheme,
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
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
    _s(AppContent, 'vivREEEks6dBfu40HUG4sbFPocY=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
          'useDarkMode'
        ],
      ]
    })
    _c = AppContent
    function MyApp(props) {
      const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
      } = props
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$dist$2f$emotion$2d$element$2d$489459f2$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__C__as__CacheProvider$3e$__[
          'CacheProvider'
        ],
        {
          value: emotionCache,
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'default'
              ],
              {
                children: /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
                'DarkModeProvider'
              ],
              {
                children: /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
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
    _c1 = MyApp
    var _c, _c1
    __turbopack_context__.k.register(_c, 'AppContent')
    __turbopack_context__.k.register(_c1, 'MyApp')
    if (
      typeof globalThis.$RefreshHelpers$ === 'object' &&
      globalThis.$RefreshHelpers !== null
    ) {
      __turbopack_context__.k.registerExports(
        __turbopack_context__.m,
        globalThis.$RefreshHelpers$
      )
    }
  },
  '[next]/entry/page-loader.ts { PAGE => "[project]/pages/_app.tsx [client] (ecmascript)" } [client] (ecmascript)',
  (__turbopack_context__, module, exports) => {
    const PAGE_PATH = '/_app'
    ;(window.__NEXT_P = window.__NEXT_P || []).push([
      PAGE_PATH,
      () => {
        return __turbopack_context__.r(
          '[project]/pages/_app.tsx [client] (ecmascript)'
        )
      },
    ])
    // @ts-expect-error module.hot exists
    if (module.hot) {
      // @ts-expect-error module.hot exists
      module.hot.dispose(function () {
        window.__NEXT_P.push([PAGE_PATH])
      })
    }
  },
  '[hmr-entry]/hmr-entry.js { ENTRY => "[project]/pages/_app" }',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.r(
      '[next]/entry/page-loader.ts { PAGE => "[project]/pages/_app.tsx [client] (ecmascript)" } [client] (ecmascript)'
    )
  },
])

//# sourceMappingURL=%5Broot-of-the-server%5D__807d23e0._.js.map
