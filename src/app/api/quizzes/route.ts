import Quiz from '@/models/Quiz'
import dbConnect from '@/lib/db-connect'

export async function GET() {
  await dbConnect()

  const quizzes = await Quiz.find({})
    .select({ title: 1, _id: 1 })
    .sort({ createdAt: -1 }) // Sort by the createdAt field in descending order
    .limit(10)

  if (!quizzes) {
    return new Response(
      JSON.stringify({
        message: 'Quizzes not found',
        success: false,
      }),
      { status: 404 },
    )
  }

  return new Response(JSON.stringify({ quizzes }), { status: 200 })
}
