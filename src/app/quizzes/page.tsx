'use client'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const quizData = [
    {
      slug: '/quiz/test-quiz',
      name: 'Test Quiz ™',
      description:
        'If Evan sent you this link to test out the app, use this quiz. It is only five questions long.',
    },
    {
      slug: '/quiz/the-original',
      name: 'The Original ™',
      description:
        'Thirty questions of increasing difficulty. Note: intentionally excludes Big 12 players.',
    },
    // {
    //   slug: 'old-school',
    //   name: 'Old School',
    //   description: 'Players drafted before 1990.',
    // },
    {
      slug: '/quiz/random',
      name: 'Random',
      description:
        'Randomly generated quiz featuring active NBA players only. 30 questions of varying difficulty.',
    },
    {
      slug: '/quiz/create',
      name: 'Create your own',
      description: 'Create your own quiz, and share it with friends.',
    },
  ]
  return (
    <div className="flex flex-col gap-8 md:items-center w-full">
      <div className="flex flex-col justify-center items-center md:w-4/12 w-full">
        <div className="flex flex-col gap-y-4 w-full items-center">
          {quizData.map((quiz) => (
            <Card
              key={quiz.slug}
              className="flex flex-col justify-center items-center w-full gap-y-2"
            >
              <CardHeader className="flex gap-y-2 justify-center items-center">
                <CardTitle>{quiz.name}</CardTitle>
                <CardDescription className="text-center leading-loose">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <CardFooter>
                  <Link key={quiz.slug} href={`${quiz.slug}`}>
                    <Button className="bg-emerald-500 w-full tracking-wide hover:bg-emerald-600">
                      Take this quiz
                    </Button>
                  </Link>
                </CardFooter>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
