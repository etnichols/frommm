'use client'

import { AVAILABLE_QUIZZES } from '@/lib/data/quiz-list'
import QuizList from '@components/quiz/quiz-list'

export default function Home() {
  return (
    <div className="flex flex-col gap-8 md:items-center w-full">
      <h1 className="flex text-xl md:text-3xl text-center mx-8 font-semibold tracking-wide mb-8">
        Quizzes
      </h1>
      <div className="flex flex-col justify-center items-center md:w-9/12 w-full">
        <QuizList quizData={AVAILABLE_QUIZZES} />
      </div>
    </div>
  )
}
