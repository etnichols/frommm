const Quiz = require('../lib/mongo/schema/quiz.ts')
const mongoose = require('mongoose')

const QUIZ_DATA = {
  title: 'The Original',
  slug: 'the-original',
  creator: 'Evan Nichols',
  createdAt: new Date(),
  updatedAt: new Date(),
  questions: [
    {
      playerName: 'Chris Paul',
      correctAnswers: ['Wake Forest University', 'Wake Forest'],
    },
    {
      playerName: 'Klay Thompson',
      correctAnswers: ['Washington State University', 'Washington State', 'WSU'],
    },
    {
      playerName: 'Rudy Gobert',
      correctAnswers: ['None', 'Did not attend college in the USA'],
    },
    {
      playerName: 'Donovan Mitchell',
      correctAnswers: ['University of Louisville', 'Louisville'],
    },
    {
      playerName: 'Bam Adebayo',
      correctAnswers: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      playerName: 'Draymond Green',
      correctAnswers: ['Michigan State University', 'Michigan State', 'MSU'],
    },
    {
      playerName: 'Zach LaVine',
      correctAnswers: ['University of California Los Angeles', 'UCLA'],
    },
    {
      playerName: 'CJ McCollum',
      correctAnswers: ['Lehigh University', 'Lehigh'],
    },
    {
      playerName: "De'Aaron Fox",
      correctAnswers: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      playerName: 'Julius Randle',
      correctAnswers: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      playerName: 'Jayson Tatum',
      correctAnswers: ['Duke University', 'Duke'],
    },
    {
      playerName: 'Brandon Ingram',
      correctAnswers: ['Duke University', 'Duke'],
    },
    {
      playerName: 'Ja Morant',
      correctAnswers: ['Murray State University', 'Murray State'],
    },
    {
      playerName: 'Trae Young',
      correctAnswers: ['University of Oklahoma', 'Oklahoma', 'OU'],
    },
    {
      playerName: 'Pascal Siakam',
      correctAnswers: ['New Mexico State University', 'New Mexico State', 'NMSU'],
    },
    {
      playerName: 'Devin Booker',
      correctAnswers: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      playerName: 'Karl-Anthony Towns',
      correctAnswers: ['University of Kentucky', 'Kentucky', 'UK'],
    },
    {
      playerName: 'Ben Simmons',
      correctAnswers: ['Louisiana State University', 'LSU', 'Louisiana State'],
    },
    {
      playerName: 'Bradley Beal',
      correctAnswers: ['University of Florida', 'Florida', 'UF'],
    },
    {
      playerName: 'John Collins',
      correctAnswers: ['Wake Forest University', 'Wake Forest'],
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
