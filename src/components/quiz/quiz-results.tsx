'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

import { Button } from '../ui/button'
import { QuizQuestion as QuizQuestionType } from '@/types/quiz'
import { QuizState } from '@/lib/hooks/use-quiz'
import { useRouter } from 'next/navigation'

export function QuizResults({
  state,
  questions,
}: {
  state: QuizState
  questions: QuizQuestionType[]
}) {
  const router = useRouter()
  const correctAnswerCount = questions
    .map((question, index) => {
      return question?.players?.origin?.id === Number(state.answers[index]?.id)
    })
    .filter(Boolean).length

  const percentage = Math.floor((correctAnswerCount / questions.length) * 100)

  return (
    <div className="flex flex-col justify-center items-center gap-y-8 mb-4">
      <div className="text-lg font-bold tracking-wider">
        Your Score: {correctAnswerCount}/{questions.length} ({percentage}%)
      </div>
      <Table className="text-xs">
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
            const isCorrect = question?.players?.origin?.id === Number(state.answers[index]?.id)
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{question.players.name}</TableCell>
                <TableCell>{state.answers[index]?.name || 'No answer'}</TableCell>
                <TableCell>{question.players?.origin?.name}</TableCell>
                <TableCell className="text-right">{isCorrect ? '✅' : '❌'}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Button
        variant="outline"
        onClick={() => {
          router.push('/quizzes')
        }}
      >
        Play Again
      </Button>
    </div>
  )
}
