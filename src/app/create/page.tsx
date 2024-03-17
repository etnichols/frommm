'use client'

import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { THE_ORIGINAL } from '@/lib/data/the-original'
import { useState } from 'react'

export default function Home() {
  // const [quiz, setQuiz] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleCreateQuiz = async () => {
    try {
      const quizCreationResponse = await fetch('/api/quiz/create', {
        method: 'POST',
        body: JSON.stringify(THE_ORIGINAL),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const quizCreationJson = await quizCreationResponse.json()
      setMessage('Quiz created successfully')
    } catch (e) {
      console.error(e)
      setMessage('Quiz creation failed, ' + e)
    }
  }

  return (
    <Section headline="Create Quiz Page">
      Not Yet Implemented, Come Back Soon!
      {process.env.DEV_MODE === 'true' && (
        <Button
          onClick={async () => {
            handleCreateQuiz()
          }}
          className="bg-emerald-500 w-full md:w-48"
        >
          Create Test Quiz
        </Button>
      )}
    </Section>
  )
}
