// Shared types for quiz components

export interface Question {
  examNumber: number
  questionNumber: number
  question: string
  reference: string
}

export interface Answer {
  examNumber: number
  questionNumber: number
  answerNumber: number
  answer: string
  isCorrect: string
}

export interface QuestionData extends Question {
  answers: Answer[]
  isMultipleChoice: boolean
}

export type QuestionStatus = 'unanswered' | 'correct' | 'incorrect' | 'review' | 'current'

export type QuizMode = 'practice' | 'test' | 'individual'

export interface QuizConfig {
  mode: QuizMode
  examNumber?: number
  timeLimit?: number // in seconds
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  maxQuestions?: number
  showInstantFeedback?: boolean
  allowReview?: boolean
  showProgress?: boolean
}

export interface QuizState {
  questions: QuestionData[]
  currentQuestionIndex: number
  selectedAnswers: { [key: number]: number[] }
  questionStatuses: { [key: number]: QuestionStatus }
  reviewedQuestions: Set<number>
  showResult: boolean
  timeLeft?: number
  loading: boolean
  error: string | null
}

export interface QuizResult {
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
