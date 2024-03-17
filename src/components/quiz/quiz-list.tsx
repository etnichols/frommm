'use client'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QuizListProps {
  quizData: {
    slug: string
    name: string
    description: string
  }[]
}

export default function QuizList({ quizData }: QuizListProps) {
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
