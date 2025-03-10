'use client'

import { AVAILABLE_QUIZZES } from '@/lib/data/quiz-list'
import { PageTitle } from '@/components/ui/common'
import { QuizCard } from '@/components/quiz/quiz-card'

export default function Page() {
  return (
    <div className="flex flex-col gap-y-6">
      <PageTitle>Browse Quizzes</PageTitle>
      {AVAILABLE_QUIZZES.map((quiz) => (
        <QuizCard key={quiz.slug} {...quiz} />
      ))}
    </div>
  )
}
