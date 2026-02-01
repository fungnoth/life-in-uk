'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Collapsible } from '../Collapsible'

interface QuizHeaderProps {
  mode: 'practice' | 'test' | 'individual'
  examNumber?: number
  currentQuestionIndex: number
  totalQuestions: number
  timeLeft?: number
  answeredCount?: number
  isCurrentQuestionReviewed?: boolean
  onBackToSelection?: () => void
}

export function QuizHeader({
  mode,
  examNumber,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  answeredCount,
  isCurrentQuestionReviewed,
  onBackToSelection
}: QuizHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTitle = () => {
    switch (mode) {
      case 'test':
        return 'Life in the UK Test'
      case 'individual':
        return `Exam ${examNumber} - Practice Mode`
      case 'practice':
        return 'Practice Mode'
      default:
        return 'Quiz'
    }
  }

  const getModeInfo = () => {
    switch (mode) {
      case 'test':
        return (
          <div className="mt-4 p-3 info-card info-red-colors">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 -960 960 960">
                <path d="M425-265h110v-255H425v255Zm55-315q25.5 0 42.75-17.25T540-640q0-25.5-17.25-42.75T480-700q-25.5 0-42.75 17.25T420-640q0 25.5 17.25 42.75T480-580Zm0 534q-91 0-169.99-34.08-78.98-34.09-137.41-92.52-58.43-58.43-92.52-137.41Q46-389 46-480q0-91 34.08-169.99 34.09-78.98 92.52-137.41 58.43-58.43 137.41-92.52Q389-914 480-914q91 0 169.99 34.08 78.98 34.09 137.41 92.52 58.43 58.43 92.52 137.41Q914-571 914-480q0 91-34.08 169.99-34.09 78.98-92.52 137.41-58.43 58.43-137.41 92.52Q571-46 480-46Z" />
              </svg>
              <span className="font-medium">Test Mode: 45 minutes • 24 random questions • Official exam conditions</span>
            </div>
          </div>
        )
      case 'individual':
        return (
          <div className="mt-4 p-3 info-card info-blue-colors">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 -960 960 960">
                <path d="M425-265h110v-255H425v255Zm55-315q25.5 0 42.75-17.25T540-640q0-25.5-17.25-42.75T480-700q-25.5 0-42.75 17.25T420-640q0 25.5 17.25 42.75T480-580Zm0 534q-91 0-169.99-34.08-78.98-34.09-137.41-92.52-58.43-58.43-92.52-137.41Q46-389 46-480q0-91 34.08-169.99 34.09-78.98 92.52-137.41 58.43-58.43 137.41-92.52Q389-914 480-914q91 0 169.99 34.08 78.98 34.09 137.41 92.52 58.43 58.43 92.52 137.41Q914-571 914-480q0 91-34.08 169.99-34.09 78.98-92.52 137.41-58.43 58.43-137.41 92.52Q571-46 480-46Z" />
              </svg>
              <span className="font-medium">Individual Exam: No time limit • All questions from exam {examNumber} • Practice specific exam</span>
            </div>
          </div>
        )
      case 'practice':
        return (
          <div className="info-card info-card--blue mt-4 p-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 -960 960 960">
                <path d="M425-265h110v-255H425v255Zm55-315q25.5 0 42.75-17.25T540-640q0-25.5-17.25-42.75T480-700q-25.5 0-42.75 17.25T420-640q0 25.5 17.25 42.75T480-580Zm0 534q-91 0-169.99-34.08-78.98-34.09-137.41-92.52-58.43-58.43-92.52-137.41Q46-389 46-480q0-91 34.08-169.99 34.09-78.98 92.52-137.41 58.43-58.43 137.41-92.52Q389-914 480-914q91 0 169.99 34.08 78.98 34.09 137.41 92.52 58.43 58.43 92.52 137.41Q914-571 914-480q0 91-34.08 169.99-34.09 78.98-92.52 137.41-58.43 58.43-137.41 92.52Q571-46 480-46Z" />
              </svg>
              <span className="font-medium">Practice Mode: No time limit • All {totalQuestions} questions available • Instant feedback</span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getFullTimerElement = () => {
    return (
      <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
        {timeLeft !== undefined && (
          <div className={`quiz-timer whitespace-nowrap`}>
            Time left: {formatTime(timeLeft)}
          </div>
        )}

        {answeredCount !== undefined && (
          <div className="text-lg font-medium text-color--muted">
            {answeredCount} of {totalQuestions} questions answered
          </div>
        )}

        {onBackToSelection && (
          <button
            onClick={onBackToSelection}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to {mode === 'individual' ? 'Exam Selection' : 'Main Menu'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`section-card section-card-color mb-6 section-px section-py transition-[padding] duration-300 ${isCollapsed ? 'py-3' : ''}`}>
      <div className="">
        <div className="flex grow">
          <div className="grow">
            <div className="flex items-center  gap-2 ">
              <Link href="/" className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined">
                  chevron_left
                </span>
                <span className='sr-only'>Back to Home</span>
              </Link>
              <h1 className="text-2xl md:text-3xl text-color--title font-bold pr-4">
                {getTitle()}
              </h1>
              <Collapsible isOpen={isCollapsed} direction="horizontal">
                <span className="text-sm text-color--muted whitespace-nowrap">
                  {currentQuestionIndex + 1} / {totalQuestions}
                  {timeLeft !== undefined && (
                    <div className={`quiz-timer text-sm`}>
                      {formatTime(timeLeft)}
                    </div>
                  )}
                </span>
              </Collapsible>
            </div>
            <Collapsible isOpen={!isCollapsed}>
              <p className="text-color--muted">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </Collapsible>
          </div>
          <Collapsible isOpen={!isCollapsed} direction="horizontal" className="max-sm:hidden whitespace-nowrap">
            {getFullTimerElement()}
          </Collapsible>
          <button
            onClick={() => toggleCollapse()}
            className="p-2 text-color--muted hover:text-color--title flex items-start pt-3"
            title={isCollapsed ? "Expand Header" : "Collapse Header"}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

      </div>

      <Collapsible isOpen={!isCollapsed}>
        <div className='sm:hidden'>
          {getFullTimerElement()}
        </div>

        {getModeInfo()}
      </Collapsible>
    </div>
  )
}
