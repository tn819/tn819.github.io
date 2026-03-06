import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface DarkModeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
)

function getInitialMode(): boolean {
  if (typeof window === 'undefined') return true
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) return saved === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
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

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkMode', darkMode.toString())
    }
  }, [darkMode, mounted])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
