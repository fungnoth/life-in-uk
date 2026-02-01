'use client'

interface QuizNavigationProps {
  currentQuestionIndex: number
  totalQuestions: number
  showResult: boolean
  canMarkForReview: boolean
  isCurrentQuestionReviewed: boolean
  isLastQuestion: boolean
  isComplete?: boolean
  onPrevious: () => void
  onNext: () => void
  onCheck: () => void
  onMarkForReview: () => void
  onFinish: () => void
  mode: 'practice' | 'test' | 'individual'
}

export function QuizNavigation({
  currentQuestionIndex,
  totalQuestions,
  showResult,
  canMarkForReview,
  isCurrentQuestionReviewed,
  isLastQuestion,
  isComplete = false,
  onPrevious,
  onNext,
  onCheck,
  onMarkForReview,
  onFinish,
  mode
}: QuizNavigationProps) {
  return (
    <div className="flex gap-3 sm:justify-between">
      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="btn--gray disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <span className="material-symbols-outlined">
          chevron_left
        </span>
      </button>


      {showResult ? (
        isLastQuestion ? (
          <button
            onClick={onFinish}
            className="btn--green flex-1"
          >
            Finish {mode === 'test' ? 'Test' : mode === 'individual' ? 'Exam' : 'Practice'}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="btn--blue flex-1"
          >
            Next
          </button>
        )
      ) : (
        isLastQuestion && isComplete ? (
          <button
            onClick={onFinish}
            className="btn--green flex-1"
          >
            Finish {mode === 'test' ? 'Test' : mode === 'individual' ? 'Exam' : 'Practice'}
          </button>
        ) : (
          <button
            onClick={onCheck}
            className="btn--blue flex-1"
          >
            Check
          </button>
        )
      )}

      <button
        onClick={onMarkForReview}
        disabled={!canMarkForReview}
        className={`flex items-center justify-center ${canMarkForReview
          ? 'btn--warning'
          : 'btn--gray disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        title={!canMarkForReview ? 'Cannot mark reviewed or checked questions' : 'Mark this question for review'}
      >
        {
          isCurrentQuestionReviewed ?
            <span className="material-symbols-outlined">bookmark_added</span> :
            <span className="material-symbols-outlined">bookmark</span>
        }
      </button>
    </div>
  )
}
