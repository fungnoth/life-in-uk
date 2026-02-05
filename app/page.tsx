'use client'

import Link from 'next/link'
import { usePracticeSettings } from './components/PracticeSettingsProvider'

export default function Home() {
  const { shuffleQuestions, setShuffleQuestions } = usePracticeSettings()

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl text-color--title font-bold mb-6">
          Life in the UK Test
        </h1>

        <p className="text-xl  mb-12 max-w-2xl mx-auto">
          Practice for your British citizenship test with authentic questions.
          Test your knowledge of UK history, culture, and government.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="section-card section-card-color relative pt-12 md:py-12">
            <label className="absolute top-0 right-0 flex items-center justify-end gap-3 px-3 py-2 text-sm font-medium">
              <span className={`${shuffleQuestions ? ' text-primary-600 dark:text-primary-100' : 'text-color--muted dark:opacity-85'}`}>Shuffle Questions</span>
              <span className="relative inline-flex scale-[0.85] h-7 w-12 items-center">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={e => setShuffleQuestions(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-primary-500"></span>
                <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"></span>
              </span>
            </label>
            <h2 className="text-2xl font-semibold mb-4">
              📚 Practice Mode
            </h2>
            <p className=" mb-6">
              Practice with all available questions. No time limit, instant feedback.
            </p>
            <Link
              href="/practice"
              className="inline-block btn--blue"
            >
              Start Practice
            </Link>
          </div>

          <div className="section-card section-card-color md:py-12">
            <h2 className="text-2xl font-semibold mb-4">
              ⏱️ Test Mode
            </h2>
            <p className="mb-6">
              Take the official test format: 24 questions, 45 minutes, pass with 75%.
            </p>
            <Link
              href="/test"
              className="inline-block btn--green"
            >
              Take Test
            </Link>
          </div>

          <div className="section-card section-card-color md:py-12">
            <h2 className="text-2xl font-semibold mb-4">
              📋 Individual Tests
            </h2>
            <p className="mb-6">
              Practice specific exam sets. Choose from available individual tests.
            </p>
            <Link
              href="/individual"
              className="inline-block btn--blue"
            >
              Select Exam
            </Link>
          </div>
        </div>

        <div className="info-card--blue section-px section-py">
          <h3 className="text-lg font-semibold mb-2">
            About the Life in the UK Test
          </h3>
          <p className="">
            This test is required for anyone applying for British citizenship or settlement.
            You need to score 75% (18 out of 24 questions) to pass.
          </p>
        </div>
      </div>
    </main>
  )
}
