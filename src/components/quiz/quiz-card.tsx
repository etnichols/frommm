import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function QuizCard(props: { title: string; description: string[]; slug: string }) {
  const router = useRouter()
  const { title, description, slug } = props

  return (
    <Card className="border border-gray-300 border-solid">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        {description.map((desc) => (
          <p key={desc}>{desc}</p>
        ))}
        <Button className="mt-4 w-48" onClick={() => router.push(slug)}>
          Take Quiz →
        </Button>
      </CardContent>
    </Card>
  )
}
