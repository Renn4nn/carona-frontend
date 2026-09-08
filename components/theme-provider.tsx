"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme | ((current: Theme) => Theme)) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return "system"
    const storedTheme = window.localStorage.getItem("theme")
    return storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
      ? storedTheme
      : "system"
  })
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() =>
    typeof window === "undefined" ? "light" : getSystemTheme()
  )
  const resolvedTheme = theme === "system" ? systemTheme : theme

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    function onSystemThemeChange() {
      setSystemTheme(getSystemTheme())
    }

    media.addEventListener("change", onSystemThemeChange)

    return () => media.removeEventListener("change", onSystemThemeChange)
  }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
    document.documentElement.classList.toggle(
      "light",
      resolvedTheme === "light"
    )
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const setTheme = React.useCallback(
    (nextTheme: Theme | ((current: Theme) => Theme)) => {
      setThemeState((currentTheme) => {
        const value =
          typeof nextTheme === "function" ? nextTheme(currentTheme) : nextTheme
        window.localStorage.setItem("theme", value)
        return value
      })
    },
    []
  )

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider.")
  }
  return context
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.key.toLowerCase() !== "d" ||
        isTypingTarget(event.target)
      ) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
export { useTheme }
