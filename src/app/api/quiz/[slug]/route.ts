import Quiz from '@/models/Quiz'
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

export async function POST(request: Request, { params }: { params: { slug: string } }) {
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
