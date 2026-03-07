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
  '[project]/src/components/Copyright.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => Copyright])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript)'
      )
    function Copyright() {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
          'default'
        ],
        {
          variant: 'body2',
          color: 'text.secondary',
          align: 'center',
          children: ['Copyright © ', new Date().getFullYear(), ' Thomas Neil'],
        },
        void 0,
        true,
        {
          fileName: '[project]/src/components/Copyright.tsx',
          lineNumber: 5,
          columnNumber: 5,
        },
        this
      )
    }
    _c = Copyright
    var _c
    __turbopack_context__.k.register(_c, 'Copyright')
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
  '[project]/src/components/NavBar.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/DarkModeContext.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Lightbulb$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/icons-material/esm/Lightbulb.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LightbulbOutlined$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/icons-material/esm/LightbulbOutlined.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$AppBar$2f$AppBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/AppBar/AppBar.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Avatar/Avatar.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Box/Box.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Button/Button.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/IconButton/IconButton.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Toolbar/Toolbar.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Tooltip/Tooltip.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/next/router.js [client] (ecmascript)'
      )
    var _s = __turbopack_context__.k.signature()
    const pages = [
      {
        href: '/about',
        label: 'about',
      },
      {
        href: '/blog',
        label: 'blog',
      },
      {
        href: '/articles',
        label: 'articles',
      },
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
      _s()
      const { darkMode, toggleDarkMode } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
        'useDarkMode'
      ])()
      const router = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useRouter'
      ])()
      const isActive = (href) => {
        if (href === '/') {
          return router.pathname === '/'
        }
        return router.pathname.startsWith(href)
      }
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$AppBar$2f$AppBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
          'default'
        ],
        {
          position: 'static',
          elevation: 0,
          sx: {
            width: '100%',
            background: 'transparent',
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'default'
            ],
            {
              sx: {
                px: {
                  xs: 2,
                  sm: 4,
                  md: 6,
                },
                display: 'flex',
                justifyContent: 'space-between',
                minHeight: '64px',
              },
              children: [
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'default'
                  ],
                  {
                    sx: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    },
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'default'
                        ],
                        {
                          variant: 'h6',
                          component: 'a',
                          href: '/',
                          sx: {
                            fontWeight: 400,
                            letterSpacing: '0.1em',
                            color: 'primary.main',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8,
                            },
                          },
                          children: 'THOMAS NEIL',
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/src/components/NavBar.tsx',
                          lineNumber: 75,
                          columnNumber: 11,
                        },
                        ('TURBOPACK compile-time value', void 0)
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'default'
                        ],
                        {
                          sx: {
                            display: 'flex',
                            gap: 1,
                          },
                          children: pages.map(({ href, label }) => {
                            const active = isActive(href)
                            return /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                'default'
                              ],
                              {
                                href: href,
                                sx: {
                                  color: active
                                    ? 'primary.main'
                                    : 'text.secondary',
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
                                },
                                children: label,
                              },
                              href,
                              false,
                              {
                                fileName: '[project]/src/components/NavBar.tsx',
                                lineNumber: 97,
                                columnNumber: 17,
                              },
                              ('TURBOPACK compile-time value', void 0)
                            )
                          }),
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/src/components/NavBar.tsx',
                          lineNumber: 93,
                          columnNumber: 11,
                        },
                        ('TURBOPACK compile-time value', void 0)
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: '[project]/src/components/NavBar.tsx',
                    lineNumber: 74,
                    columnNumber: 9,
                  },
                  ('TURBOPACK compile-time value', void 0)
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'default'
                  ],
                  {
                    sx: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    },
                    children: [
                      socialLinks.map(({ href, label, icon }) =>
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                            'default'
                          ],
                          {
                            title: label,
                            children: /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                'default'
                              ],
                              {
                                size: 'small',
                                sx: {
                                  p: 0.5,
                                  color: 'text.secondary',
                                  '&:hover': {
                                    color: 'primary.main',
                                  },
                                },
                                href: href,
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                'aria-label': label,
                                children: /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                  'jsxDEV'
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                    'default'
                                  ],
                                  {
                                    alt: label,
                                    src: icon,
                                    sx: {
                                      width: 28,
                                      height: 28,
                                      bgcolor: '#E0E0E0',
                                      p: 0.5,
                                      borderRadius: 1,
                                      '& img': {
                                        objectFit: 'contain',
                                      },
                                    },
                                    variant: 'square',
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName:
                                      '[project]/src/components/NavBar.tsx',
                                    lineNumber: 148,
                                    columnNumber: 17,
                                  },
                                  ('TURBOPACK compile-time value', void 0)
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: '[project]/src/components/NavBar.tsx',
                                lineNumber: 134,
                                columnNumber: 15,
                              },
                              ('TURBOPACK compile-time value', void 0)
                            ),
                          },
                          href,
                          false,
                          {
                            fileName: '[project]/src/components/NavBar.tsx',
                            lineNumber: 133,
                            columnNumber: 13,
                          },
                          ('TURBOPACK compile-time value', void 0)
                        )
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'default'
                        ],
                        {
                          title: darkMode ? 'Light mode' : 'Dark mode',
                          children: /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                            'jsxDEV'
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                              'default'
                            ],
                            {
                              size: 'small',
                              onClick: toggleDarkMode,
                              sx: {
                                ml: 2,
                                color: darkMode
                                  ? 'warning.main'
                                  : 'text.secondary',
                                '&:hover': {
                                  color: 'warning.main',
                                },
                              },
                              children: darkMode
                                ? /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Lightbulb$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                      'default'
                                    ],
                                    {
                                      sx: {
                                        fontSize: 22,
                                      },
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        '[project]/src/components/NavBar.tsx',
                                      lineNumber: 180,
                                      columnNumber: 17,
                                    },
                                    ('TURBOPACK compile-time value', void 0)
                                  )
                                : /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LightbulbOutlined$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                      'default'
                                    ],
                                    {
                                      sx: {
                                        fontSize: 22,
                                      },
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        '[project]/src/components/NavBar.tsx',
                                      lineNumber: 182,
                                      columnNumber: 17,
                                    },
                                    ('TURBOPACK compile-time value', void 0)
                                  ),
                            },
                            void 0,
                            false,
                            {
                              fileName: '[project]/src/components/NavBar.tsx',
                              lineNumber: 168,
                              columnNumber: 13,
                            },
                            ('TURBOPACK compile-time value', void 0)
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/src/components/NavBar.tsx',
                          lineNumber: 167,
                          columnNumber: 11,
                        },
                        ('TURBOPACK compile-time value', void 0)
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: '[project]/src/components/NavBar.tsx',
                    lineNumber: 131,
                    columnNumber: 9,
                  },
                  ('TURBOPACK compile-time value', void 0)
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: '[project]/src/components/NavBar.tsx',
              lineNumber: 66,
              columnNumber: 7,
            },
            ('TURBOPACK compile-time value', void 0)
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/src/components/NavBar.tsx',
          lineNumber: 56,
          columnNumber: 5,
        },
        ('TURBOPACK compile-time value', void 0)
      )
    }
    _s(NavBar, 'fv/2avIRV5eBt9QQh5Th3x68pVc=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$DarkModeContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
          'useDarkMode'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
          'useRouter'
        ],
      ]
    })
    _c = NavBar
    const __TURBOPACK__default__export__ = NavBar
    var _c
    __turbopack_context__.k.register(_c, 'NavBar')
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
  '[project]/src/components/Spacer.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Box/Box.js [client] (ecmascript) <export default as Box>'
      )
    const Spacer = ({ size = 1, variant = 'vertical' }) =>
      /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
          'Box'
        ],
        {
          sx: {
            pb: variant === 'vertical' ? size : undefined,
            pr: variant !== 'vertical' ? size : undefined,
          },
        },
        void 0,
        false,
        {
          fileName: '[project]/src/components/Spacer.tsx',
          lineNumber: 9,
          columnNumber: 3,
        },
        ('TURBOPACK compile-time value', void 0)
      )
    _c = Spacer
    const __TURBOPACK__default__export__ = Spacer
    var _c
    __turbopack_context__.k.register(_c, 'Spacer')
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
  '[project]/src/components/Page.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/react/index.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Copyright$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Copyright.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NavBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/NavBar.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spacer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Spacer.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Box/Box.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Container/Container.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript)'
      )
    var _s = __turbopack_context__.k.signature()
    const Page = ({ children, title, description, action }) => {
      _s()
      ;(0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useEffect'
      ])(
        {
          'Page.useEffect': () => {
            console.log(
              '%c🎯 Welcome, fellow developer!%c\n\n%cYou found the secret console message. Thomas Neil respects people who look under the hood.\n\nWant to build AI together?%c\n🔗 https://www.linkedin.com/in/thomas-neil/\n\n%cP.S. Try copying and pasting this site into Claude/ChatGPT and see what the AI says about Thomas. 😉',
              'font-size: 20px; font-weight: bold; color: #FBDAD0;',
              'font-size: 14px;',
              'font-size: 14px; font-style: italic; color: #FFC25E;',
              'font-size: 14px;',
              'font-size: 12px; color: #697D7A;'
            )
          },
        }['Page.useEffect'],
        []
      )
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
          'default'
        ],
        {
          maxWidth: 'lg',
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NavBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
                'default'
              ],
              {},
              void 0,
              false,
              {
                fileName: '[project]/src/components/Page.tsx',
                lineNumber: 31,
                columnNumber: 7,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'default'
              ],
              {
                component: 'main',
                role: 'main',
                'aria-label': 'Main content',
                sx: {
                  my: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                children: [
                  (title || action) &&
                    /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'default'
                      ],
                      {
                        sx: {
                          width: '100%',
                          maxWidth: '900px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: description ? 2 : 0,
                        },
                        children: [
                          title &&
                            /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                'default'
                              ],
                              {
                                variant: 'h4',
                                component: 'h1',
                                sx: {
                                  fontWeight: 'bold',
                                },
                                children: title,
                              },
                              void 0,
                              false,
                              {
                                fileName: '[project]/src/components/Page.tsx',
                                lineNumber: 56,
                                columnNumber: 15,
                              },
                              ('TURBOPACK compile-time value', void 0)
                            ),
                          action,
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: '[project]/src/components/Page.tsx',
                        lineNumber: 45,
                        columnNumber: 11,
                      },
                      ('TURBOPACK compile-time value', void 0)
                    ),
                  description &&
                    /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'default'
                      ],
                      {
                        variant: 'h6',
                        color: 'text.secondary',
                        sx: {
                          mb: 2,
                          textAlign: 'left',
                          width: '100%',
                          maxWidth: '900px',
                        },
                        children: description,
                      },
                      void 0,
                      false,
                      {
                        fileName: '[project]/src/components/Page.tsx',
                        lineNumber: 68,
                        columnNumber: 11,
                      },
                      ('TURBOPACK compile-time value', void 0)
                    ),
                  children,
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spacer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
                      'default'
                    ],
                    {
                      size: 4,
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/src/components/Page.tsx',
                      lineNumber: 77,
                      columnNumber: 9,
                    },
                    ('TURBOPACK compile-time value', void 0)
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Copyright$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
                      'default'
                    ],
                    {},
                    void 0,
                    false,
                    {
                      fileName: '[project]/src/components/Page.tsx',
                      lineNumber: 78,
                      columnNumber: 9,
                    },
                    ('TURBOPACK compile-time value', void 0)
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/src/components/Page.tsx',
                lineNumber: 32,
                columnNumber: 7,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/src/components/Page.tsx',
          lineNumber: 30,
          columnNumber: 5,
        },
        ('TURBOPACK compile-time value', void 0)
      )
    }
    _s(Page, 'OD7bBpZva5O2jO+Puf00hKivP7c=')
    _c = Page
    const __TURBOPACK__default__export__ = Page
    var _c
    __turbopack_context__.k.register(_c, 'Page')
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
  '[project]/src/components/Link.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s([
      'NextLinkComposed',
      () => NextLinkComposed,
      'default',
      () => __TURBOPACK__default__export__,
    ])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/clsx/dist/clsx.mjs [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/react/index.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Link/Link.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/styles/styled.js [client] (ecmascript) <locals> <export default as styled>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/next/link.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/next/router.js [client] (ecmascript)'
      )
    var _s = __turbopack_context__.k.signature()
    // Add support for the sx prop for consistency with the other branches.
    const Anchor = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__[
      'styled'
    ])('a')({})
    _c = Anchor
    const NextLinkComposed =
      /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'forwardRef'
      ](function NextLinkComposed(props, ref) {
        const {
          to,
          linkAs,
          replace,
          scroll,
          shallow,
          prefetch,
          locale,
          ...other
        } = props
        return /*#__PURE__*/ (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
          'jsxDEV'
        ])(
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
            'default'
          ],
          {
            href: to,
            prefetch: prefetch,
            as: linkAs,
            replace: replace,
            scroll: scroll,
            shallow: shallow,
            passHref: true,
            locale: locale,
            children: /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              Anchor,
              {
                ref: ref,
                ...other,
              },
              void 0,
              false,
              {
                fileName: '[project]/src/components/Link.tsx',
                lineNumber: 38,
                columnNumber: 7,
              },
              this
            ),
          },
          void 0,
          false,
          {
            fileName: '[project]/src/components/Link.tsx',
            lineNumber: 28,
            columnNumber: 5,
          },
          this
        )
      })
    _c1 = NextLinkComposed
    // A styled version of the Next.js Link component:
    // https://nextjs.org/docs/api-reference/next/link
    const Link = /*#__PURE__*/ _s(
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'forwardRef'
      ](
        (_c2 = _s(
          function Link(props, ref) {
            _s()
            const {
              activeClassName = 'active',
              as: linkAs,
              className: classNameProps,
              href,
              noLinkStyle,
              ...other
            } = props
            const router = (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'useRouter'
            ])()
            const pathname = typeof href === 'string' ? href : href.pathname
            const className = (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__[
              'default'
            ])(classNameProps, {
              [activeClassName]:
                router.pathname === pathname && activeClassName,
            })
            const isExternal =
              typeof href === 'string' &&
              (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0)
            if (isExternal) {
              if (noLinkStyle) {
                return /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  Anchor,
                  {
                    className: className,
                    href: href,
                    ref: ref,
                    ...other,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/src/components/Link.tsx',
                    lineNumber: 79,
                    columnNumber: 14,
                  },
                  this
                )
              }
              return /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'jsxDEV'
              ])(
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'default'
                ],
                {
                  className: className,
                  href: href,
                  ref: ref,
                  ...other,
                },
                void 0,
                false,
                {
                  fileName: '[project]/src/components/Link.tsx',
                  lineNumber: 82,
                  columnNumber: 12,
                },
                this
              )
            }
            if (noLinkStyle) {
              return /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'jsxDEV'
              ])(
                NextLinkComposed,
                {
                  className: className,
                  ref: ref,
                  to: href,
                  ...other,
                },
                void 0,
                false,
                {
                  fileName: '[project]/src/components/Link.tsx',
                  lineNumber: 87,
                  columnNumber: 7,
                },
                this
              )
            }
            return /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'default'
              ],
              {
                component: NextLinkComposed,
                linkAs: linkAs,
                className: className,
                ref: ref,
                to: href,
                ...other,
              },
              void 0,
              false,
              {
                fileName: '[project]/src/components/Link.tsx',
                lineNumber: 92,
                columnNumber: 5,
              },
              this
            )
          },
          'fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=',
          false,
          function () {
            return [
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'useRouter'
              ],
            ]
          }
        ))
      ),
      'fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=',
      false,
      function () {
        return [
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
            'useRouter'
          ],
        ]
      }
    )
    _c3 = Link
    const __TURBOPACK__default__export__ = Link
    var _c, _c1, _c2, _c3
    __turbopack_context__.k.register(_c, 'Anchor')
    __turbopack_context__.k.register(_c1, 'NextLinkComposed')
    __turbopack_context__.k.register(_c2, 'Link$React.forwardRef')
    __turbopack_context__.k.register(_c3, 'Link')
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
  '[project]/src/components/Pic.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/next/image.js [client] (ecmascript)'
      )
    const Pic = ({ src, alt }) => {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          style: {
            width: '100%',
            height: '100%',
            position: 'relative',
          },
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'default'
            ],
            {
              src: src,
              alt: alt,
              layout: 'fill',
              objectFit: 'contain',
            },
            void 0,
            false,
            {
              fileName: '[project]/src/components/Pic.tsx',
              lineNumber: 11,
              columnNumber: 7,
            },
            ('TURBOPACK compile-time value', void 0)
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/src/components/Pic.tsx',
          lineNumber: 10,
          columnNumber: 5,
        },
        ('TURBOPACK compile-time value', void 0)
      )
    }
    _c = Pic
    const __TURBOPACK__default__export__ = Pic
    var _c
    __turbopack_context__.k.register(_c, 'Pic')
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
  '[project]/src/components/Spacer.tsx [client] (ecmascript) <export default as Spacer>',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s([
      'Spacer',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spacer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
          'default'
        ],
    ])
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spacer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Spacer.tsx [client] (ecmascript)'
      )
  },
  '[project]/src/components/TechCard.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/src/components/index.ts [client] (ecmascript) <locals>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spacer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Spacer$3e$__ =
      __turbopack_context__.i(
        '[project]/src/components/Spacer.tsx [client] (ecmascript) <export default as Spacer>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Avatar$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Avatar/Avatar.js [client] (ecmascript) <export default as Avatar>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$AvatarGroup$2f$AvatarGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AvatarGroup$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/AvatarGroup/AvatarGroup.js [client] (ecmascript) <export default as AvatarGroup>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Card$2f$Card$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Card$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Card/Card.js [client] (ecmascript) <export default as Card>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Tooltip/Tooltip.js [client] (ecmascript) <export default as Tooltip>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript) <export default as Typography>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/next/image.js [client] (ecmascript)'
      )
    function TechItemAvatar({ alt, path }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__[
          'Tooltip'
        ],
        {
          title: alt,
          disableFocusListener: true,
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Avatar$3e$__[
              'Avatar'
            ],
            {
              sx: {
                width: 56,
                height: 56,
                bgcolor: '#E0E0E0',
              },
              children: /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'jsxDEV'
              ])(
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'default'
                ],
                {
                  src: `/images/tech/${path}`,
                  alt: alt,
                  height: 40,
                  width: 40,
                },
                void 0,
                false,
                {
                  fileName: '[project]/src/components/TechCard.tsx',
                  lineNumber: 12,
                  columnNumber: 9,
                },
                this
              ),
            },
            void 0,
            false,
            {
              fileName: '[project]/src/components/TechCard.tsx',
              lineNumber: 11,
              columnNumber: 7,
            },
            this
          ),
        },
        alt,
        false,
        {
          fileName: '[project]/src/components/TechCard.tsx',
          lineNumber: 10,
          columnNumber: 5,
        },
        this
      )
    }
    _c = TechItemAvatar
    const TechAvatarGroup = ({ techItems, png }) => {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$AvatarGroup$2f$AvatarGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AvatarGroup$3e$__[
          'AvatarGroup'
        ],
        {
          children: [
            techItems.map((tech) =>
              /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'jsxDEV'
              ])(
                TechItemAvatar,
                {
                  alt: tech,
                  path: tech + '.svg',
                },
                tech,
                false,
                {
                  fileName: '[project]/src/components/TechCard.tsx',
                  lineNumber: 28,
                  columnNumber: 9,
                },
                ('TURBOPACK compile-time value', void 0)
              )
            ),
            png
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  TechItemAvatar,
                  {
                    alt: png,
                    path: png + '.png',
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/src/components/TechCard.tsx',
                    lineNumber: 30,
                    columnNumber: 14,
                  },
                  ('TURBOPACK compile-time value', void 0)
                )
              : undefined,
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/src/components/TechCard.tsx',
          lineNumber: 26,
          columnNumber: 5,
        },
        ('TURBOPACK compile-time value', void 0)
      )
    }
    _c1 = TechAvatarGroup
    const TechCard = ({ techItems, title, comment, png }) =>
      /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Card$2f$Card$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Card$3e$__[
          'Card'
        ],
        {
          sx: {
            height: '100%',
            minHeight: {
              xs: 140,
              sm: 160,
              md: 180,
            },
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            boxShadow: 2,
          },
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                'Typography'
              ],
              {
                variant: 'h6',
                fontWeight: 700,
                gutterBottom: true,
                textAlign: 'center',
                children: title,
              },
              void 0,
              false,
              {
                fileName: '[project]/src/components/TechCard.tsx',
                lineNumber: 59,
                columnNumber: 5,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              TechAvatarGroup,
              {
                techItems: techItems,
                png: png,
              },
              void 0,
              false,
              {
                fileName: '[project]/src/components/TechCard.tsx',
                lineNumber: 62,
                columnNumber: 5,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spacer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Spacer$3e$__[
                'Spacer'
              ],
              {
                size: 2,
              },
              void 0,
              false,
              {
                fileName: '[project]/src/components/TechCard.tsx',
                lineNumber: 63,
                columnNumber: 5,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                'Typography'
              ],
              {
                variant: 'body2',
                textAlign: 'center',
                children: comment,
              },
              void 0,
              false,
              {
                fileName: '[project]/src/components/TechCard.tsx',
                lineNumber: 64,
                columnNumber: 5,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/src/components/TechCard.tsx',
          lineNumber: 46,
          columnNumber: 3,
        },
        ('TURBOPACK compile-time value', void 0)
      )
    _c2 = TechCard
    const __TURBOPACK__default__export__ = TechCard
    var _c, _c1, _c2
    __turbopack_context__.k.register(_c, 'TechItemAvatar')
    __turbopack_context__.k.register(_c1, 'TechAvatarGroup')
    __turbopack_context__.k.register(_c2, 'TechCard')
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
  '[project]/src/components/TimelineBullet.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s([
      'TimelineItemWithIcon',
      () => TimelineItemWithIcon,
    ])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineConnector$2f$TimelineConnector$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineConnector$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/lab/esm/TimelineConnector/TimelineConnector.js [client] (ecmascript) <export default as TimelineConnector>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineContent$2f$TimelineContent$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineContent$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/lab/esm/TimelineContent/TimelineContent.js [client] (ecmascript) <export default as TimelineContent>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineDot$2f$TimelineDot$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineDot$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/lab/esm/TimelineDot/TimelineDot.js [client] (ecmascript) <export default as TimelineDot>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineItem$2f$TimelineItem$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineItem$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/lab/esm/TimelineItem/TimelineItem.js [client] (ecmascript) <export default as TimelineItem>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineOppositeContent$2f$TimelineOppositeContent$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineOppositeContent$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/lab/esm/TimelineOppositeContent/TimelineOppositeContent.js [client] (ecmascript) <export default as TimelineOppositeContent>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineSeparator$2f$TimelineSeparator$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineSeparator$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/lab/esm/TimelineSeparator/TimelineSeparator.js [client] (ecmascript) <export default as TimelineSeparator>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript)'
      )
    const TimelineItemWithIcon = ({ bullet }) => {
      const Icon = bullet.icon
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineItem$2f$TimelineItem$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineItem$3e$__[
          'TimelineItem'
        ],
        {
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineOppositeContent$2f$TimelineOppositeContent$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineOppositeContent$3e$__[
                'TimelineOppositeContent'
              ],
              {
                color: 'text.secondary',
                sx: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'default'
                  ],
                  {
                    variant: 'h5',
                    children: bullet.title,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/src/components/TimelineBullet.tsx',
                    lineNumber: 32,
                    columnNumber: 9,
                  },
                  ('TURBOPACK compile-time value', void 0)
                ),
              },
              void 0,
              false,
              {
                fileName: '[project]/src/components/TimelineBullet.tsx',
                lineNumber: 28,
                columnNumber: 7,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineSeparator$2f$TimelineSeparator$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineSeparator$3e$__[
                'TimelineSeparator'
              ],
              {
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineDot$2f$TimelineDot$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineDot$3e$__[
                      'TimelineDot'
                    ],
                    {
                      color: 'secondary',
                      children: /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        Icon,
                        {},
                        void 0,
                        false,
                        {
                          fileName:
                            '[project]/src/components/TimelineBullet.tsx',
                          lineNumber: 36,
                          columnNumber: 11,
                        },
                        ('TURBOPACK compile-time value', void 0)
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/src/components/TimelineBullet.tsx',
                      lineNumber: 35,
                      columnNumber: 9,
                    },
                    ('TURBOPACK compile-time value', void 0)
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineConnector$2f$TimelineConnector$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineConnector$3e$__[
                      'TimelineConnector'
                    ],
                    {},
                    void 0,
                    false,
                    {
                      fileName: '[project]/src/components/TimelineBullet.tsx',
                      lineNumber: 38,
                      columnNumber: 9,
                    },
                    ('TURBOPACK compile-time value', void 0)
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/src/components/TimelineBullet.tsx',
                lineNumber: 34,
                columnNumber: 7,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$lab$2f$esm$2f$TimelineContent$2f$TimelineContent$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TimelineContent$3e$__[
                'TimelineContent'
              ],
              {
                children: /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'default'
                  ],
                  {
                    children: bullet.detail,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/src/components/TimelineBullet.tsx',
                    lineNumber: 41,
                    columnNumber: 9,
                  },
                  ('TURBOPACK compile-time value', void 0)
                ),
              },
              void 0,
              false,
              {
                fileName: '[project]/src/components/TimelineBullet.tsx',
                lineNumber: 40,
                columnNumber: 7,
              },
              ('TURBOPACK compile-time value', void 0)
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/src/components/TimelineBullet.tsx',
          lineNumber: 27,
          columnNumber: 5,
        },
        ('TURBOPACK compile-time value', void 0)
      )
    }
    _c = TimelineItemWithIcon
    var _c
    __turbopack_context__.k.register(_c, 'TimelineItemWithIcon')
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
  '[project]/src/components/index.ts [client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s([])
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Copyright$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Copyright.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Page$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Page.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spacer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Spacer.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Link.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pic$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Pic.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TechCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/TechCard.tsx [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TimelineBullet$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/TimelineBullet.tsx [client] (ecmascript)'
      )
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
  '[project]/src/components/Page.tsx [client] (ecmascript) <export default as Page>',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s([
      'Page',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Page$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__[
          'default'
        ],
    ])
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Page$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/src/components/Page.tsx [client] (ecmascript)'
      )
  },
  '[project]/pages/articles/index.tsx [client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__])
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/react/index.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/src/components/index.ts [client] (ecmascript) <locals>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Page$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Page$3e$__ =
      __turbopack_context__.i(
        '[project]/src/components/Page.tsx [client] (ecmascript) <export default as Page>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$OpenInNew$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/icons-material/esm/OpenInNew.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/icons-material/esm/Search.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DensitySmall$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/icons-material/esm/DensitySmall.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DensityLarge$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/icons-material/esm/DensityLarge.js [client] (ecmascript)'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Box/Box.js [client] (ecmascript) <export default as Box>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Card$2f$Card$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Card$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Card/Card.js [client] (ecmascript) <export default as Card>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CardContent$2f$CardContent$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CardContent$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/CardContent/CardContent.js [client] (ecmascript) <export default as CardContent>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Chip/Chip.js [client] (ecmascript) <export default as Chip>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/IconButton/IconButton.js [client] (ecmascript) <export default as IconButton>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/InputAdornment/InputAdornment.js [client] (ecmascript) <export default as InputAdornment>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/TextField/TextField.js [client] (ecmascript) <export default as TextField>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Tooltip/Tooltip.js [client] (ecmascript) <export default as Tooltip>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript) <export default as Typography>'
      )
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/next/router.js [client] (ecmascript)'
      )
    var _s = __turbopack_context__.k.signature()
    const articles = [
      {
        title: 'TBM 406: Seeing Everything, Understanding Nothing',
        author: 'John Cutler',
        source: 'cutlefish.substack.com',
        url: 'https://cutlefish.substack.com/p/tbm-406-seeing-everything-understanding',
        description:
          'The context trap - AI is supercharging legacy leadership assumptions about context and control.',
        tags: ['AI', 'Leadership', 'Thinking'],
        comment:
          'Essential reading on the dangers of over-contextualizing in AI systems.',
        date: '2026-02-13',
      },
      {
        title: 'The Harness Problem',
        author: 'Can Bölük',
        source: 'blog.can.ac',
        url: 'https://blog.can.ac/2026/02/12/the-harness-problem/',
        description:
          'Improving 15 LLMs at coding in one afternoon. Only the harness changed.',
        tags: ['AI', 'Agents', 'Engineering'],
        comment:
          'The edit tool is the variable that matters most for coding agents.',
        date: '2026-02-12',
      },
      {
        title:
          'Perplexity Computer Launches AI Tool with Autonomous Capabilities',
        author: "Tim O'Neill",
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/posts/timoneill_who-guessed-that-perplexity-would-be-first-activity-7432537799150665728-CpeC',
        description:
          'The race is to the top right, where AI agents work autonomously and have real control over your desktop.',
        tags: ['AI', 'Agents', 'Tools'],
        comment: 'Analysis of where AI tools are headed in 2026.',
        date: '2026-02-07',
      },
      {
        title: "AINews: Anthropic's Agent Autonomy Study",
        author: 'Swyx',
        source: 'latent.space',
        url: 'https://www.latent.space/p/ainews-anthropics-agent-autonomy',
        description:
          "Anthropic's study of its own API usage patterns measuring AI agent autonomy in practice.",
        tags: ['AI', 'Agents', 'Research'],
        comment: 'Data on how Claude Code usage grew from 25 mins to 45+ mins.',
        date: '2026-02-06',
      },
      {
        title: "OpenAI's Agent-First Codebase Learnings",
        author: 'Alex Lavaee',
        source: 'alexlavaee.me',
        url: 'https://alexlavaee.me/blog/openai-agent-first-codebase-learnings/',
        description:
          '5-month experiment: build and ship a real product with zero manually-written code.',
        tags: ['AI', 'Agents', 'Engineering'],
        comment:
          "OpenAI's Harness team produced ~1,500 merged PRs with 3 engineers.",
        date: '2026-02-05',
      },
      {
        title: 'Anthropic Releases SKILLS for AI Agents',
        author: 'Dallin Bentley',
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/posts/dallinbentley_the-next-big-thing-in-ai-is-file-systems-activity-7415180783226855425-UX6R',
        description:
          'Files that live alongside your AI agent. The agent can read these files just like it would when working with a codebase.',
        tags: ['AI', 'Agents', 'Tools'],
        comment: 'A shift toward file-system-based agent memory.',
        date: '2026-02-04',
      },
      {
        title: 'The "AI Grifter" Crowd and Claude Code',
        author: 'Giorgio Vilardo',
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/posts/giorgiovilardo_the-ai-grifter-crowd-has-officially-hopped-activity-7418297453428449280-nKnt',
        description:
          'Moving away from the "VS Code clone sidebar" and towards CLI agents.',
        tags: ['AI', 'Agents', 'Tools'],
        comment: 'Architectural shift from GUI to CLI-based AI agents.',
        date: '2026-02-02',
      },
      {
        title: 'AGENTS.md Outperforms Skills in Our Agent Evals',
        author: 'Jude Gao',
        source: 'vercel.com',
        url: 'https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals',
        description:
          'A compressed 8KB docs index embedded directly in AGENTS.md achieved a 100% pass rate, while skills maxed out at 79%.',
        tags: ['AI', 'Agents', 'Engineering'],
        comment: 'Passive context beats active retrieval for AI coding agents.',
        date: '2026-01-28',
      },
      {
        title: 'So You Want to Hire a Forward Deployed Engineer',
        author: 'Tiffany Siu',
        source: 'review.firstround.com',
        url: 'https://review.firstround.com/so-you-want-to-hire-a-forward-deployed-engineer/',
        description:
          'What FDEs actually do and how to hire the right one for your team.',
        tags: ['Career', 'Engineering', 'Hiring'],
        comment:
          'FDEs help build incrementally more valuable products from concrete use cases.',
        date: '2026-01-20',
      },
      {
        title: "2026 Interview Questions I'm Asking Engineers",
        author: 'Punn Kam',
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/posts/punnkam_2026-interview-questions-im-asking-engineers-activity-7414697854138531840-69wW',
        description:
          '"You\'re in the middle of a refactor and the model says 8% context left before auto-compaction. What do you do?"',
        tags: ['AI', 'Career', 'Hiring'],
        comment:
          'Questions that tell you more than any Leetcode problem ever could.',
        date: '2026-01-15',
      },
      {
        title: 'Effective Harnesses for Long-Running Agents',
        author: 'Anthropic',
        source: 'anthropic.com',
        url: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents',
        description:
          'Creating a more effective harness for long-running agents, inspired by human engineers.',
        tags: ['AI', 'Agents', 'Engineering'],
        comment:
          'How to make agents make consistent progress across multiple context windows.',
        date: '2025-11-26',
      },
      {
        title:
          'Speed at the Cost of Quality: How Cursor AI Increases Short-Term Velocity and Long-Term Complexity',
        author: 'Multiple Authors',
        source: 'arxiv.org',
        url: 'https://arxiv.org/abs/2511.04427',
        description:
          'How Cursor AI increases short-term velocity and long-term complexity in open-source projects.',
        tags: ['AI', 'Agents', 'Research'],
        comment: 'MSR 2026 paper on the tradeoffs of AI-assisted coding.',
        date: '2025-11-08',
      },
      {
        title: 'When ChatGPT Broke an Entire Field: An Oral History',
        author: 'John Pavlus',
        source: 'quantamagazine.org',
        url: 'https://www.quantamagazine.org/when-chatgpt-broke-an-entire-field-an-oral-history-20250430/',
        description: 'How LLMs upended the field of NLP in just a few years.',
        tags: ['AI', 'History', 'Research'],
        comment: 'Fascinating oral history of the AI paradigm shift.',
        date: '2025-04-30',
      },
      {
        title: 'How We Solved Hallucination in LLMs with Open Source Code',
        author: 'Leon Chlon, PhD',
        source: 'linkedin.com',
        url: 'https://www.linkedin.com/posts/leochlon_ai-machinelearning-opensource-activity-7373621516581773312-sad6',
        description:
          "LLM hallucinations aren't bugs - they're compression artifacts.",
        tags: ['AI', 'Research', 'Open Source'],
        comment: 'Revolutionary approach to hallucination detection.',
        date: '2024-12-15',
      },
      {
        title: 'The Prompt Report',
        author: 'Sander Schulhoff',
        source: 'learnprompting.org',
        url: 'https://learnprompting.org/blog/the_prompt_report',
        description:
          'The most comprehensive study of prompting ever done - 1,500+ academic papers analyzed.',
        tags: ['AI', 'Prompt Engineering', 'Research'],
        comment: '80+ page survey of all prompting techniques.',
        date: '2024-12-12',
      },
      {
        title: 'Building Effective AI Agents',
        author: 'Erik Schluntz & Barry Zhang',
        source: 'anthropic.com',
        url: 'https://www.anthropic.com/research/building-effective-agents',
        description:
          'Best practices and patterns for building production AI agents.',
        tags: ['AI', 'Agents', 'Best Practices'],
        comment:
          'The definitive guide to agent architecture from the team behind Claude.',
        date: '2024-10-01',
      },
      {
        title: 'Claude Squad',
        author: 'SMTG-AI',
        source: 'github.com',
        url: 'https://github.com/smtg-ai/claude-squad',
        description:
          'Manage multiple AI terminal agents like Claude Code, Aider, Codex, OpenCode, and Amp.',
        tags: ['AI', 'Tools', 'Open Source'],
        comment: 'Multi-agent orchestration for terminal-based AI coding.',
        date: '2024-06-15',
      },
      {
        title: 'The Rise of the AI Engineer',
        author: 'Swyx',
        source: 'latent.space',
        url: 'https://www.latent.space/p/ai-engineer',
        description: 'Why AI engineering is becoming the hottest role in tech.',
        tags: ['AI', 'Career', 'Engineering'],
        comment:
          'Required reading for anyone building with LLMs professionally.',
        date: '2023-09-01',
      },
      {
        title: 'LLM Powered Autonomous Agents',
        author: 'Lilian Weng',
        source: 'lilianweng.github.io',
        url: 'https://lilianweng.github.io/posts/2023-06-23-agent/',
        description:
          'Comprehensive overview of agent architectures and patterns.',
        tags: ['AI', 'LLM', 'Agents', 'Research'],
        comment:
          'The canonical reference for understanding agent design patterns.',
        date: '2023-06-23',
      },
    ]
    const ArticlesIndex = () => {
      _s()
      const router = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useRouter'
      ])()
      const [selectedTags, setSelectedTags] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])([])
      const [searchQuery, setSearchQuery] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])('')
      const [expanded, setExpanded] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])(true)
      ;(0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useEffect'
      ])(
        {
          'ArticlesIndex.useEffect': () => {
            if (!router.isReady) return
            const { tags, q } = router.query
            if (tags) {
              const tagParam = Array.isArray(tags) ? tags.join(',') : tags
              setSelectedTags(tagParam.split(',').filter(Boolean))
            }
            if (q && typeof q === 'string') {
              setSearchQuery(q)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
          },
        }['ArticlesIndex.useEffect'],
        [router.isReady]
      )
      const updateUrl = (tags, query) => {
        const params = new URLSearchParams()
        if (tags.length > 0) {
          params.set('tags', tags.join(','))
        }
        if (query) {
          params.set('q', query)
        }
        const newUrl = params.toString()
          ? `/articles?${params.toString()}`
          : '/articles'
        router.replace(newUrl, undefined, {
          shallow: true,
        })
      }
      const filteredArticles = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useMemo'
      ])(
        {
          'ArticlesIndex.useMemo[filteredArticles]': () => {
            let result = articles
            if (selectedTags.length > 0) {
              result = result.filter(
                {
                  'ArticlesIndex.useMemo[filteredArticles]': (article) =>
                    selectedTags.some(
                      {
                        'ArticlesIndex.useMemo[filteredArticles]': (tag) =>
                          article.tags.includes(tag),
                      }['ArticlesIndex.useMemo[filteredArticles]']
                    ),
                }['ArticlesIndex.useMemo[filteredArticles]']
              )
            }
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase()
              result = result.filter(
                {
                  'ArticlesIndex.useMemo[filteredArticles]': (article) =>
                    article.title.toLowerCase().includes(query) ||
                    article.description.toLowerCase().includes(query) ||
                    article.author.toLowerCase().includes(query) ||
                    article.tags.some(
                      {
                        'ArticlesIndex.useMemo[filteredArticles]': (tag) =>
                          tag.toLowerCase().includes(query),
                      }['ArticlesIndex.useMemo[filteredArticles]']
                    ),
                }['ArticlesIndex.useMemo[filteredArticles]']
              )
            }
            return result
          },
        }['ArticlesIndex.useMemo[filteredArticles]'],
        [selectedTags, searchQuery]
      )
      const allTags = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'useMemo'
      ])(
        {
          'ArticlesIndex.useMemo[allTags]': () => {
            const tags = new Set()
            filteredArticles.forEach(
              {
                'ArticlesIndex.useMemo[allTags]': (article) => {
                  article.tags.forEach(
                    {
                      'ArticlesIndex.useMemo[allTags]': (tag) => tags.add(tag),
                    }['ArticlesIndex.useMemo[allTags]']
                  )
                },
              }['ArticlesIndex.useMemo[allTags]']
            )
            selectedTags.forEach(
              {
                'ArticlesIndex.useMemo[allTags]': (tag) => tags.add(tag),
              }['ArticlesIndex.useMemo[allTags]']
            )
            return Array.from(tags).sort()
          },
        }['ArticlesIndex.useMemo[allTags]'],
        [filteredArticles, selectedTags]
      )
      const toggleTag = (tag) => {
        const newTags = selectedTags.includes(tag)
          ? selectedTags.filter((t) => t !== tag)
          : [...selectedTags, tag]
        setSelectedTags(newTags)
        updateUrl(newTags, searchQuery)
      }
      const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        updateUrl(selectedTags, query)
      }
      const clearFilters = () => {
        setSelectedTags([])
        setSearchQuery('')
        router.replace('/articles', undefined, {
          shallow: true,
        })
      }
      const hasActiveFilters =
        selectedTags.length > 0 || searchQuery.trim().length > 0
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Page$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Page$3e$__[
          'Page'
        ],
        {
          title: 'High signal articles on AI, engineering, or whatever',
          action: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__[
              'Tooltip'
            ],
            {
              title: expanded ? 'Collapse all' : 'Expand all',
              children: /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                'jsxDEV'
              ])(
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__[
                  'IconButton'
                ],
                {
                  onClick: () => setExpanded(!expanded),
                  sx: {
                    color: 'text.secondary',
                  },
                  children: expanded
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DensityLarge$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'default'
                        ],
                        {},
                        void 0,
                        false,
                        {
                          fileName: '[project]/pages/articles/index.tsx',
                          lineNumber: 351,
                          columnNumber: 25,
                        },
                        void 0
                      )
                    : /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DensitySmall$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'default'
                        ],
                        {},
                        void 0,
                        false,
                        {
                          fileName: '[project]/pages/articles/index.tsx',
                          lineNumber: 351,
                          columnNumber: 48,
                        },
                        void 0
                      ),
                },
                void 0,
                false,
                {
                  fileName: '[project]/pages/articles/index.tsx',
                  lineNumber: 347,
                  columnNumber: 11,
                },
                void 0
              ),
            },
            void 0,
            false,
            {
              fileName: '[project]/pages/articles/index.tsx',
              lineNumber: 346,
              columnNumber: 9,
            },
            void 0
          ),
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
              'Box'
            ],
            {
              sx: {
                width: '100%',
                maxWidth: '900px',
              },
              children: [
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
                    'Box'
                  ],
                  {
                    sx: {
                      mb: 4,
                    },
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__[
                          'TextField'
                        ],
                        {
                          fullWidth: true,
                          size: 'small',
                          placeholder: 'Search articles...',
                          value: searchQuery,
                          onChange: handleSearchChange,
                          InputProps: {
                            startAdornment: /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__[
                                'InputAdornment'
                              ],
                              {
                                position: 'start',
                                children: /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                  'jsxDEV'
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                    'default'
                                  ],
                                  {
                                    sx: {
                                      color: 'text.secondary',
                                      fontSize: '1.2rem',
                                    },
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName:
                                      '[project]/pages/articles/index.tsx',
                                    lineNumber: 367,
                                    columnNumber: 19,
                                  },
                                  void 0
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: '[project]/pages/articles/index.tsx',
                                lineNumber: 366,
                                columnNumber: 17,
                              },
                              void 0
                            ),
                          },
                          sx: {
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'background.paper',
                            },
                          },
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/pages/articles/index.tsx',
                          lineNumber: 358,
                          columnNumber: 11,
                        },
                        ('TURBOPACK compile-time value', void 0)
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
                          'Box'
                        ],
                        {
                          sx: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mb: 2,
                            alignItems: 'center',
                          },
                          children: [
                            allTags.map((tag) =>
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__[
                                  'Chip'
                                ],
                                {
                                  label: tag,
                                  size: 'small',
                                  onClick: () => toggleTag(tag),
                                  color: selectedTags.includes(tag)
                                    ? 'primary'
                                    : 'default',
                                  variant: selectedTags.includes(tag)
                                    ? 'filled'
                                    : 'outlined',
                                  sx: {
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'translateY(-1px)',
                                    },
                                  },
                                },
                                tag,
                                false,
                                {
                                  fileName:
                                    '[project]/pages/articles/index.tsx',
                                  lineNumber: 391,
                                  columnNumber: 15,
                                },
                                ('TURBOPACK compile-time value', void 0)
                              )
                            ),
                            hasActiveFilters &&
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__[
                                  'Chip'
                                ],
                                {
                                  label: 'Clear',
                                  size: 'small',
                                  onClick: clearFilters,
                                  color: 'secondary',
                                  variant: 'outlined',
                                  sx: {
                                    cursor: 'pointer',
                                    fontSize: '0.7rem',
                                  },
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    '[project]/pages/articles/index.tsx',
                                  lineNumber: 408,
                                  columnNumber: 15,
                                },
                                ('TURBOPACK compile-time value', void 0)
                              ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: '[project]/pages/articles/index.tsx',
                          lineNumber: 381,
                          columnNumber: 11,
                        },
                        ('TURBOPACK compile-time value', void 0)
                      ),
                      hasActiveFilters &&
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                            'Typography'
                          ],
                          {
                            variant: 'caption',
                            color: 'text.secondary',
                            sx: {
                              display: 'block',
                            },
                            children: [
                              'Showing ',
                              filteredArticles.length,
                              ' of ',
                              articles.length,
                              ' articles',
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: '[project]/pages/articles/index.tsx',
                            lineNumber: 420,
                            columnNumber: 13,
                          },
                          ('TURBOPACK compile-time value', void 0)
                        ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: '[project]/pages/articles/index.tsx',
                    lineNumber: 357,
                    columnNumber: 9,
                  },
                  ('TURBOPACK compile-time value', void 0)
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
                    'Box'
                  ],
                  {
                    sx: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: expanded ? 3 : 1.5,
                    },
                    children: filteredArticles.map((article, index) =>
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Card$2f$Card$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Card$3e$__[
                          'Card'
                        ],
                        {
                          sx: {
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 4,
                              borderColor: 'primary.main',
                            },
                          },
                          onClick: () => window.open(article.url, '_blank'),
                          children: /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                            'jsxDEV'
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CardContent$2f$CardContent$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CardContent$3e$__[
                              'CardContent'
                            ],
                            {
                              sx: {
                                p: expanded ? 3 : 1.5,
                                '&:last-child': {
                                  pb: expanded ? 3 : 1.5,
                                },
                              },
                              children: [
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                  'jsxDEV'
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
                                    'Box'
                                  ],
                                  {
                                    sx: {
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: expanded
                                        ? 'flex-start'
                                        : 'center',
                                      mb: expanded ? 1 : 0,
                                    },
                                    children: [
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                        'jsxDEV'
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
                                          'Box'
                                        ],
                                        {
                                          sx: {
                                            flex: 1,
                                            minWidth: 0,
                                          },
                                          children: [
                                            /*#__PURE__*/ (0,
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                              'jsxDEV'
                                            ])(
                                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                                                'Typography'
                                              ],
                                              {
                                                variant: expanded
                                                  ? 'h6'
                                                  : 'body1',
                                                fontWeight: 600,
                                                sx: {
                                                  lineHeight: expanded
                                                    ? 1.3
                                                    : 1.5,
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                  whiteSpace: expanded
                                                    ? 'normal'
                                                    : 'nowrap',
                                                },
                                                children: article.title,
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName:
                                                  '[project]/pages/articles/index.tsx',
                                                lineNumber: 466,
                                                columnNumber: 21,
                                              },
                                              ('TURBOPACK compile-time value',
                                              void 0)
                                            ),
                                            expanded &&
                                              /*#__PURE__*/ (0,
                                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                                'jsxDEV'
                                              ])(
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                                                  'Typography'
                                                ],
                                                {
                                                  variant: 'caption',
                                                  color: 'text.secondary',
                                                  display: 'block',
                                                  sx: {
                                                    mt: 0.5,
                                                  },
                                                  children: [
                                                    article.date,
                                                    ' · ',
                                                    article.author,
                                                    ' · ',
                                                    article.source,
                                                  ],
                                                },
                                                void 0,
                                                true,
                                                {
                                                  fileName:
                                                    '[project]/pages/articles/index.tsx',
                                                  lineNumber: 479,
                                                  columnNumber: 23,
                                                },
                                                ('TURBOPACK compile-time value',
                                                void 0)
                                              ),
                                            !expanded &&
                                              /*#__PURE__*/ (0,
                                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                                'jsxDEV'
                                              ])(
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                                                  'Typography'
                                                ],
                                                {
                                                  variant: 'caption',
                                                  color: 'text.secondary',
                                                  sx: {
                                                    ml: 1,
                                                  },
                                                  children: article.date,
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    '[project]/pages/articles/index.tsx',
                                                  lineNumber: 489,
                                                  columnNumber: 23,
                                                },
                                                ('TURBOPACK compile-time value',
                                                void 0)
                                              ),
                                          ],
                                        },
                                        void 0,
                                        true,
                                        {
                                          fileName:
                                            '[project]/pages/articles/index.tsx',
                                          lineNumber: 465,
                                          columnNumber: 19,
                                        },
                                        ('TURBOPACK compile-time value', void 0)
                                      ),
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                        'jsxDEV'
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$OpenInNew$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                          'default'
                                        ],
                                        {
                                          sx: {
                                            fontSize: expanded
                                              ? '1rem'
                                              : '0.9rem',
                                            color: 'text.secondary',
                                            ml: 1,
                                            flexShrink: 0,
                                          },
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            '[project]/pages/articles/index.tsx',
                                          lineNumber: 498,
                                          columnNumber: 19,
                                        },
                                        ('TURBOPACK compile-time value', void 0)
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName:
                                      '[project]/pages/articles/index.tsx',
                                    lineNumber: 457,
                                    columnNumber: 17,
                                  },
                                  ('TURBOPACK compile-time value', void 0)
                                ),
                                expanded &&
                                  /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                      'Fragment'
                                    ],
                                    {
                                      children: [
                                        /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                          'jsxDEV'
                                        ])(
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                                            'Typography'
                                          ],
                                          {
                                            variant: 'body2',
                                            color: 'text.secondary',
                                            sx: {
                                              mb: 2,
                                              fontStyle: 'italic',
                                            },
                                            children: [
                                              '“',
                                              article.comment,
                                              '”',
                                            ],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              '[project]/pages/articles/index.tsx',
                                            lineNumber: 510,
                                            columnNumber: 21,
                                          },
                                          ('TURBOPACK compile-time value',
                                          void 0)
                                        ),
                                        /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                          'jsxDEV'
                                        ])(
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
                                            'Box'
                                          ],
                                          {
                                            sx: {
                                              mb: 2,
                                            },
                                            children: article.tags.map((tag) =>
                                              /*#__PURE__*/ (0,
                                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                                'jsxDEV'
                                              ])(
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__[
                                                  'Chip'
                                                ],
                                                {
                                                  label: tag,
                                                  size: 'small',
                                                  onClick: (e) => {
                                                    e.stopPropagation()
                                                    toggleTag(tag)
                                                  },
                                                  color: selectedTags.includes(
                                                    tag
                                                  )
                                                    ? 'primary'
                                                    : 'default',
                                                  variant:
                                                    selectedTags.includes(tag)
                                                      ? 'filled'
                                                      : 'outlined',
                                                  sx: {
                                                    mr: 1,
                                                    mb: 1,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                  },
                                                },
                                                tag,
                                                false,
                                                {
                                                  fileName:
                                                    '[project]/pages/articles/index.tsx',
                                                  lineNumber: 520,
                                                  columnNumber: 25,
                                                },
                                                ('TURBOPACK compile-time value',
                                                void 0)
                                              )
                                            ),
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              '[project]/pages/articles/index.tsx',
                                            lineNumber: 518,
                                            columnNumber: 21,
                                          },
                                          ('TURBOPACK compile-time value',
                                          void 0)
                                        ),
                                        /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                                          'jsxDEV'
                                        ])(
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                                            'Typography'
                                          ],
                                          {
                                            variant: 'body2',
                                            children: article.description,
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              '[project]/pages/articles/index.tsx',
                                            lineNumber: 544,
                                            columnNumber: 21,
                                          },
                                          ('TURBOPACK compile-time value',
                                          void 0)
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true
                                  ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: '[project]/pages/articles/index.tsx',
                              lineNumber: 451,
                              columnNumber: 15,
                            },
                            ('TURBOPACK compile-time value', void 0)
                          ),
                        },
                        index,
                        false,
                        {
                          fileName: '[project]/pages/articles/index.tsx',
                          lineNumber: 438,
                          columnNumber: 13,
                        },
                        ('TURBOPACK compile-time value', void 0)
                      )
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/pages/articles/index.tsx',
                    lineNumber: 430,
                    columnNumber: 9,
                  },
                  ('TURBOPACK compile-time value', void 0)
                ),
                filteredArticles.length === 0 &&
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__[
                      'Box'
                    ],
                    {
                      sx: {
                        textAlign: 'center',
                        py: 8,
                      },
                      children: [
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__[
                            'Typography'
                          ],
                          {
                            variant: 'body1',
                            color: 'text.secondary',
                            children: 'No articles match your filters.',
                          },
                          void 0,
                          false,
                          {
                            fileName: '[project]/pages/articles/index.tsx',
                            lineNumber: 556,
                            columnNumber: 13,
                          },
                          ('TURBOPACK compile-time value', void 0)
                        ),
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__[
                            'Chip'
                          ],
                          {
                            label: 'CLEAR FILTERS',
                            size: 'small',
                            onClick: clearFilters,
                            color: 'primary',
                            sx: {
                              mt: 2,
                              cursor: 'pointer',
                            },
                          },
                          void 0,
                          false,
                          {
                            fileName: '[project]/pages/articles/index.tsx',
                            lineNumber: 559,
                            columnNumber: 13,
                          },
                          ('TURBOPACK compile-time value', void 0)
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: '[project]/pages/articles/index.tsx',
                      lineNumber: 555,
                      columnNumber: 11,
                    },
                    ('TURBOPACK compile-time value', void 0)
                  ),
              ],
            },
            void 0,
            true,
            {
              fileName: '[project]/pages/articles/index.tsx',
              lineNumber: 356,
              columnNumber: 7,
            },
            ('TURBOPACK compile-time value', void 0)
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/pages/articles/index.tsx',
          lineNumber: 343,
          columnNumber: 5,
        },
        ('TURBOPACK compile-time value', void 0)
      )
    }
    _s(ArticlesIndex, 'j4ZQgN/AmcRaY3ZYsW/rWofB43E=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__[
          'useRouter'
        ],
      ]
    })
    _c = ArticlesIndex
    const __TURBOPACK__default__export__ = ArticlesIndex
    var _c
    __turbopack_context__.k.register(_c, 'ArticlesIndex')
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
  '[next]/entry/page-loader.ts { PAGE => "[project]/pages/articles/index.tsx [client] (ecmascript)" } [client] (ecmascript)',
  (__turbopack_context__, module, exports) => {
    const PAGE_PATH = '/articles'
    ;(window.__NEXT_P = window.__NEXT_P || []).push([
      PAGE_PATH,
      () => {
        return __turbopack_context__.r(
          '[project]/pages/articles/index.tsx [client] (ecmascript)'
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
  '[hmr-entry]/hmr-entry.js { ENTRY => "[project]/pages/articles/index.tsx" }',
  (__turbopack_context__) => {
    'use strict'

    __turbopack_context__.r(
      '[next]/entry/page-loader.ts { PAGE => "[project]/pages/articles/index.tsx [client] (ecmascript)" } [client] (ecmascript)'
    )
  },
])

//# sourceMappingURL=%5Broot-of-the-server%5D__5c8729a3._.js.map
