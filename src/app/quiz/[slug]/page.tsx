import Link from 'next/link'
import { Quiz } from '@/components/quiz/quiz'
import { Section } from '@/components/ui/section'
import { getQuizData } from '@/lib/server/quizzes'

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
