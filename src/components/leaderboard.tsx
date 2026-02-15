'use client'

import { useState, useTransition } from 'react'
import type { LeaderboardEntry } from './leaderboard-table'

import { Button } from '@/components/ui/button'
import { LeaderboardTable } from './leaderboard-table'
import { cn } from '@/lib/utils'
import { getLeaderboard } from '@/lib/server/quiz-results'

interface QuizOption {
  id: number
  title: string
}

interface LeaderboardProps {
  quizzes: QuizOption[]
  initialQuizId: number
  initialData: LeaderboardEntry[]
}

export default function Leaderboard({ quizzes, initialQuizId, initialData }: LeaderboardProps) {
  const [selectedQuizId, setSelectedQuizId] = useState(initialQuizId)
  const [data, setData] = useState<LeaderboardEntry[]>(initialData)
  const [isPending, startTransition] = useTransition()

  function handleQuizChange(quizId: number) {
    setSelectedQuizId(quizId)
    startTransition(async () => {
      const result = await getLeaderboard(quizId)
      setData(result)
    })
  }

  return (
    <div className="flex flex-col gap-y-6 w-full items-center">
      <div className="flex flex-row flex-wrap gap-2 justify-center">
        {quizzes.map((quiz) => (
          <Button
            key={quiz.id}
            variant={selectedQuizId === quiz.id ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'text-xs',
              selectedQuizId === quiz.id && 'bg-orange-500 hover:bg-orange-600',
            )}
            onClick={() => handleQuizChange(quiz.id)}
          >
            {quiz.title}
          </Button>
        ))}
      </div>
      <LeaderboardTable data={data} loading={isPending} />
    </div>
  )
}
