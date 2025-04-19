'use client'

import { Loader2 } from 'lucide-react'
import { PageTitle } from '../ui/common'
import { QuizData } from '@/types/quiz'
import { QuizQuestion } from './quiz-question'
import { QuizResults } from './quiz-results'
import { QuizStep } from '@/lib/hooks/use-quiz'
import { useQuiz } from '@/lib/hooks/use-quiz'

export function Quiz({ quiz, questions }: QuizData) {
  const quizQuestions = questions.slice()
  const { state, dispatch } = useQuiz(quizQuestions)

  let content = null

  switch (state.step) {
    case QuizStep.QUESTIONS:
      content = <QuizQuestion state={state} questions={quizQuestions} dispatch={dispatch} />
      break
    case QuizStep.RESULTS:
      content = <QuizResults state={state} questions={quizQuestions} />
      break
    case QuizStep.GRADING:
      content = (
        <div className="flex flex-col justify-center items-center gap-y-6 mt-8">
          <Loader2 className="size-6 text-orange-500 animate-spin"></Loader2>
          <div className="text-sm">Grading your quiz...</div>
        </div>
      )
      break
    default:
      break
  }

  return (
    <div className="mt-4 flex flex-col gap-y-6 flex-grow">
      <PageTitle>{quiz.title}</PageTitle>
      {content}
    </div>
  )
}
