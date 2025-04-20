import Link from 'next/link'
import { Quiz } from '@/components/quiz/quiz'
import { Section } from '@/components/ui/section'
import { getQuizData } from '@/lib/server/quizzes'
import { type Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const pageData = await getQuizData(params.slug)

  if (!pageData) {
    return {
      title: 'Quiz Not Found | From??? Basketball Quizzes',
      description: 'The requested basketball quiz could not be found.',
    }
  }

  return {
    title: `${pageData.quiz.title} | From??? Basketball Quizzes`,
    description:
      pageData.quiz.description || 'Test your knowledge of NBA players and their college origins.',
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const pageData = await getQuizData(params.slug)

  if (!pageData) {
    return <NotFound />
  }

  return <Quiz {...pageData} />
}

function NotFound() {
  return (
    <Section headline="Quiz not found, sorry">
      <Link href="/quizzes">Return to Quizzes Page</Link>
    </Section>
  )
}
