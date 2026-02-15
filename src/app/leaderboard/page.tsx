import { PageTitle } from '@/components/ui/common'
import { getAvailableQuizzes } from '@/lib/server/quizzes'
import { Trophy } from 'lucide-react'
import Link from 'next/link'

export default async function LeaderboardPage() {
  const quizzes = await getAvailableQuizzes()

  return (
    <div className="flex flex-col gap-y-6 items-center w-full">
      <PageTitle>Leaderboards</PageTitle>
      {quizzes.length > 0 ? (
        <div className="flex flex-col gap-y-3 w-full max-w-md">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.slug}/leaderboard`}
              className="flex items-center gap-x-3 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Trophy className="size-4 shrink-0 text-orange-500" />
              {quiz.title}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No quizzes available yet.</div>
      )}
    </div>
  )
}
