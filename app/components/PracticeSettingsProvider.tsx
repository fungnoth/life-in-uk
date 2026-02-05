'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const SHUFFLE_STORAGE_KEY = 'life-in-uk-practice-shuffle-questions'

interface PracticeSettingsContextValue {
  shuffleQuestions: boolean
  setShuffleQuestions: (value: boolean) => void
  isLoaded: boolean
}

const PracticeSettingsContext = createContext<PracticeSettingsContextValue | undefined>(undefined)

export function PracticeSettingsProvider({ children }: { children: React.ReactNode }) {
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SHUFFLE_STORAGE_KEY)
      if (stored !== null) {
        setShuffleQuestions(stored === 'true')
      }
    } catch (error) {
      console.error('Failed to load practice shuffle setting', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(SHUFFLE_STORAGE_KEY, String(shuffleQuestions))
    } catch (error) {
      console.error('Failed to save practice shuffle setting', error)
    }
  }, [shuffleQuestions, isLoaded])

  const value = useMemo(
    () => ({ shuffleQuestions, setShuffleQuestions, isLoaded }),
    [shuffleQuestions, isLoaded]
  )

  return (
    <PracticeSettingsContext.Provider value={value}>
      {children}
    </PracticeSettingsContext.Provider>
  )
}

export function usePracticeSettings() {
  const context = useContext(PracticeSettingsContext)
  if (!context) {
    throw new Error('usePracticeSettings must be used within PracticeSettingsProvider')
  }
  return context
}
