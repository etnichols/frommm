const TEST_QUIZ = require('./test-quiz.ts')

const Quiz = require('../lib/mongo/schema/quiz.ts')
const mongoose = require('mongoose')

const MONGO_DB_URI =
  'mongodb+srv://admin:kingfish@frommm-dev.pok74ny.mongodb.net/frommm?retryWrites=true&w=majority'

const addQuiz = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI)

    const quiz = new Quiz(TEST_QUIZ)
    await quiz.save()

    console.log('Quiz added successfully:', quiz)
    process.exit(0)
  } catch (error) {
    console.error('Error adding quiz:', error)
  }
}

addQuiz()
