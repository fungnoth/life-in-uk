'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface TestResult {
  questionIndex: number
  examNumber: number
  questionNumber: number
  question: string
  reference: string
  selectedAnswers: number[]
  correctAnswers: number[]
  isCorrect: boolean
  wasAnswered: boolean
  userAnswerTexts: string[]
  correctAnswerTexts: string[]
  isReviewed: boolean
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [clearedFeedback, setClearedFeedback] = useState<string | null>(null)

  useEffect(() => {
    const resultsData = searchParams.get('data')
    const resultsId = searchParams.get('id')
    const mode = searchParams.get('mode')

    if (resultsData) {
      // Legacy method: data in URL (for backward compatibility)
      try {
        const parsedResults = JSON.parse(decodeURIComponent(resultsData))
        setResults(parsedResults)
      } catch (error) {
        console.error('Error parsing results data from URL:', error)
      }
    } else if (resultsId) {
      // New method: data in sessionStorage
      try {
        let storageKey
        if (mode === 'individual') {
          storageKey = `individual-results-${resultsId}`
        } else if (mode === 'practice') {
          storageKey = `practice-results-${resultsId}`
        } else {
          storageKey = `test-results-${resultsId}`
        }
        const storedData = sessionStorage.getItem(storageKey)

        if (storedData) {
          const parsedResults = JSON.parse(storedData)
          setResults(parsedResults)

          // Clean up the stored data after loading
          sessionStorage.removeItem(storageKey)
        } else {
          console.error('No results data found in sessionStorage')
        }
      } catch (error) {
        console.error('Error parsing results data from sessionStorage:', error)
      }
    }

    setLoading(false)
  }, [searchParams])

  // Get additional parameters for individual tests
  const mode = searchParams.get('mode')
  const examNumber = searchParams.get('examNumber')
  const originalMode = searchParams.get('originalMode')

  // Determine the test type for display
  const getTestTitle = () => {
    if (mode === 'individual') {
      return `Exam ${examNumber} Results ${originalMode === 'practice' ? '(Practice)' : '(Test)'}`
    } else if (mode === 'practice') {
      return 'Practice Results'
    } else {
      return 'Test Results'
    }
  }

  const correctCount = results.filter(r => r.isCorrect).length
  const incorrectCount = results.length - correctCount
  const percentage = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0
  const passed = percentage >= 75
  const resultsToReview = results.filter(r => !r.isCorrect || r.isReviewed)

  const exportIncorrectAnswers = () => {
    const csvHeaders = [
      'Question Number',
      'Question',
      'Your Answer(s)',
      'Correct Answer(s)',
      'Status',
      'Explanation'
    ]

    const csvRows = resultsToReview.map(result => [
      `Question ${result.questionIndex + 1}`,
      `"${result.question.replace(/"/g, '""')}"`,
      `"${result.userAnswerTexts.join('; ').replace(/"/g, '""')}"`,
      `"${result.correctAnswerTexts.join('; ').replace(/"/g, '""')}"`,
      result.isReviewed ? (result.isCorrect ? 'Correct (Reviewed)' : 'Incorrect (Reviewed)') : 'Incorrect',
      `"${result.reference.replace(/"/g, '""')}"`
    ])

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `life-in-uk-incorrect-answers-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const clearPracticeProgress = () => {
    if (window.confirm('Are you sure you want to clear your practice progress? This will reset all your answers but keep your review markers.')) {
      localStorage.removeItem('life-in-uk-practice-progress')
      setClearedFeedback('Practice progress cleared!')
      setTimeout(() => setClearedFeedback(null), 3000)
    }
  }

  const clearReviewMarkers = () => {
    if (window.confirm('Are you sure you want to clear all review markers?')) {
      localStorage.removeItem('life-in-uk-reviewed-questions')
      // Update local state to reflect change immediately
      setResults(prev => prev.map(r => ({ ...r, isReviewed: false })))
      setClearedFeedback('Review markers cleared!')
      setTimeout(() => setClearedFeedback(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {getTestTitle()}
            </h1>
            <div className={`text-6xl font-bold mb-4 ${passed ? 'text-success-600' : 'text-danger-600'}`}>
              {percentage}%
            </div>
            <div className={`text-2xl font-semibold ${passed ? 'text-success-800' : 'text-danger-800'}`}>
              {passed ? '🎉 PASSED!' : '❌ FAILED'}
            </div>
            {passed ? (
              <p className="text-lg text-success-700 mt-2">
                Congratulations! You passed the Life in the UK test.
              </p>
            ) : (
              <p className="text-lg text-danger-700 mt-2">
                You need 75% (18 out of 24) to pass. Keep studying and try again!
              </p>
            )}
          </div>

          {/* Score Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-success-600 mb-2">
                {correctCount}
              </div>
              <div className="text-gray-600">Correct Answers</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-danger-600 mb-2">
                {incorrectCount}
              </div>
              <div className="text-gray-600">Incorrect Answers</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {results.length}
              </div>
              <div className="text-gray-600">Total Questions</div>
            </div>
          </div>

          {/* Export and Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              {resultsToReview.length > 0 && (
                <button
                  onClick={exportIncorrectAnswers}
                  className="bg-warning-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-warning-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Questions to Review (CSV)
                </button>
              )}

              <Link
                href={mode === 'individual' ? '/individual' : '/test'}
                className="bg-primary-600 !text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                {mode === 'individual' ? 'Take Another Individual Test' : 'Take Another Test'}
              </Link>

              <Link
                href="/"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>

            {/* Persistence Management (Practice Mode Only) */}
            {mode === 'practice' && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Practice Progress Management
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={clearPracticeProgress}
                    className="bg-danger-50 text-danger-700 px-4 py-2 border border-danger-200 rounded-lg text-sm font-medium hover:bg-danger-100 transition-colors"
                  >
                    Clear Practice Progress
                  </button>
                  <button
                    onClick={clearReviewMarkers}
                    className="bg-warning-50 text-warning-700 px-4 py-2 border border-warning-200 rounded-lg text-sm font-medium hover:bg-warning-100 transition-colors"
                  >
                    Clear All Review Markers
                  </button>
                </div>
                {clearedFeedback && (
                  <div className="mt-3 text-sm text-success-600 font-medium animate-fade-in">
                    {clearedFeedback}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Questions to Review Details */}
          {resultsToReview.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Questions to Review ({resultsToReview.length})
              </h2>

              <div className="space-y-6">
                {resultsToReview.map((result, index) => (
                  <div key={index} className={`border-l-4 ${result.isCorrect ? 'border-warning-500' : 'border-danger-500'} pl-4 py-2`}>
                    <div className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      Question {result.questionIndex + 1}: {result.question}
                      {result.isReviewed && (
                        <span className="bg-warning-100 text-warning-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                          Reviewed
                        </span>
                      )}
                    </div>

                    <div className="mb-2">
                      <span className={`${result.wasAnswered ? (result.isCorrect ? 'text-success-600' : 'text-danger-600') : 'text-gray-500'} font-medium`}>Your answer: </span>
                      <span className={result.wasAnswered ? (result.isCorrect ? 'text-success-700' : 'text-danger-700') : 'text-gray-600 italic'}>
                        {result.wasAnswered ? result.userAnswerTexts.join(', ') : 'Not answered'}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="text-success-600 font-medium">Correct answer: </span>
                      <span className="text-success-700">{result.correctAnswerTexts.join(', ')}</span>
                    </div>

                    {result.reference && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Explanation:</strong> {result.reference}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Perfect Score Message */}
          {resultsToReview.length === 0 && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-6 text-center">
              <div className="text-success-700 text-xl font-medium mb-2">
                🌟 Perfect Score! 🌟
              </div>
              <p className="text-success-600">
                Excellent work! You answered all questions correctly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
