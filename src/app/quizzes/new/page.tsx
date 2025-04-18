'use client'

import { QuizForm } from '@/components/quiz/quiz-form'
import { useRouter } from 'next/navigation'

export default function CreateQuizPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>
      <QuizForm
        onSuccess={(quizId) => {
          router.push('/quizzes')
        }}
      />
    </div>
  )
}
