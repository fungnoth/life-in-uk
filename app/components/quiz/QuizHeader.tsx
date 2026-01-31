'use client'

import { useState } from 'react'

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
    if (isCollapsed) return null

    switch (mode) {
      case 'test':
        return (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 -960 960 960">
                <path d="M425-265h110v-255H425v255Zm55-315q25.5 0 42.75-17.25T540-640q0-25.5-17.25-42.75T480-700q-25.5 0-42.75 17.25T420-640q0 25.5 17.25 42.75T480-580Zm0 534q-91 0-169.99-34.08-78.98-34.09-137.41-92.52-58.43-58.43-92.52-137.41Q46-389 46-480q0-91 34.08-169.99 34.09-78.98 92.52-137.41 58.43-58.43 137.41-92.52Q389-914 480-914q91 0 169.99 34.08 78.98 34.09 137.41 92.52 58.43 58.43 92.52 137.41Q914-571 914-480q0 91-34.08 169.99-34.09 78.98-92.52 137.41-58.43 58.43-137.41 92.52Q571-46 480-46Z" />
              </svg>
              <span className="font-medium">Test Mode: 45 minutes • 24 random questions • Official exam conditions</span>
            </div>
          </div>
        )
      case 'individual':
        return (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 -960 960 960">
                <path d="M425-265h110v-255H425v255Zm55-315q25.5 0 42.75-17.25T540-640q0-25.5-17.25-42.75T480-700q-25.5 0-42.75 17.25T420-640q0 25.5 17.25 42.75T480-580Zm0 534q-91 0-169.99-34.08-78.98-34.09-137.41-92.52-58.43-58.43-92.52-137.41Q46-389 46-480q0-91 34.08-169.99 34.09-78.98 92.52-137.41 58.43-58.43 137.41-92.52Q389-914 480-914q91 0 169.99 34.08 78.98 34.09 137.41 92.52 58.43 58.43 92.52 137.41Q914-571 914-480q0 91-34.08 169.99-34.09 78.98-92.52 137.41-58.43 58.43-137.41 92.52Q571-46 480-46Z" />
              </svg>
              <span className="font-medium">Individual Exam: No time limit • All questions from exam {examNumber} • Practice specific exam</span>
            </div>
          </div>
        )
      case 'practice':
        return (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
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

  if (isCollapsed) {
    return (
      <div className="bg-white rounded-lg shadow-sm mb-6 p-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Expand Header"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <h1 className="text-lg font-bold text-gray-900">
            {getTitle()}
          </h1>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Collapse Header"
          >
            <svg className="w-5 h-5 text-gray-500 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {getTitle()}
            </h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
              {isCurrentQuestionReviewed && (
                <span className="ml-2 px-2 py-1 bg-warning-100 text-warning-800 text-sm rounded">
                  📋 Marked for Review
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
          {timeLeft !== undefined && (
            <div className="text-lg font-medium text-gray-600">
              Time remaining: {formatTime(timeLeft)}
            </div>
          )}

          {answeredCount !== undefined && (
            <div className="text-lg font-medium text-gray-600">
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
      </div>

      {getModeInfo()}
    </div>
  )
}
