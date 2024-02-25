'use client'

import { Section } from '@/components/section'
import Link from 'next/link'

export default function Home() {
  const quizData = [
    {
      slug: 'test-quiz-1',
      name: 'The Original',
      description: 'The original "From???" quiz',
    },
    {
      slug: '2000s',
      name: '2000s',
      description: 'Players from the 2000s',
    },
    {
      slug: 'old-school',
      name: 'Old School (90s or before)',
      description: 'Players from the 90s or before',
    },
  ]
  return (
    <Section headline="Quizzes Page">
      <div>Create your own or take a premade quiz</div>
      {quizData.map((quiz) => (
        <div key={quiz.slug}>
          <Link href={`/quiz/${quiz.slug}`}>{quiz.name}</Link>
        </div>
      ))}
    </Section>
  )
}
