'use client'

import { Combobox, ComboboxItem } from '@components/combo-box'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table'
import { useEffect, useState } from 'react'

import { Loader2 } from 'lucide-react'
import { QuizResult } from '@models/QuizResult'

interface QuizItem {
  _id: string
  value: string
  label: string
}

interface LeaderboardProps {
  items: QuizItem[]
}

export default function Leaderboard({ items }: LeaderboardProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<ComboboxItem | undefined>(items[0])
  return (
    <div className="flex flex-col justify-center items-center gap-y-8">
      <Combobox selected={selectedQuiz} items={items} onChange={setSelectedQuiz} />
      <LeaderboardTable selectedQuiz={selectedQuiz} />
    </div>
  )
}

function LeaderboardTable({ selectedQuiz }: { selectedQuiz?: ComboboxItem }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [leaderboardData, setLeaderboardData] = useState<Partial<QuizResult>[]>([])

  useEffect(() => {
    async function fetchLeaderboard(quizId: string) {
      setLoading(true)
      try {
        const apiResponse = await fetch(`/api/leaderboard/${quizId}`, {
          // cache: 'no-cache',
        })

        if (!apiResponse.ok) {
          console.log('Error fetching leaderboard', apiResponse)
          setLeaderboardData([])
        }

        const leaderboardJson = await apiResponse.json()
        setLeaderboardData(leaderboardJson as Partial<QuizResult>[])
      } catch (e) {
        console.log('Error fetching leaderboard', e)
        return { leaderboard: [] }
      } finally {
        setLoading(false)
      }
    }

    if (!selectedQuiz) {
      return
    }

    fetchLeaderboard(selectedQuiz.value)
  }, [selectedQuiz])

  if (!selectedQuiz) {
    return <div className="p-8 flex text-center">No quiz selected</div>
  }

  if (loading) {
    return (
      <div className="p-8 flex text-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <Table className="mt-8">
      <TableCaption>{`${selectedQuiz.label} Leaderboard`}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Initials</TableHead>
          <TableHead className="w-[120px]">Score</TableHead>
          <TableHead className="w-[120px]">%</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboardData.map((entry, index) => {
          if (!entry || !entry.initials || !entry.score) {
            return null
          }

          const { initials, score } = entry
          const scoreString = `${score}/30`
          const scorePercentage = `${((score / 30) * 100).toFixed(2)}%`

          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{initials}</TableCell>
              <TableCell>{scoreString}</TableCell>
              <TableCell>{scorePercentage}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}