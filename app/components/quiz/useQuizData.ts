import { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import { getAssetUrl } from '../../utils/assets'
import { QuestionData, QuizConfig, QuizState, QuestionStatus } from './types'

export function useQuizData(config: QuizConfig) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: {},
    questionStatuses: {},
    reviewedQuestions: new Set(),
    showResult: false,
    timeLeft: config.timeLimit,
    loading: true,
    error: null
  })

  const isLocalStorageLoaded = useRef<boolean>(false)

  // Storage keys
  const REVIEWED_STORAGE_KEY = 'life-in-uk-reviewed-questions'
  const PROGRESS_STORAGE_KEY = 'life-in-uk-practice-progress'

  // Load state from localStorage
  useEffect(() => {
    if (config.mode === 'practice' && !isLocalStorageLoaded.current && state.questions.length > 0) {
      try {
        const storedReviewed = localStorage.getItem(REVIEWED_STORAGE_KEY)
        const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY)

        const updates: Partial<QuizState> = {}

        if (storedReviewed) {
          const reviewedKeys = JSON.parse(storedReviewed) as string[]
          const newReviewedIndices = new Set<number>()
          state.questions.forEach((q, index) => {
            const key = `${q.examNumber}-${q.questionNumber}`
            if (reviewedKeys.includes(key)) newReviewedIndices.add(index)
          })
          updates.reviewedQuestions = newReviewedIndices
        }

        if (storedProgress) {
          const progress = JSON.parse(storedProgress) as {
            selectedAnswers: { [key: string]: number[] },
            questionStatuses: { [key: string]: QuestionStatus },
            currentIndex: number
          }

          const newSelectedAnswers: { [key: number]: number[] } = {}
          const newQuestionStatuses: { [key: number]: QuestionStatus } = {}

          state.questions.forEach((q, index) => {
            const key = `${q.examNumber}-${q.questionNumber}`
            if (progress.selectedAnswers[key]) newSelectedAnswers[index] = progress.selectedAnswers[key]
            if (progress.questionStatuses[key]) newQuestionStatuses[index] = progress.questionStatuses[key]
          })

          updates.selectedAnswers = newSelectedAnswers
          updates.questionStatuses = newQuestionStatuses
          updates.currentQuestionIndex = Math.min(progress.currentIndex || 0, state.questions.length - 1)
          updates.showResult = !!newQuestionStatuses[updates.currentQuestionIndex]
        }

        if (Object.keys(updates).length > 0) {
          setState(prev => ({ ...prev, ...updates }))
        }
      } catch (e) {
        console.error('Failed to load state from localStorage', e)
      }
      isLocalStorageLoaded.current = true
    }
  }, [config.mode, state.questions])

  // Sync state to localStorage
  useEffect(() => {
    if (config.mode === 'practice' && isLocalStorageLoaded.current) {
      try {
        // Reviewed questions
        const reviewedKeys = Array.from(state.reviewedQuestions).map(index => {
          const q = state.questions[index]
          return q ? `${q.examNumber}-${q.questionNumber}` : null
        }).filter(Boolean)
        localStorage.setItem(REVIEWED_STORAGE_KEY, JSON.stringify(reviewedKeys))

        // Progress
        const selectedAnswersByKeys: { [key: string]: number[] } = {}
        const statusesByKeys: { [key: string]: QuestionStatus } = {}

        Object.entries(state.selectedAnswers).forEach(([index, answers]) => {
          const q = state.questions[parseInt(index)]
          if (q) selectedAnswersByKeys[`${q.examNumber}-${q.questionNumber}`] = answers
        })

        Object.entries(state.questionStatuses).forEach(([index, status]) => {
          const q = state.questions[parseInt(index)]
          if (q) statusesByKeys[`${q.examNumber}-${q.questionNumber}`] = status
        })

        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
          selectedAnswers: selectedAnswersByKeys,
          questionStatuses: statusesByKeys,
          currentIndex: state.currentQuestionIndex
        }))
      } catch (e) {
        console.error('Failed to save state to localStorage', e)
      }
    }
  }, [state.reviewedQuestions, state.selectedAnswers, state.questionStatuses, state.currentQuestionIndex, config.mode, state.questions])

  // Load questions and answers from CSV files
  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsResponse, answersResponse] = await Promise.all([
          fetch(getAssetUrl('questions.csv')),
          fetch(getAssetUrl('answers.csv'))
        ])

        if (!questionsResponse.ok || !answersResponse.ok) {
          throw new Error('Failed to load quiz data')
        }

        const questionsText = await questionsResponse.text()
        const answersText = await answersResponse.text()

        const questionsData = Papa.parse<any>(questionsText, {
          header: true,
          skipEmptyLines: true
        }).data

        const answersData = Papa.parse<any>(answersText, {
          header: true,
          skipEmptyLines: true
        }).data

        // Group answers by question
        const questionMap = new Map<string, QuestionData>()

        // Filter questions based on config
        questionsData.forEach((q: any) => {
          if (q.question && q.question.trim().length > 0) {
            // Filter by exam number if specified
            if (config.examNumber && parseInt(q.examNumber) !== config.examNumber) {
              return
            }

            const key = `${q.examNumber}-${q.questionNumber}`
            questionMap.set(key, {
              ...q,
              internalQuestionNumber: 0,
              examNumber: parseInt(q.examNumber),
              questionNumber: parseInt(q.questionNumber),
              answers: [],
              isMultipleChoice: false
            })
          }
        })

        answersData.forEach((a: any) => {
          const key = `${a.examNumber}-${a.questionNumber}`
          const question = questionMap.get(key)
          if (question && a.answer && a.answer.trim().length > 0) {
            question.answers.push({
              ...a,
              examNumber: parseInt(a.examNumber),
              questionNumber: parseInt(a.questionNumber),
              answerNumber: parseInt(a.answerNumber)
            })
          }
        })

        // Determine if each question is multiple choice and filter valid questions
        const validQuestions = Array.from(questionMap.values())
          .filter(question => {
            const hasValidAnswers = question.answers.length > 0
            const correctAnswers = question.answers.filter(a =>
              a.isCorrect && (a.isCorrect.toLowerCase() === 'true' || a.isCorrect.toLowerCase() === 'yes')
            )
            const hasCorrectAnswer = correctAnswers.length > 0

            // Set multiple choice flag
            question.isMultipleChoice = correctAnswers.length > 1

            return hasValidAnswers && hasCorrectAnswer
          })
          .map((question, index) => ({
            ...question,
            internalQuestionNumber: index + 1
          }))

        if (validQuestions.length === 0) {
          throw new Error('No valid questions found after filtering')
        }

        // Apply question limit and shuffling
        let finalQuestions = validQuestions

        if (config.shuffleQuestions) {
          finalQuestions = [...finalQuestions].sort(() => Math.random() - 0.5)
        }

        if (config.maxQuestions && finalQuestions.length > config.maxQuestions) {
          finalQuestions = finalQuestions.slice(0, config.maxQuestions)
        }

        // Shuffle answers if configured
        if (config.shuffleAnswers) {
          finalQuestions.forEach(question => {
            question.answers.sort(() => Math.random() - 0.5)
          })
        }


        setState(prev => ({
          ...prev,
          questions: finalQuestions,
          loading: false,
          currentQuestionIndex: Math.min(prev.currentQuestionIndex, finalQuestions.length - 1)
        }))

      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to load quiz data',
          loading: false
        }))
      }
    }

    loadData()
  }, [config.examNumber, config.maxQuestions, config.shuffleQuestions, config.shuffleAnswers, config.mode])

  // Track question timing when question changes

  // Timer countdown for test mode
  useEffect(() => {
    if (config.timeLimit && state.timeLeft && state.timeLeft > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft ? prev.timeLeft - 1 : 0
        }))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.timeLeft, config.timeLimit])

  const actions = {
    selectAnswer: (answerNumber: number) => {
      if (state.showResult) return

      const currentQuestion = state.questions[state.currentQuestionIndex]
      if (!currentQuestion) return

      setState(prev => {
        const currentSelections = prev.selectedAnswers[prev.currentQuestionIndex] || []

        let newSelections: number[]
        if (currentQuestion.isMultipleChoice) {
          // Multiple choice: toggle selection
          const isSelected = currentSelections.includes(answerNumber)
          if (isSelected) {
            newSelections = currentSelections.filter(num => num !== answerNumber)
          } else {
            newSelections = [...currentSelections, answerNumber]
          }
        } else {
          // Single choice: replace selection
          newSelections = [answerNumber]
        }

        return {
          ...prev,
          selectedAnswers: {
            ...prev.selectedAnswers,
            [prev.currentQuestionIndex]: newSelections
          }
        }
      })
    },

    checkAnswer: () => {
      const selectedAnswerNumbers = state.selectedAnswers[state.currentQuestionIndex] || []
      if (selectedAnswerNumbers.length === 0) {
        alert('Please select an answer before checking.')
        return
      }

      const currentQuestion = state.questions[state.currentQuestionIndex]
      if (!currentQuestion) return

      const correctAnswerNumbers = currentQuestion.answers
        .filter(a => a.isCorrect && (a.isCorrect.toLowerCase() === 'true' || a.isCorrect.toLowerCase() === 'yes'))
        .map(a => a.answerNumber)

      const isCorrect = selectedAnswerNumbers.length === correctAnswerNumbers.length &&
        selectedAnswerNumbers.every(num => correctAnswerNumbers.includes(num)) &&
        correctAnswerNumbers.every(num => selectedAnswerNumbers.includes(num))


      setState(prev => {
        const newReviewedQuestions = new Set(prev.reviewedQuestions)
        // Only clear review status in non-practice modes when answering
        if (config.mode !== 'practice') {
          newReviewedQuestions.delete(prev.currentQuestionIndex)
        }

        return {
          ...prev,
          questionStatuses: {
            ...prev.questionStatuses,
            [prev.currentQuestionIndex]: isCorrect ? 'correct' : 'incorrect'
          },
          reviewedQuestions: newReviewedQuestions,
          showResult: true
        }
      })
    },

    markForReview: () => {
      // For practice mode, always allow marking for review
      const canMark = config.mode === 'practice' || (!state.showResult &&
        state.questionStatuses[state.currentQuestionIndex] !== 'correct' &&
        state.questionStatuses[state.currentQuestionIndex] !== 'incorrect')

      if (!canMark) return


      setState(prev => {
        const newReviewedQuestions = new Set(prev.reviewedQuestions)
        if (newReviewedQuestions.has(prev.currentQuestionIndex)) {
          newReviewedQuestions.delete(prev.currentQuestionIndex)
        } else {
          newReviewedQuestions.add(prev.currentQuestionIndex)
        }

        return {
          ...prev,
          reviewedQuestions: newReviewedQuestions
        }
      })

      // Auto-advance for practice/test modes
      if (config.mode !== 'individual' && state.currentQuestionIndex < state.questions.length - 1) {
        actions.nextQuestion()
      }
    },

    nextQuestion: () => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        setState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          showResult: false
        }))
      }
    },

    previousQuestion: () => {
      if (state.currentQuestionIndex > 0) {
        setState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
          showResult: false
        }))
      }
    },

    goToQuestion: (index: number) => {
      if (index >= 0 && index < state.questions.length) {
        setState(prev => ({
          ...prev,
          currentQuestionIndex: index,
          showResult: false
        }))
      }
    },

    finishQuiz: () => {
      // Calculate results
      const results = state.questions.map((question, index) => {
        const selectedAnswerNumbers = state.selectedAnswers[index] || []
        const correctAnswers = question.answers.filter(a =>
          a.isCorrect && (a.isCorrect.toLowerCase() === 'true' || a.isCorrect.toLowerCase() === 'yes')
        )
        const correctAnswerNumbers = correctAnswers.map(a => a.answerNumber)

        const wasAnswered = selectedAnswerNumbers.length > 0 ||
          state.questionStatuses[index] === 'correct' ||
          state.questionStatuses[index] === 'incorrect'

        const isCorrect = wasAnswered && selectedAnswerNumbers.length === correctAnswerNumbers.length &&
          selectedAnswerNumbers.every(num => correctAnswerNumbers.includes(num)) &&
          correctAnswerNumbers.every(num => selectedAnswerNumbers.includes(num))

        const userAnswerTexts = selectedAnswerNumbers.map(num =>
          question.answers.find(a => a.answerNumber === num)?.answer || ''
        ).filter(text => text)

        const correctAnswerTexts = correctAnswers.map(a => a.answer)

        return {
          questionIndex: index,
          internalQuestionNumber: question.internalQuestionNumber,
          examNumber: question.examNumber,
          questionNumber: question.questionNumber,
          question: question.question,
          reference: question.reference,
          selectedAnswers: selectedAnswerNumbers,
          correctAnswers: correctAnswerNumbers,
          isCorrect,
          wasAnswered,
          userAnswerTexts,
          correctAnswerTexts,
          isReviewed: state.reviewedQuestions.has(index)
        }
      })

      const answeredCount = results.filter(r => config.mode === 'practice' ? r.wasAnswered : r.selectedAnswers.length > 0).length
      const correctCount = results.filter(r => r.isCorrect).length

      return {
        results: config.mode === 'practice'
          ? results.filter(r => r.wasAnswered || r.isReviewed)
          : results,
        summary: {
          totalQuestions: state.questions.length,
          answeredCount,
          correctCount,
          percentage: Math.round((correctCount / answeredCount) * 100) || 0
        }
      }
    }
  }

  const getters = {
    getCurrentQuestion: () => state.questions[state.currentQuestionIndex],

    getQuestionStatus: (index: number): QuestionStatus => {
      if (index === state.currentQuestionIndex) return 'current'
      if (state.reviewedQuestions.has(index)) return 'review'
      const status = state.questionStatuses[index]
      if (status === 'correct') return 'correct'
      if (status === 'incorrect') return 'incorrect'
      return 'unanswered'
    },

    getCurrentResult: () => {
      if (!state.showResult) return null

      const currentQuestion = state.questions[state.currentQuestionIndex]
      if (!currentQuestion) return null

      const selectedAnswerNumbers = state.selectedAnswers[state.currentQuestionIndex] || []
      const correctAnswers = currentQuestion.answers.filter(a =>
        a.isCorrect && (a.isCorrect.toLowerCase() === 'true' || a.isCorrect.toLowerCase() === 'yes')
      )
      const correctAnswerNumbers = correctAnswers.map(a => a.answerNumber)

      const isCorrect = selectedAnswerNumbers.length === correctAnswerNumbers.length &&
        selectedAnswerNumbers.every(num => correctAnswerNumbers.includes(num)) &&
        correctAnswerNumbers.every(num => selectedAnswerNumbers.includes(num))

      return {
        isCorrect,
        correctAnswers,
        selectedAnswerNumbers
      }
    },

    getAnsweredCount: () => {
      return state.questions.filter((_, index) =>
        state.questionStatuses[index] === 'correct' ||
        state.questionStatuses[index] === 'incorrect' ||
        (state.selectedAnswers[index] && state.selectedAnswers[index].length > 0)
      ).length
    },

    isComplete: () => {
      return state.questions.every((_, index) =>
        state.questionStatuses[index] === 'correct' ||
        state.questionStatuses[index] === 'incorrect' ||
        (state.selectedAnswers[index] && state.selectedAnswers[index].length > 0)
      )
    },

    canMarkForReview: () => {
      if (config.mode === 'practice') return true
      return !state.showResult &&
        state.questionStatuses[state.currentQuestionIndex] !== 'correct' &&
        state.questionStatuses[state.currentQuestionIndex] !== 'incorrect'
    },

    isCurrentQuestionReviewed: () => {
      return state.reviewedQuestions.has(state.currentQuestionIndex)
    }
  }

  return {
    state,
    actions,
    getters,
    config
  }
}
