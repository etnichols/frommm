import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { cn } from '@/lib/utils'
import { Trophy } from 'lucide-react'

export interface LeaderboardEntry {
  id: number
  first_name: string
  last_name: string
  score: number
  total_questions: number
  created_at: string
}

const podiumStyles: Record<number, { trophy: string; row: string; rank: string }> = {
  0: {
    trophy: 'text-yellow-500',
    row: 'bg-yellow-50 dark:bg-yellow-950/30',
    rank: 'text-yellow-600 dark:text-yellow-400 font-extrabold',
  },
  1: {
    trophy: 'text-gray-400',
    row: 'bg-gray-50 dark:bg-gray-900/30',
    rank: 'text-gray-500 dark:text-gray-400 font-extrabold',
  },
  2: {
    trophy: 'text-amber-700',
    row: 'bg-orange-50 dark:bg-orange-950/20',
    rank: 'text-amber-700 dark:text-amber-500 font-extrabold',
  },
}

export function LeaderboardTable({
  data,
  loading,
}: {
  data: LeaderboardEntry[]
  loading?: boolean
}) {
  if (loading) {
    return <div className="text-sm text-gray-500 py-8 text-center">Loading...</div>
  }

  if (data.length === 0) {
    return <div className="text-sm text-gray-500 py-8 text-center">No results yet. Be the first!</div>
  }

  // Competition ranking: same score = same rank; next rank skips (e.g. 1,2,3,3,3,6)
  const ranks: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i === 0) ranks.push(1)
    else if (data[i].score === data[i - 1].score) ranks.push(ranks[i - 1]!)
    else ranks.push(i + 1)
  }

  return (
    <div className="w-full max-w-lg mx-auto border border-border rounded-md overflow-hidden">
      <Table className="text-xs sm:text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="w-[60px] font-bold">#</TableHead>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="w-[80px] text-center font-bold">Score</TableHead>
            <TableHead className="w-[60px] text-center font-bold">%</TableHead>
            <TableHead className="text-right font-bold">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {data.map((entry, index) => {
          const rank = ranks[index]!
          const displayName = `${entry.first_name} ${entry.last_name.charAt(0).toUpperCase()}.`
          const scoreString = `${entry.score}/${entry.total_questions}`
          const percentage = Math.round((entry.score / entry.total_questions) * 100)
          const date = new Date(entry.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })

          const podium = rank <= 3 ? podiumStyles[rank - 1] : undefined
          const isPodium = rank <= 3

          return (
            <TableRow key={entry.id} className={cn(podium?.row)}>
              <TableCell>
                <span className="flex items-center gap-1">
                  {isPodium && <Trophy className={cn('size-3.5', podium?.trophy)} />}
                  <span className={cn(isPodium ? podium?.rank : 'text-gray-400')}>
                    {rank}
                  </span>
                </span>
              </TableCell>
              <TableCell className={cn('font-semibold', isPodium && 'font-bold')}>
                {displayName}
              </TableCell>
              <TableCell className="text-center font-mono">{scoreString}</TableCell>
              <TableCell
                className={cn(
                  'text-center font-semibold',
                  percentage === 100 && 'text-emerald-600',
                  percentage >= 70 && percentage < 100 && 'text-orange-500',
                  percentage < 70 && 'text-gray-500',
                )}
              >
                {percentage}%
              </TableCell>
              <TableCell className="text-right text-gray-500">{date}</TableCell>
            </TableRow>
          )
        })}
        </TableBody>
      </Table>
    </div>
  )
}
