const mongoose = require('mongoose')

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
      playerName: String,
      correctAnswers: [String],
    },
  ],
})

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema)
