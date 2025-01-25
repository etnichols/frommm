import mongoose from 'mongoose'

export interface QuizQuestion {
  name: string
  college: string
}

export interface QuizType extends mongoose.Document {
  title: string
  description?: string
  author: string
  slug: string
  questions: QuizQuestion[]
}

/* QuizSchema will correspond to a MongoDB collection. */
const QuizSchema = new mongoose.Schema<QuizType>({
  title: {
    type: String,
    required: [true, 'Please provide a title for this quiz.'],
    maxlength: [70, 'Name cannot be more than 70 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  author: {
    type: String,
    required: [true, 'Please provide quiz author.'],
    maxlength: [70, 'Quiz Author name cannot be more than 70 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide quiz URL (slug).'],
    unique: true,
  },
  questions: [
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

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema)
