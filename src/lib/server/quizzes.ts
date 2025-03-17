'use server'

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

  console.log(quizzes)

  return quizzes
}
