// components/ui/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = Parameters<typeof NextThemesProvider>[0]

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      forcedTheme="dark" 
      enableSystem={false} 
      enableColorScheme={true}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}