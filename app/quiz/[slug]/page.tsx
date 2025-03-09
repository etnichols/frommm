import Link from 'next/link'
import Quiz from '@components/quiz/quiz'
import { Section } from '@components/section'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const quiz = await getQuiz(params.slug)

  if (!quiz) {
    return (
      <Section headline="Quiz not found, sorry">
        Check the URL and try again.{' '}
        <Link className="hover:underline" href="/quizzes">
          Return to Quizzes Page
        </Link>
      </Section>
    )
  }

  return <Quiz quiz={quiz} />
}

async function getQuiz(slug: string) {
  try {
    const apiResponse = await fetch(`${process.env.BASE_URL}/api/quiz/${slug}`, {
      cache: 'no-cache',
    })

    if (!apiResponse.ok) {
      console.log('Error fetching quiz', apiResponse)
      return null
    }

    const quizJson = apiResponse.json()
    return quizJson
  } catch (e) {
    console.log('Error fetching quiz', e)
    return null
  }
}
