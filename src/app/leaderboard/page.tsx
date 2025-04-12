import { ComboboxItem } from '@/components/ui/combo-box'
import Leaderboard from '@/components/leaderboard'
import { PageTitle } from '@/components/ui/common'
import { getAvailableQuizzes } from '@/lib/server/quizzes'

export default async function Home() {
  const quizzes = await getAvailableQuizzes()

  const comboxBoxItems: ComboboxItem[] = quizzes.map((quiz: any) => ({
    _id: quiz._id,
    value: quiz._id,
    label: quiz.title,
  }))

  return (
    <div className="flex flex-col gap-y-6 items-center">
      <PageTitle>Leaderboard</PageTitle>
      {/* <Leaderboard items={comboxBoxItems} /> */}
      <div className="flex flex-col gap-y-6 items-center">🚧 Under Construction 🚧</div>
    </div>
  )
}
