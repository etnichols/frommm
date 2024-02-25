const Quiz = require('../lib/mongo/schema/quiz.ts')
const mongoose = require('mongoose')

const QUIZ_DATA = {
  title: 'Test Quiz 1',
  slug: 'test-quiz-1',
  creator: 'Evan Nichols',
  createdAt: new Date(),
  updatedAt: new Date(),
  questions: [
    {
      question: 'Chris Paul',
      answer: ['Wake Forest University', 'Wake Forest'],
    },
    {
      question: 'Klay Thompson',
      answer: ['Washington State University', 'Washington State', 'WSU'],
    },
    {
      question: 'Rudy Gobert',
      answer: ['None', 'Did not attend college in the USA'],
    },
    {
      question: 'Donovan Mitchell',
      answer: ['University of Louisville', 'Louisville'],
    },
    {
      question: 'Bam Adebayo',
      answer: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      question: 'Draymond Green',
      answer: ['Michigan State University', 'Michigan State', 'MSU'],
    },
    {
      question: 'Zach LaVine',
      answer: ['University of California Los Angeles', 'UCLA'],
    },
    {
      question: 'CJ McCollum',
      answer: ['Lehigh University', 'Lehigh'],
    },
    {
      question: "De'Aaron Fox",
      answer: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      question: 'Julius Randle',
      answer: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      question: 'Jayson Tatum',
      answer: ['Duke University', 'Duke'],
    },
    {
      question: 'Brandon Ingram',
      answer: ['Duke University', 'Duke'],
    },
    {
      question: 'Ja Morant',
      answer: ['Murray State University', 'Murray State'],
    },
    {
      question: 'Trae Young',
      answer: ['University of Oklahoma', 'Oklahoma', 'OU'],
    },
    {
      question: 'Pascal Siakam',
      answer: ['New Mexico State University', 'New Mexico State', 'NMSU'],
    },
    {
      question: 'Devin Booker',
      answer: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      question: 'Karl-Anthony Towns',
      answer: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      question: 'Ben Simmons',
      answer: ['Louisiana State University', 'LSU', 'Louisiana State'],
    },
    {
      question: 'Bradley Beal',
      answer: ['University of Florida', 'Florida', 'UF'],
    },
    {
      question: 'John Collins',
      answer: ['Wake Forest University', 'Wake Forest'],
    },
  ],
}

const MONGO_DB_URL =
  'mongodb+srv://admin:kingfish@frommm-dev.pok74ny.mongodb.net/frommm?retryWrites=true&w=majority'

const addQuiz = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })

    const quiz = new Quiz(QUIZ_DATA)
    await quiz.save()

    console.log('Quiz added successfully:', quiz)
    process.exit(0)
  } catch (error) {
    console.error('Error adding quiz:', error)
  }
}

addQuiz()
