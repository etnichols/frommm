import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export function QuizCard(props: { title: string; description: string[]; slug: string }) {
  const router = useRouter()
  const { title, description, slug } = props

  return (
    <Card mode="left" title={title}>
      <div className="flex flex-col gap-y-3">
        {description.map((desc) => (
          <p key={desc}>{desc}</p>
        ))}
      </div>
      <br />
      <Button className="w-48" onClick={() => router.push(slug)}>
        Take Quiz
      </Button>
    </Card>
  )
}
