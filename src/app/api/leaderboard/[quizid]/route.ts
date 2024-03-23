import QuizResult from '@/models/QuizResult'
import dbConnect from '@/lib/db-connect'

export async function GET(request: Request, { params }: { params: { quizid: string } }) {
  await dbConnect()

  const quizResults = await QuizResult.find({ quizId: params.quizid })
    .select({ score: 1, _id: 1, initials: 1 })
    .sort({ score: -1 }) // Sort by the scores in descending order
    .limit(10)

  if (!quizResults) {
    return new Response(
      JSON.stringify({
        message: 'Quiz results not found',
        success: false,
      }),
      { status: 404 },
    )
  }

  return new Response(JSON.stringify(quizResults), { status: 200 })
}
