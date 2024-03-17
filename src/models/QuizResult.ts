import mongoose from 'mongoose'

export interface QuizResult extends mongoose.Document {
  quizId: mongoose.Schema.Types.ObjectId
  answers: string[]
}

/* QuizSchema will correspond to a MongoDB collection. */
const QuizResultSchema = new mongoose.Schema<QuizResult>({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please provide a quiz ID.'],
  },
  answers: mongoose.Schema.Types.Array,
})

export default mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema)
