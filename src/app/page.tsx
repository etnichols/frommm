'use client'

import { Button } from '@/components/ui/button'
import QuizList from '@/components/quiz/quiz-list'
import { Section } from '@/components/ui/section'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const quizData = [
    {
      slug: '/quiz/all-stars',
      name: 'All Stars',
      description: 'Active All-Star NBA players. 15 Questions.',
    },
    {
      slug: '/quiz/the-original',
      name: 'The Original ™',
      description:
        'Thirty questions of increasing difficulty. Note: intentionally excludes Big 12 players.',
    },
    {
      slug: '/create',
      name: 'Create your own',
      description: 'Create your own quiz, and share it with friends.',
    },
  ]

  return (
    <Section headline="Create, take and share quizzes on where current and former NBA players went to college.">
      <QuizList quizData={quizData} />
      <Button
        onClick={() => {
          router.push('/quizzes')
        }}
        className="my-8 flex w-48"
        variant="default"
      >
        See all quizzes
      </Button>
    </Section>
  )
}
