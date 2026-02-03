'use client'

import { useEffect } from 'react'

export default function PWARegistration() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const isGitHubPages = window.location.hostname === 'domicch.github.io'
            const basePath = isGitHubPages ? '/life-in-uk' : ''
            const swUrl = `${basePath}/sw.js`

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
                                    // New content is available!
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
        }
    }, [])

    return null
}
