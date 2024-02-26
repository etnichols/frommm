'use client'

import Quiz from '@/lib/mongo/schema/quiz'
import { useState } from 'react'

export default function Quiz({ quiz }: { quiz: Quiz }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const { questions } = quiz

  console.dir(questions)

  return (
    <div className="mt-8 flex flex-col gap-y-8 items-center justify-center mx-8 w-full px-4">
      <div className="text-2xl font-bold text-center">{quiz.title}</div>
      <div className="text-xl">{questions[index].playerName}</div>
      <input
        className="border rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 w-full"
        placeholder="Answer"
        label="Answer"
        type="text"
        onChange={(e) => setAnswers([...answers, e.target.value])}
      />
      <button
        onClick={() => {
          if (answers.length === questions[index].correctAnswers.length) {
            setIndex((index) => index + 1)
            setAnswers([])
          }
        }}
        className="flex w-48 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      />
    </div>
  )
}
