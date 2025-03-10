'use client'

import { AVAILABLE_QUIZZES } from '@/lib/data/quiz-list'
import { QuizCard } from '@/components/quiz/quiz-card'
import Row from '@/components/ui/row'

export default function Page() {
  return (
    <div className="flex flex-col gap-y-6">
      <Row className="tracking-wide font-semibold">All Quizzes</Row>
      <Row className="flex flex-col gap-y-6">
        {AVAILABLE_QUIZZES.map((quiz) => (
          <QuizCard key={quiz.slug} {...quiz} />
        ))}
      </Row>
    </div>
  )
}
