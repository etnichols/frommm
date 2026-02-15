import { ArrowRight, Dices } from 'lucide-react'
import Link from 'next/link'
import { PageTitle } from '@/components/ui/common'
import { QuizCard } from '@/components/quiz/quiz-card'
import { getAvailableQuizzes } from '@/lib/server/quizzes'

export default async function Page() {
  const quizzes = await getAvailableQuizzes()

  return (
    <div className="flex flex-col gap-y-6">
      <PageTitle>Browse Quizzes</PageTitle>
      <Link
        href="/random"
        className="group flex items-center gap-x-3 rounded-lg border border-orange-300 bg-orange-50 p-4 transition-colors hover:bg-orange-100"
      >
        <Dices className="size-6 text-orange-500" />
        <div className="flex flex-col flex-grow">
          <span className="font-bold">Random Mode</span>
          <span className="text-sm text-gray-600">
            Endless random players — see how long your streak can go!
          </span>
        </div>
        <span className="flex items-center gap-x-1 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors group-hover:bg-orange-600">
          Go
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.slug} quiz={quiz} />
      ))}
    </div>
  )
}
