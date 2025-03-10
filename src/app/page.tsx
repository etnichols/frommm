'use client'

import { AVAILABLE_QUIZZES } from '@/lib/data/quiz-list'
import { PageTitle } from '@/components/ui/common'
import { QuizCard } from '@/components/quiz/quiz-card'

export default function Page() {
  return (
    <div className="flex flex-col gap-y-6">
      <PageTitle>Quizzes on where current and former NBA players went to college.</PageTitle>
      {AVAILABLE_QUIZZES.map((quiz) => (
        <QuizCard
          key={quiz.slug}
          title={quiz.title}
          description={quiz.description}
          slug={quiz.slug}
        />
      ))}
    </div>
  )
}
