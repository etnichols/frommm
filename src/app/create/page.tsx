'use client'

import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { TEST_QUIZ } from '@/lib/data/test-quiz'
import { useState } from 'react'

export default function Home() {
  const [quiz, setQuiz] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  return (
    <Section headline="Create Quiz Page">
      <Button
        onClick={async () => {
          try {
            const quizCreationResponse = await fetch('/api/quiz/create', {
              method: 'POST',
              body: JSON.stringify(TEST_QUIZ),
              headers: {
                'Content-Type': 'application/json',
              },
            })
            const quizCreationJson = await quizCreationResponse.json()
            alert('Quiz created successfully')
          } catch (e) {
            console.error(e)
            alert('Quiz creation failed, ' + e)
          }
        }}
        className="bg-emerald-500 w-96"
      >
        Create Test Quiz
      </Button>
    </Section>
  )
}
