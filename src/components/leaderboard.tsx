'use client'

import { Combobox, ComboboxItem } from '@/components/ui/combo-box'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'

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
    <>
      <Combobox selected={selectedQuiz} items={items} onChange={setSelectedQuiz} />
      <LeaderboardTable selectedQuiz={selectedQuiz} />
    </>
  )
}

// TODO: Add loading indicator.
function LeaderboardTable({ selectedQuiz }: { selectedQuiz?: ComboboxItem }) {
  const [leaderboardData, setLeaderboardData] = useState<Partial<any>[]>([])

  useEffect(() => {
    async function fetchLeaderboard(quizId: string) {
      try {
        const apiResponse = await fetch(`/api/leaderboard/${quizId}`, {
          cache: 'no-cache',
        })

        if (!apiResponse.ok) {
          console.log('Error fetching leaderboard', apiResponse)
          setLeaderboardData([])
        }

        const leaderboardJson = await apiResponse.json()

        console.dir(leaderboardJson)
        setLeaderboardData(leaderboardJson as Partial<any>[])
      } catch (e) {
        console.log('Error fetching leaderboard', e)
        return { leaderboard: [] }
      }
    }

    if (!selectedQuiz) return

    fetchLeaderboard(selectedQuiz.value)
  }, [selectedQuiz])

  if (!selectedQuiz) {
    return <div className="flex text-center">No quiz selected</div>
  }

  return (
    <Table>
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
