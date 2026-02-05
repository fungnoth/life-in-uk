'use client'

import { useEffect } from 'react'

export default function PWARegistration() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return
        }

        // In development, unregister SW and clear app caches to prevent stale assets.
        if (process.env.NODE_ENV !== 'production') {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                registrations.forEach((registration) => {
                    registration.unregister()
                })
            })

            if ('caches' in window) {
                caches.keys().then((cacheNames) => {
                    cacheNames
                        .filter((cacheName) => cacheName.startsWith('life-in-uk-'))
                        .forEach((cacheName) => {
                            caches.delete(cacheName)
                        })
                })
            }
            return
        }

        const isGitHubPages = window.location.hostname === 'domicch.github.io'
        const basePath = isGitHubPages ? '/life-in-uk' : ''
        const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || ''
        const versionParam = buildTime ? `?v=${encodeURIComponent(buildTime)}` : ''
        const swUrl = `${basePath}/sw.js${versionParam}`

        navigator.serviceWorker
            .register(swUrl)
            .then((registration) => {
                console.log('SW registered:', registration)

                // Check for updates on load
                registration.update()

                // Listen for new service worker
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available.
                                console.log('New content available, auto-refreshing...')
                                window.location.reload()
                            }
                        })
                    }
                })
            })
            .catch((error) => {
                console.error('SW registration failed:', error)
            })
    }, [])

    return null
}
