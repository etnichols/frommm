import mongoose from 'mongoose'

const quizSchema = new mongoose.Schema({
  title: String,
  slug: {
    type: String,
    unique: true,
  },
  creator: String,
  createdAt: Date,
  updatedAt: Date,
  questions: [
    {
      name: String,
      college: String,
    },
  ],
})

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema)
