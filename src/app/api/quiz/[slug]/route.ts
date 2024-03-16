import Quiz from '@/lib/mongo/schema/quiz'
import mongoose from 'mongoose'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  await mongoose.connect(process.env.MONGO_DB_URI!)

  const quiz = await Quiz.findOne({ _id: '65dc0cbe2e0c821efa6ef0b8' }).lean().exec()

  if (!quiz) {
    console.log('Quiz not found')
    return new Response('Quiz not found', { status: 404 })
  }

  return new Response(JSON.stringify(quiz), { status: 200 })
}
