import { PageTitle } from '@/components/ui/common'
import { QuizCard } from '@/components/quiz/quiz-card'
import { createClient } from '@/lib/supabase/server'

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

async function getAvailableQuizzes() {
  const supabase = await createClient()

  const { data: quizzes, error: quizzesError } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: true })

  if (quizzesError) {
    throw new Error(quizzesError.message)
  }

  console.log(quizzes)

  return quizzes
}
