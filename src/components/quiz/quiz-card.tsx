'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Quiz } from '@/types/quiz'
import { useRouter } from 'next/navigation'

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const router = useRouter()
  const { title, description, slug } = quiz

  return (
    <Card className="border border-gray-300 border-solid">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <p>{description}</p>
        <Button className="mt-4 w-48" onClick={() => router.push(`/quiz/${slug}`)}>
          Take Quiz →
        </Button>
      </CardContent>
    </Card>
  )
}
