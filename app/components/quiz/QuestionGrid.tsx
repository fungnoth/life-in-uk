import { useState } from 'react'
import { QuestionStatus } from './types'

interface QuestionGridProps {
  questions: any[]
  currentQuestionIndex: number
  getQuestionStatus: (index: number) => QuestionStatus
  onQuestionClick: (index: number) => void
  mode: 'practice' | 'test' | 'individual'
}

export function QuestionGrid({
  questions,
  currentQuestionIndex,
  getQuestionStatus,
  onQuestionClick,
  mode
}: QuestionGridProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusClass = (status: QuestionStatus) => {
    switch (status) {
      case 'current':
        return 'primary-blue-colors '
      case 'correct':
        return 'primary-green-colors '
      case 'incorrect':
        return 'primary-red-colors'
      case 'review':
        return 'primary-amber-colors '
      default:
        return 'plain-light-gray-colors'
    }
  }

  // For practice mode, show all questions with a toggle
  if (mode === 'practice') {
    return (
      <div className="mb-6">
        <div className="flex justify-end items-center mb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-color--blue font-medium flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Collapse
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Expand All
              </>
            )}
          </button>
        </div>
        <div
          className="mb-4 overflow-y-auto grid gap-2 pr-2 grid-cols-[repeat(var(--cols,20),minmax(0,1fr))]
          [--cols:10] md:[--cols:20]"
          style={{
            resize: isExpanded ? 'vertical' : 'none',
            minHeight: '40px',
            maxHeight: isExpanded ? 'none' : '90px',
          } as React.CSSProperties}
        >
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`w-8 h-8 text-xs rounded border-2 font-medium transition-all duration-200 ${getStatusClass(getQuestionStatus(index))
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // For test and individual modes, show questions in a responsive grid
  return (
    <div
      className="grid gap-2 mb-4 grid-cols-[repeat(var(--cols-sm,10),minmax(0,1fr))] lg:grid-cols-[repeat(var(--cols-lg,20),minmax(0,1fr))]"
      style={{
        '--cols-sm': 10,
        '--cols-lg': 20
      } as React.CSSProperties}
    >
      {questions.map((_, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick(index)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 ${getStatusClass(getQuestionStatus(index))
            }`}
          title={`Question ${index + 1} - ${getQuestionStatus(index).charAt(0).toUpperCase() + getQuestionStatus(index).slice(1)}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  )
}

interface QuestionStatusLegendProps {
  mode: 'practice' | 'test' | 'individual'
}

export function QuestionStatusLegend({ mode }: QuestionStatusLegendProps) {
  return (
    <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 primary-blue-colors border-2 rounded"></div>
        <span className="text-color--muted">Current</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 primary-green-colors border-2 rounded"></div>
        <span className="text-color--muted">Correct</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 primary-red-colors border-2 rounded"></div>
        <span className="text-color--muted">Incorrect</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 primary-amber-colors border-2 rounded"></div>
        <span className="text-color--muted">Review</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 plain-light-gray-colors border-2 rounded"></div>
        <span className="text-color--muted">Unanswered</span>
      </div>
    </div>
  )
}
