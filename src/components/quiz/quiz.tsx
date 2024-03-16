'use client'

import Quiz from '@/lib/mongo/schema/quiz'
import { useState } from 'react'
import { Button } from '../ui/button'
import AutoCompleteInput from './autocomplete-input'

export default function Quiz({ quiz }: { quiz: Quiz }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const { questions } = quiz

  return (
    <div className="flex flex-col gap-y-16 items-center justify-center">
      <div className="text-2xl font-bold text-center">{quiz.title}</div>
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <div className="text-xl">{questions[index].playerName}</div>
        <AutoCompleteInput />
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex">
          <Button
            onClick={() => {
              if (answers.length === questions[index].correctAnswers.length) {
                setIndex((index) => index + 1)
                setAnswers([])
              }
            }}
            className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <LeftArrow />
            <div className="pl-2">Previous</div>
          </Button>
        </div>
        <div className="flex">
          <Button
            onClick={() => {
              if (answers.length === questions[index].correctAnswers.length) {
                setIndex((index) => index + 1)
                setAnswers([])
              }
            }}
            className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <div className="pr-2">Next</div>
            <RightArrow />
          </Button>
        </div>
      </div>
    </div>
  )
}

const LeftArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </svg>
)

const RightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
)
