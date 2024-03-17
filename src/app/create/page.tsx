'use client'

import { ALL_STARS } from '@/lib/data/all-stars'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { useState } from 'react'

export default function Home() {
  // const [quiz, setQuiz] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleCreateQuiz = async () => {
    try {
      const quizCreationResponse = await fetch('/api/quiz/create', {
        method: 'POST',
        body: JSON.stringify(ALL_STARS),
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
      <Button
        onClick={async () => {
          handleCreateQuiz()
        }}
        className="bg-emerald-500 w-full md:w-48"
      >
        Create Test Quiz
      </Button>
    </Section>
  )
}
