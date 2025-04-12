import { PageTitle } from '@/components/ui/common'
import { QuizCard } from '@/components/quiz/quiz-card'
import { getAvailableQuizzes } from '@/lib/server/quizzes'

export default async function Page() {
  const quizzes = await getAvailableQuizzes()

  return (
    <div className="flex flex-col gap-y-6">
      <PageTitle>Browse Quizzes</PageTitle>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.slug} quiz={quiz} />
      ))}
    </div>
  )
}
