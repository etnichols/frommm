'use server'

import { Quiz, QuizData, QuizQuestion } from '@/types/quiz'

import { createClient } from '../supabase/server'

export async function getAvailableQuizzes() {
  const supabase = await createClient()

  const { data: quizzes, error: quizzesError } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: true })

  if (quizzesError) {
    throw new Error(quizzesError.message)
  }

  return quizzes
}

export async function getQuizData(slug: string): Promise<QuizData | null> {
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
    quiz: quiz as Quiz,
    questions: questions as QuizQuestion[],
  }
}
