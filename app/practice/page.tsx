'use client'

import { usePracticeSettings } from '../components/PracticeSettingsProvider'
import { QuizContainer } from '../components/quiz'

export default function PracticePage() {
  const { shuffleQuestions, isLoaded } = usePracticeSettings()

  const config = {
    mode: 'practice' as const,
    shuffleQuestions: isLoaded ? shuffleQuestions : false,
    shuffleAnswers: true,
    showInstantFeedback: true,
    allowReview: true,
    showProgress: true
  }

  return <QuizContainer config={config} />
}
