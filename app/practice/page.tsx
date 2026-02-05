'use client'

import { useSearchParams } from 'next/navigation'
import { QuizContainer } from '../components/quiz'

export default function PracticePage() {
  const searchParams = useSearchParams()
  const shuffleQuestions = searchParams.get('shuffleQuestions') === 'true'

  const config = {
    mode: 'practice' as const,
    shuffleQuestions,
    shuffleAnswers: true,
    showInstantFeedback: true,
    allowReview: true,
    showProgress: true
  }

  return <QuizContainer config={config} />
}
