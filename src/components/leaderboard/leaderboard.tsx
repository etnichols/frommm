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
} from '../ui/table'

import { useState } from 'react'

interface QuizItem {
  _id: string
  value: string
  label: string
}

interface LeaderboardProps {
  items: QuizItem[]
}

export default function Leaderboard({ items }: LeaderboardProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<ComboboxItem | undefined>(undefined)

  return (
    <div className="flex flex-col justify-center items-center gap-y-8">
      <Combobox items={items} onChange={setSelectedQuiz} />
      <LeaderboardTable selectedQuiz={selectedQuiz} />
    </div>
  )
}

const FAKE_DATA = [
  {
    name: 'JMN',
    score: '23',
  },
  {
    name: 'ETN',
    score: '19',
  },
  {
    name: 'PJC',
    score: '13',
  },
  {
    name: 'MCD',
    score: '12',
  },
  {
    name: 'RJH',
    score: '9',
  },
  {
    name: 'JMC',
    score: '3',
  },
]

function LeaderboardTable({ selectedQuiz }: { selectedQuiz?: ComboboxItem }) {
  if (!selectedQuiz) {
    return <div className="p-8 flex text-center">No quiz selected</div>
  }

  // Fetch quiz results.
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
        {FAKE_DATA.map((entry, index) => {
          const scoreString = `${entry.score}/30`
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{entry.name}</TableCell>
              <TableCell>{scoreString}</TableCell>
              <TableCell>{Math.round((parseInt(entry.score) / 30) * 100)}%</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
