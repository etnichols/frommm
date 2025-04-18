'use client'

import { Quiz, QuizQuestion } from '@/types/quiz'

import { QuizForm } from '@/components/quiz/quiz-form'
import { useRouter } from 'next/navigation'

interface ClientFormProps {
  initialData: {
    quiz: Quiz
    questions: QuizQuestion[]
  }
}

export function ClientForm({ initialData }: ClientFormProps) {
  const router = useRouter()

  return (
    <QuizForm
      initialData={initialData}
      onSuccess={(quizId, isEdit) => {
        router.push('/quizzes')
      }}
    />
  )
}
