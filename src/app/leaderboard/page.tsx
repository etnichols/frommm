import { ComboboxItem } from '@/components/ui/combo-box'
import Leaderboard from '@/components/leaderboard/leaderboard'
import { Section } from '@/components/ui/section'

export default async function Home() {
  const { quizzes } = await fetchQuizzes()

  const comboxBoxItems: ComboboxItem[] = quizzes.map((quiz: any) => ({
    _id: quiz._id,
    value: quiz._id,
    label: quiz.title,
  }))

  return (
    <Section headline="Leaderboard">
      <Leaderboard items={comboxBoxItems} />
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
