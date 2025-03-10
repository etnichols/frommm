import { ComboboxItem } from '@/components/ui/combo-box'
import Leaderboard from '@/components/leaderboard/leaderboard'
import { PageTitle } from '@/components/ui/common'

export default async function Home() {
  const { quizzes } = await fetchQuizzes()

  const comboxBoxItems: ComboboxItem[] = quizzes.map((quiz: any) => ({
    _id: quiz._id,
    value: quiz._id,
    label: quiz.title,
  }))

  return (
    <div className="flex flex-col gap-y-6">
      <PageTitle>Leaderboard</PageTitle>
      <Leaderboard items={comboxBoxItems} />
    </div>
  )
}

async function fetchQuizzes() {
  try {
    const apiResponse = await fetch(`${process.env.BASE_URL}/api/quizzes`, {
      cache: 'no-cache',
    })

    if (!apiResponse.ok) {
      console.log('Error fetching quizzes', apiResponse)
      return { quizzes: [] }
    }

    const quizJson = apiResponse.json()
    return quizJson
  } catch (e) {
    console.log('Error fetching quiz', e)
    return { quizzes: [] }
  }
}
