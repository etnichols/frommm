import Link from 'next/link'
import { LeaderboardTable } from '@/components/leaderboard-table'
import { PageTitle } from '@/components/ui/common'
import { Section } from '@/components/ui/section'
import { getLeaderboard } from '@/lib/server/quiz-results'
import { getQuizData } from '@/lib/server/quizzes'
import { type Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const pageData = await getQuizData(params.slug)

  if (!pageData) {
    return {
      title: 'Leaderboard Not Found | From??? Basketball Quizzes',
    }
  }

  return {
    title: `${pageData.quiz.title} Leaderboard | From??? Basketball Quizzes`,
    description: `Leaderboard for the ${pageData.quiz.title} quiz.`,
  }
}

export default async function QuizLeaderboardPage({ params }: { params: { slug: string } }) {
  const pageData = await getQuizData(params.slug)

  if (!pageData) {
    return (
      <Section headline="Quiz not found, sorry">
        <Link href="/quizzes">Return to Quizzes Page</Link>
      </Section>
    )
  }

  const leaderboardData = await getLeaderboard(pageData.quiz.id)

  return (
    <div className="flex flex-col gap-y-6 items-center w-full mt-4">
      <PageTitle>{pageData.quiz.title} — Leaderboard</PageTitle>
      <LeaderboardTable data={leaderboardData} />
      <Link
        href={`/quiz/${params.slug}`}
        className="text-sm text-orange-500 hover:underline underline-offset-4"
      >
        Take this quiz
      </Link>
    </div>
  )
}
