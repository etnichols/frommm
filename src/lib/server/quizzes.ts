'use server'

import { Quiz, QuizData, QuizQuestion } from '@/types/quiz'

import { createClient } from '../supabase/server'

export async function getAvailableQuizzes() {
  const supabase = await createClient()

  const { data: quizzes, error: quizzesError } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false })

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
        hint,
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

export async function createQuiz(formData: {
  title: string
  slug: string
  description: string
  difficulty: number
  isPublished: boolean
  questions: {
    playerId: number | null
    hint: string
    difficulty: number
    points: number
  }[]
}) {
  const supabase = await createClient()

  try {
    // Only keep valid questions (with playerId and hint)
    const validQuestions = formData.questions.filter(
      (question) => question.playerId !== null && question.hint.trim(),
    )

    if (validQuestions.length === 0) {
      return { success: false, error: 'Please add at least one valid question' }
    }

    // Insert the quiz
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        is_published: formData.isPublished,
      })
      .select('id')
      .single()

    if (quizError) throw quizError

    // Insert questions for the quiz
    const quizQuestions = validQuestions.map((question, index) => ({
      quiz_id: quizData.id,
      player_id: question.playerId,
      order_index: index,
      hint: question.hint.trim(),
      difficulty: question.difficulty,
      points: question.points,
    }))

    const { error: questionsError } = await supabase.from('quiz_questions').insert(quizQuestions)

    if (questionsError) throw questionsError

    return { success: true, error: '', quizId: quizData.id }
  } catch (error) {
    return { success: false, error: 'Failed to create quiz: ' + JSON.stringify(error, null, 2) }
  }
}

export async function updateQuiz(
  quizId: number,
  formData: {
    title: string
    slug: string
    description: string
    difficulty: number
    isPublished: boolean
    questions: {
      id?: number
      playerId: number | null
      hint: string
      difficulty: number
      points: number
      orderIndex: number
    }[]
  },
) {
  const supabase = await createClient()

  try {
    // Only keep valid questions (with playerId)
    const validQuestions = formData.questions.filter((question) => question.playerId !== null)

    if (validQuestions.length === 0) {
      return { success: false, error: 'Please add at least one valid question' }
    }

    // Update the quiz
    const { error: quizError } = await supabase
      .from('quizzes')
      .update({
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        is_published: formData.isPublished,
      })
      .eq('id', quizId)

    if (quizError) throw quizError

    // Delete existing questions and recreate them
    const { error: deleteError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('quiz_id', quizId)

    if (deleteError) throw deleteError

    // Insert updated questions
    const quizQuestions = validQuestions.map((question, index) => ({
      quiz_id: quizId,
      player_id: question.playerId,
      order_index: question.orderIndex ?? index,
      hint: question.hint.trim(),
      difficulty: question.difficulty,
      points: question.points,
    }))

    // Debug: Log quiz questions before inserting
    console.log('Quiz questions to insert:', JSON.stringify(quizQuestions, null, 2))

    const { data: insertedData, error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(quizQuestions)
      .select()

    if (questionsError) throw questionsError

    // Debug: Log inserted data
    console.log('Inserted data:', JSON.stringify(insertedData, null, 2))

    return { success: true, error: '', quizId }
  } catch (error) {
    console.error('Update quiz error:', error)
    return { success: false, error: 'Failed to update quiz: ' + JSON.stringify(error, null, 2) }
  }
}
