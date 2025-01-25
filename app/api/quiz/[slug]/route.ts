import Quiz from '@/models/Quiz'
import QuizResult from '@/models/QuizResult'
import dbConnect from '@/lib/db-connect'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  await dbConnect()

  const quiz = await Quiz.findOne({ slug: params.slug }).lean().exec()

  if (!quiz) {
    return new Response(
      JSON.stringify({
        message: 'Quiz not found',
        success: false,
      }),
      { status: 404 },
    )
  }

  return new Response(JSON.stringify(quiz), { status: 200 })
}

export async function POST(request: Request) {
  await dbConnect()

  const quizResultJson = await request.json()

  try {
    const quizResult = await QuizResult.create(quizResultJson) // Assuming req.body is already in the correct format
    return new Response(JSON.stringify({ quizResult }), { status: 201 })
  } catch (error) {
    console.log('Error saving quiz result: ', error)
    return new Response(JSON.stringify({ message: error, success: false }), { status: 500 })
  }
}
