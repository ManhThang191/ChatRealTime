'use client'

import * as React from 'react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useServerInsertedHTML } from 'next/navigation'

export default function ThemeRegistry({
  children
}: {
  children: React.ReactNode
}) {
  const [cache] = React.useState(() => {
    const cache = createCache({ key: 'mui', prepend: true })
    cache.compat = true
    return cache
  })

  const { insert } = cache
  const inserted: string[] = []

  cache.insert = (...args) => {
    const serialized = args[1]
    if (cache.inserted[serialized.name] === undefined) {
      inserted.push(serialized.name)
    }
    return insert(...args)
  }

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`mui ${inserted.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: inserted.map((name) => cache.inserted[name]).join('')
        }}
      />
    )
  })

  const theme = createTheme()

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}
