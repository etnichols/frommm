import { PageTitle } from '@/components/ui/common'
import { QuizCard } from '@/components/quiz/quiz-card'
import { getAvailableQuizzes } from '@/lib/server/quizzes'

export default async function Page() {
  const quizzes = await getAvailableQuizzes()

  return (
    <div className="flex flex-col gap-y-6">
      <PageTitle>Quizzes on where current and former NBA players went to college.</PageTitle>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.slug} quiz={quiz} />
      ))}
    </div>
  )
}
