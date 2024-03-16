'use client'

import Link from 'next/link'
import { Section } from '@/components/section'

export default function Home() {
  const quizData = [
    {
      slug: '65dc0cbe2e0c821efa6ef0b8',
      name: 'The Original ™',
      description:
        'The original "From???" quiz. Thirty questions of increasing difficulty (Note: intentionally excludes Big 12 players).',
    },
    {
      slug: 'old-school',
      name: 'Old School',
      description: 'Players drafted before 1990.',
    },
    {
      slug: 'random',
      name: 'Random',
      description:
        'Randomly generated quiz featuring active NBA players only. 30 questions of varying difficulty.',
    },
    {
      slug: 'create',
      name: 'Create your own',
      description: 'Create your own quiz, and share it with friends.',
    },
  ]
  return (
    <Section headline="Quizzes">
      {quizData.map((quiz) => (
        <Link
          className="flex flex-col min-w-full md:w-7/12 justify-center items-center bg-blue-100 gap-y-4 transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg p-8 rounded-lg"
          key={quiz.slug}
          href={`/quiz/${quiz.slug}`}
        >
          <div className="text-lg font-semibold">{quiz.name}</div>
          <div className="text-base text-center leading-loose">{quiz.description}</div>
        </Link>
      ))}
    </Section>
  )
}
