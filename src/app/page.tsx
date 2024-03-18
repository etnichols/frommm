'use client'

import { AVAILABLE_QUIZZES } from '@/lib/data/quiz-list'
import { Button } from '@/components/ui/button'
import QuizList from '@/components/quiz/quiz-list'
import { Section } from '@/components/ui/section'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <Section headline="Create, take and share quizzes on where current and former NBA players went to college.">
      <QuizList quizData={AVAILABLE_QUIZZES} />
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
