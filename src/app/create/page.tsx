'use client'

import { AddPlayerForm } from '@/components/player/add-player-form'
import { Button } from '@/components/ui/button'
import { QuizForm } from '@/components/quiz/quiz-form'
import { useState } from 'react'

export default function CreatePage() {
  const [formType, setFormType] = useState<'player' | 'quiz'>('player')

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">This feature is not available in production</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex justify-center space-x-4">
        <Button
          variant={formType === 'player' ? 'default' : 'outline'}
          onClick={() => setFormType('player')}
          aria-pressed={formType === 'player'}
          className={formType === 'player' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        >
          Add Players
        </Button>
        <Button
          variant={formType === 'quiz' ? 'default' : 'outline'}
          onClick={() => setFormType('quiz')}
          aria-pressed={formType === 'quiz'}
          className={formType === 'quiz' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        >
          Create Quiz
        </Button>
      </div>

      {formType === 'player' ? <AddPlayerForm /> : <QuizForm />}
    </div>
  )
}
