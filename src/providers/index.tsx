'use client'

import { type PropsWithChildren } from 'react'

import { ReactQueryProvider } from './react-query'
import { ThemeProvider } from './theme'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
