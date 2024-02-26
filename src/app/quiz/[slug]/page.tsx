import Quiz from '@/components/quiz/quiz'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const quiz = await getQuiz(params.slug)

  return <Quiz quiz={quiz} />
}

async function getQuiz(slug: string) {
  const quizJson = await fetch(`${process.env.BASE_URL}/api/quiz/${slug}`, {
    cache: 'no-cache',
  }).then((res) => res.json())

  if (!quizJson) {
    console.log('Quiz not found')
    return null
  }

  return quizJson
}
