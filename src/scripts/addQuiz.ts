const Quiz = require('../lib/mongo/schema/quiz.ts')
const mongoose = require('mongoose')

const QUIZ_DATA = {
  title: 'The Original',
  slug: 'the-original',
  creator: 'Evan Nichols',
  createdAt: new Date(),
  updatedAt: new Date(),
  questions: [
    { name: 'Xavier Tillman (Grizzlies)', college: 'Michigan State University' },
    { name: 'Lamar Stevens (Cavs)', college: 'The Pennsylvania State University (Penn State)' },
    { name: 'Alex Len (Kings)', college: 'University of Maryland' },
    { name: 'Malik Beasley (Lakers)', college: 'Florida State University' },
    { name: 'Danny Green (Cavs)', college: 'University of North Carolina (UNC)' },
    { name: 'Lauri Markkanen', college: 'University of Arizona' },
    { name: 'Jabari Smith (Rockets)', college: 'Auburn University' },
    { name: 'Kelly Olynyk', college: 'Gonzaga University' },
    { name: 'Bobby Portis', college: 'University of Arkansas' },
    { name: 'Larry Nance Jr. (Pelicans)', college: 'University of Wyoming' },
    { name: 'Montrezl Harrell (76ers)', college: 'University of Louisville' },
    { name: 'Steven Adams (Grizzlies)', college: 'University of Pittsburgh (Pitt)' },
    { name: 'Kris Dunn (Timberwolves)', college: 'Providence College' },
    { name: 'CJ McCollum (Pelicans)', college: 'Lehigh University' },
    { name: 'Ben Simmons', college: 'Louisiana State University (LSU)' },
    { name: 'Juan Toscano-Anderson (Jazz)', college: 'Marquette University' },
    { name: 'Zach LaVine (Bulls)', college: 'UCLA' },
    { name: 'Damian Lillard (Trailblazers)', college: 'Weber State University' },
    { name: 'Jaylen Brown', college: 'University of California, Berkeley (Cal)' },
    { name: 'Cameron Payne (Suns)', college: 'Murray State University' },
    { name: 'Klay Thompson (Warriors)', college: 'Washington State University' },
    { name: 'Jrue Holiday (Bucks)', college: 'California State University, Los Angeles (UCLA)' },
    { name: 'Pascal Siakam (Raptors)', college: 'New Mexico State University' },
    { name: 'Landry Shamet (Suns)', college: 'Wichita State University' },
    { name: 'Andre Drummond (Pistons)', college: 'University of Connecticut (UConn)' },
    { name: 'Jalen Williams (Thunder)', college: 'Santa Clara University' },
    { name: 'Ziaire Williams (Grizzlies)', college: 'Stanford University' },
    { name: 'Malachi Flynn (Raptors)', college: 'San Diego State University (SDSU)' },
    { name: 'Troy Brown Jr. (Lakers)', college: 'University of Oregon' },
    { name: 'Elfrid Payton (Suns)', college: 'University of Louisiana at Lafayette' },
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
