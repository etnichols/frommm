import { Combobox } from '@/components/ui/combo-box'
import { Section } from '@/components/ui/section'

export default async function Home() {
  const quizzes = await fetchQuizzes()

  const actualQuizzes = quizzes.quizzes.map((quiz) => ({
    _id: quiz._id,
    value: quiz._id,
    label: quiz.title,
  }))

  return (
    <Section headline="Leaderboard">
      <Combobox items={actualQuizzes} />
      <div>Not yet implemented. Come back soon!</div>
    </Section>
  )
}

async function fetchQuizzes() {
  try {
    const apiResponse = await fetch(`${process.env.BASE_URL}/api/quizzes`, {
      cache: 'no-cache',
    })

    if (!apiResponse.ok) {
      console.log('Error fetching quiz', apiResponse)
      return null
    }

    const quizJson = apiResponse.json()
    return quizJson
  } catch (e) {
    console.log('Error fetching quiz', e)
    return null
  }
}
