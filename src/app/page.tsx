'use client'

import { Section } from '@/components/section'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <Section
      headline="Quizzes on where current and former NBA players went to college"
      withImage={true}
    >
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
