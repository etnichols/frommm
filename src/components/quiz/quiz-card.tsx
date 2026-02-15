import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Quiz } from '@/types/quiz'
import { ArrowRight, Trophy } from 'lucide-react'
import Link from 'next/link'

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const { title, description, slug } = quiz

  return (
    <Card className="border border-gray-300 border-solid">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <p>{description}</p>
        <div className="mt-4 flex items-center gap-x-3">
          <Link
            href={`/quiz/${slug}`}
            className="group flex items-center gap-x-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Take Quiz
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={`/quiz/${slug}/leaderboard`}
            className="flex items-center gap-x-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Trophy className="size-4" />
            Leaderboard
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
