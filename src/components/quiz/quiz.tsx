'use client'

import AutoCompleteInput from '../ui/autocomplete-input'
import { Button } from '../ui/button'
import Quiz from '@/lib/mongo/schema/quiz'
import { useReducer } from 'react'

// Define action types
enum QuizAction {
  SET_ANSWER = 'SET_ANSWER',
  NEXT_QUESTION = 'NEXT_QUESTION',
  PREVIOUS_QUESTION = 'PREVIOUS_QUESTION',
}

interface QuizState {
  index: number
  inputValue: string
  answers: string[]
}

// Reducer function to manage quiz state
function quizReducer(state: QuizState, action: { type: QuizAction; payload?: any }) {
  switch (action.type) {
    case QuizAction.SET_ANSWER:
      const updatedAnswers = [...state.answers]
      updatedAnswers[state.index] = action.payload.answer
      return { ...state, answers: updatedAnswers }
    case QuizAction.NEXT_QUESTION:
      return {
        ...state,
        index: state.index + 1,
      }
    case QuizAction.PREVIOUS_QUESTION:
      return {
        ...state,
        index: state.index - 1,
      }
    default:
      return state
  }
}

export default function QuizComponent({ quiz }: { quiz: Quiz }) {
  const [state, dispatch] = useReducer(quizReducer, {
    index: 0,
    inputValue: '',
    answers: [],
  })

  const { questions } = quiz

  const playerName = questions[state.index].name
  const currentAnswer = state.answers[state.index] || ''

  return (
    <div className="flex flex-col gap-y-16 items-center justify-center">
      <div className="flex text-2xl font-bold text-center">{quiz.title}</div>
      <div className="flex flex-col gap-y-4 items-center justify-center w-full md:w-96">
        <div className="flex text-xl">{playerName}</div>
        <AutoCompleteInput
          inputValue={currentAnswer}
          setInputValue={(answer) => dispatch({ type: QuizAction.SET_ANSWER, payload: { answer } })}
        />
      </div>
      <div className="flex flex-row justify-between w-full px-8 lg:max-w-96">
        <Button
          disabled={state.index === 0}
          onClick={() => dispatch({ type: QuizAction.PREVIOUS_QUESTION })}
          className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <LeftArrow />
          <div className="pl-2">Previous</div>
        </Button>
        <Button
          disabled={state.index === questions.length - 1}
          onClick={() => {
            dispatch({ type: QuizAction.NEXT_QUESTION })
          }}
          className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <div className="pr-2">Next</div>
          <RightArrow />
        </Button>
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
