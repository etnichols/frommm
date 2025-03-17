'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

import { QuizQuestion as QuizQuestionType } from '@/types/quiz'
import { QuizState } from '@/lib/hooks/use-quiz'

export function QuizResults({
  state,
  questions,
  quizId,
  slug,
}: {
  state: QuizState
  questions: QuizQuestionType[]
  quizId: number
  slug: string
}) {
  const correctAnswerCount = questions
    .map((question, index) => {
      return question.players.origin.id === state.answers[index]
    })
    .filter(Boolean).length

  const percentage = Math.floor((correctAnswerCount / questions.length) * 100)

  const saveQuizResult = async (initials: string) => {
    const quizResult = {
      answers: state.answers,
      quizId,
      score: correctAnswerCount,
      initials,
    }

    const saveQuizResultResponse = await fetch(`/api/quiz/${slug}`, {
      method: 'POST',
      body: JSON.stringify(quizResult),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const saveQuizResultJson = await saveQuizResultResponse.json()

    return saveQuizResultJson
  }

  return (
    <div className="flex flex-col justify-center items-center gap-y-8">
      <div className="text-lg font-bold tracking-wider">
        Result: {correctAnswerCount}/{questions.length} ({percentage}%)
      </div>
      {/* <SaveResultDialog saveResultFn={saveQuizResult} /> */}
      <Table className="text-xs">
        <TableCaption>Your Quiz Results</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Player</TableHead>
            <TableHead>Your Answer</TableHead>
            <TableHead>Correct Answer</TableHead>
            <TableHead className="text-right"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => {
            const isCorrect = question.players.origin.id === state.answers[index]
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{question.players.name}</TableCell>
                <TableCell>{state.answers[index] || 'No answer'}</TableCell>
                <TableCell>{question.players.origin.name}</TableCell>
                <TableCell className="text-right">{isCorrect ? '✅' : '❌'}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
