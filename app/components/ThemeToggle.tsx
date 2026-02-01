'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch by waiting until mounted
    useEffect(() => {
        setMounted(true)
    }, [])
    const buttonClass = "ml-auto block p-2 h-10 w-10 leading-none rounded-lg"


    const getButton = () => {
        if (!mounted) {
            return (
                <button className={buttonClass}>
                    <span className="material-symbols-outlined text-[20px]">light_mode</span>
                </button>
            )
        }
        const isDark = resolvedTheme === 'dark'

        return (
            <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={buttonClass}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                <span className="material-symbols-outlined text-[20px]">
                    {isDark ? 'light_mode' : 'dark_mode'}
                </span>
            </button>
        )
    }

    return (
        <div className="container px-2 sm:px-4 mx-auto -mb-6">
            {getButton()}
        </div>
    )



}
