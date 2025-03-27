"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeScript() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    // Apply the theme immediately on client-side
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [setTheme])

  return null
}

