'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

import { Button } from '../ui/button'
import type { RandomQuizState } from '@/lib/hooks/use-random-quiz'
import { useRouter } from 'next/navigation'

export function RandomQuizResults({ state }: { state: RandomQuizState }) {
  const router = useRouter()

  const { totalCorrect, totalAnswered, bestStreak, history } = state
  const percentage = totalAnswered > 0 ? Math.floor((totalCorrect / totalAnswered) * 100) : 0

  return (
    <div className="flex flex-col justify-center items-center gap-y-8 mb-4">
      <div className="flex flex-col items-center gap-y-2">
        <div className="text-lg font-bold tracking-wider">
          Your Score: {totalCorrect}/{totalAnswered} ({percentage}%)
        </div>
        <div className="text-sm text-gray-500">
          Best Streak: <span className="font-bold text-emerald-500">{bestStreak}</span>
        </div>
      </div>

      {history.length > 0 && (
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead className="w-[100px]">Player</TableHead>
              <TableHead>Your Answer</TableHead>
              <TableHead>Correct Answer</TableHead>
              <TableHead className="text-right"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry, index) => {
              const isCorrect =
                entry.answer !== null &&
                entry.question.players.origin.id === Number(entry.answer?.id)
              return (
                <TableRow key={`${entry.question.id}-${index}`}>
                  <TableCell className="text-gray-400">{index + 1}</TableCell>
                  <TableCell className="font-medium">{entry.question.players.name}</TableCell>
                  <TableCell>{entry.answer?.name || 'Skipped'}</TableCell>
                  <TableCell>{entry.question.players.origin.name}</TableCell>
                  <TableCell className="text-right">{isCorrect ? '✅' : '❌'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      <div className="flex flex-row gap-x-4">
        <Button
          variant="outline"
          onClick={() => {
            // Full page reload to reset client state
            window.location.href = '/random'
          }}
        >
          Play Again
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            router.push('/quizzes')
          }}
        >
          Back to Quizzes
        </Button>
      </div>
    </div>
  )
}
