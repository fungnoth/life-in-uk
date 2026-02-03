import './globals.css'
import type { Metadata, Viewport } from 'next'
import VersionInfo from './components/VersionInfo'
import './utils/errorSuppression'

export const metadata: Metadata = {
  title: 'Life in the UK Test',
  description: 'Practice Life in the UK citizenship test questions',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23012169"/><rect x="0" y="6" width="16" height="4" fill="white"/><rect x="6" y="0" width="4" height="16" fill="white"/><rect x="0" y="7" width="16" height="2" fill="%23C8102E"/><rect x="7" y="0" width="2" height="16" fill="%23C8102E"/></svg>',
        type: 'image/svg+xml',
      },
    ],
    shortcut: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23012169"/><rect x="0" y="6" width="16" height="4" fill="white"/><rect x="6" y="0" width="4" height="16" fill="white"/><rect x="0" y="7" width="16" height="2" fill="%23C8102E"/><rect x="7" y="0" width="2" height="16" fill="%23C8102E"/></svg>',
    apple: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="15%" fill="%23012169"/><rect x="0" y="192" width="512" height="128" fill="white"/><rect x="192" y="0" width="128" height="512" fill="white"/><rect x="0" y="224" width="512" height="64" fill="%23C8102E"/><rect x="224" y="0" width="64" height="512" fill="%23C8102E"/></svg>',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LifeUK',
  },
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0',
    'build-version': process.env.NEXT_PUBLIC_BUILD_TIME || 'local',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#012169',
}
const icons = [
  'bookmark',
  'bookmark_added',
  'chevron_left',
  'keyboard_arrow_down',
  'light_mode',
  'dark_mode',
].sort()

import { ThemeProvider } from './components/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import PWARegistration from './components/PWARegistration'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || ''

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0&icon_names=${icons.join(',')}`} />
        {/* Force manifest update */}
        <link rel="manifest" href={`/manifest.json?v=${encodeURIComponent(buildTime)}`} />
      </head>
      <body className="min-h-[100svh]">
        <ThemeProvider>
          <PWARegistration />
          <ThemeToggle />
          {children}
          <VersionInfo />
        </ThemeProvider>
      </body>
    </html>
  )
}
