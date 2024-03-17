'use client'

import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <Section headline="Create, take and share quizzes on where current and former NBA players went to college.">
      <Button
        onClick={() => {
          router.push('/quizzes')
        }}
        className="flex w-48"
        variant="default"
      >
        Take a Quiz Now
      </Button>
    </Section>
  )
}
