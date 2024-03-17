const mongoose = require('mongoose')

const quizResultSchema = new mongoose.Schema({
  quizId: mongoose.Schema.Types.ObjectId,
  nickname: String,
  score: Number,
})

module.exports = mongoose.models.QuizResult || mongoose.model('QuizResult', quizResultSchema)
