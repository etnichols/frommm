'use server'

import { createClient } from '../supabase/server'

export async function saveQuizResult(
  quizId: number,
  firstName: string,
  lastName: string,
  email: string,
  score: number,
  totalQuestions: number,
) {
  const supabase = await createClient()

  const { error } = await supabase.from('quiz_results').insert({
    quiz_id: quizId,
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.toLowerCase().trim(),
    score,
    total_questions: totalQuestions,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function getLeaderboard(quizId: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quiz_results')
    .select('id, first_name, last_name, score, total_questions, created_at')
    .eq('quiz_id', quizId)
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(10)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
