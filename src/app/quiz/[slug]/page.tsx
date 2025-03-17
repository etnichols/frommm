import { QuizData, QuizQuestion, Quiz as QuizType } from '@/types/quiz'

import Link from 'next/link'
import { Quiz } from '@/components/quiz/quiz'
import { Section } from '@/components/ui/section'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const pageData = await getQuizData(params.slug)

  if (!pageData) {
    return <NotFound />
  }

  return <Quiz {...pageData} />
}

async function getQuizData(slug: string): Promise<QuizData | null> {
  const supabase = await createClient()

  const { data: quiz, error: quizzesError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!quiz || quizzesError) {
    return null
  }

  const { data: questions, error: questionsError } = (await supabase
    .from('quiz_questions')
    .select(
      `
        id,
        player_id,
        order_index,
        players (
          id,
          name,
          origin:origin_id (
            id,
            name
          ),
          team:team_id (
            id,
            team,
            location,
            abbreviation
          )
        )
        `,
    )
    .eq('quiz_id', quiz?.id)
    .order('order_index', { ascending: true })) as { data: QuizQuestion[] | null; error: any }

  if (!questions || !questions.length || questionsError) {
    return null
  }

  return {
    quiz: quiz as QuizType,
    questions: questions as QuizQuestion[],
  }
}

function NotFound() {
  return (
    <Section headline="Quiz not found, sorry">
      <Link href="/quizzes">Return to Quizzes Page</Link>
    </Section>
  )
}
