import Link from 'next/link'
import Quiz from '@/components/quiz/quiz'
import { Section } from '@/components/ui/section'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const pageData = await getQuizData(params.slug)

  if (!pageData.quiz) {
    return (
      <Section headline="Quiz not found, sorry">
        Check the URL and try again.{' '}
        <Link className="hover:underline" href="/quizzes">
          Return to Quizzes Page
        </Link>
      </Section>
    )
  }

  return <Quiz {...pageData} />
}

async function getQuizData(slug: string) {
  const supabase = await createClient()

  const { data: quiz, error: quizzesError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('slug', 'the-original')
    .single()

  // Then get the questions with related data
  const { data: questions, error: questionsError } = await supabase
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
    .eq('quiz_id', quiz.id)
    .order('order_index', { ascending: true })

  const { data: origins, error: originsError } = await supabase.from('origins').select('*')

  console.log(origins)
  return {
    quiz,
    questions,
    origins,
  }
}
