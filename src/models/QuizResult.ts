import mongoose from 'mongoose'

export interface QuizAnswer {
  name: string
  college: string
}

export interface QuizResult extends mongoose.Document {
  quizId: mongoose.Schema.Types.ObjectId
  answers: QuizAnswer[]
}

/* QuizSchema will correspond to a MongoDB collection. */
const QuizResultSchema = new mongoose.Schema<QuizResult>({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please provide a quiz ID.'],
  },
  answers: [
    {
      name: {
        type: String,
        required: [true, 'Please provide a name for this question.'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
      },
      college: {
        type: String,
        required: [true, 'Please provide a college for this question.'],
        maxlength: [200, 'College cannot be more than 200 characters'],
      },
    },
  ],
})

export default mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema)
