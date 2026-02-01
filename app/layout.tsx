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
  },
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0&icon_names=bookmark,bookmark_added,chevron_left" />
      </head>
      <body className="min-h-screen">
        {children}
        <VersionInfo />
      </body>
    </html>
  )
}
