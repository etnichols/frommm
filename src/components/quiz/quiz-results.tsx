'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

import { QuizQuestion as QuizQuestionType } from '@/types/quiz'
import { QuizState } from '@/lib/hooks/use-quiz'

export function QuizResults({
  state,
  questions,
}: {
  state: QuizState
  questions: QuizQuestionType[]
}) {
  const correctAnswerCount = questions
    .map((question, index) => {
      return question.players.origin.id === Number(state.answers[index].id)
    })
    .filter(Boolean).length

  const percentage = Math.floor((correctAnswerCount / questions.length) * 100)

  // const saveQuizResult = async (initials: string) => {
  //   const quizResult = {
  //     answers: state.answers,
  //     score: correctAnswerCount,
  //     initials,
  //   }

  //   const saveQuizResultResponse = await fetch(`/api/quiz/${slug}`, {
  //     method: 'POST',
  //     body: JSON.stringify(quizResult),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })

  //   const saveQuizResultJson = await saveQuizResultResponse.json()

  //   return saveQuizResultJson
  // }

  return (
    <div className="flex flex-col justify-center items-center gap-y-8">
      <div className="text-lg font-bold tracking-wider">
        Result: {correctAnswerCount}/{questions.length} ({percentage}%)
      </div>
      {/* <SaveResultDialog saveResultFn={saveQuizResult} /> */}
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
            const isCorrect = question.players.origin.id === Number(state.answers[index].id)
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{question.players.name}</TableCell>
                <TableCell>{state.answers[index].label || 'No answer'}</TableCell>
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
