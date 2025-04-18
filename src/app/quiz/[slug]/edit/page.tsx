import { ClientForm } from './client-form'
import { getQuizData } from '@/lib/server/quizzes'
import { redirect } from 'next/navigation'

interface EditQuizPageProps {
  params: {
    slug: string
  }
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { slug } = params
  const quizData = await getQuizData(slug)

  if (!quizData) {
    redirect('/quizzes')
  }

  if (process.env.NODE_ENV === 'production') {
    redirect('/quizzes')
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Quiz</h1>
      <ClientForm initialData={quizData} />
    </div>
  )
}
