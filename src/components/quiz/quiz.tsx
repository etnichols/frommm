'use client'

import { useEffect, useReducer } from 'react'

import AutoCompleteInput from '../ui/autocomplete-input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

// Define action types
enum QuizAction {
  SET_ANSWER = 'SET_ANSWER',
  NEXT_QUESTION = 'NEXT_QUESTION',
  PREVIOUS_QUESTION = 'PREVIOUS_QUESTION',
  GRADE_QUIZ = 'GRADE_QUIZ',
  DISPLAY_RESULTS = 'DISPLAY_RESULTS',
}

enum QuizStep {
  QUESTIONS,
  GRADING,
  RESULTS,
}

interface QuizState {
  index: number
  inputValue: string
  answers: string[]
  step: QuizStep
}

// TODO: Grade quiz, show results, and submit answers.
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
    case QuizAction.GRADE_QUIZ:
      return {
        ...state,
        step: QuizStep.GRADING,
      }
    case QuizAction.DISPLAY_RESULTS:
      return {
        ...state,
        step: QuizStep.RESULTS,
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
    step: QuizStep.QUESTIONS,
  })

  useEffect(() => {
    if (state.step === QuizStep.GRADING) {
      // Grade quiz, save results, and display results.
      setTimeout(() => {
        dispatch({ type: QuizAction.DISPLAY_RESULTS })
      }, 30000)
    }
  }, [state.step])

  const { questions: rawQuestions } = quiz
  const questions = rawQuestions.slice(0, 5)

  const isFinalQuestion = state.index === questions.length - 1

  let content = (
    <>
      <QuizQuestion state={state} questions={questions} dispatch={dispatch} />
      <QuizNavigationControls state={state} questions={questions} dispatch={dispatch} />
      {isFinalQuestion && (
        <Button
          onClick={() => dispatch({ type: QuizAction.GRADE_QUIZ })}
          className="w-48 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400"
        >
          Grade Quiz
        </Button>
      )}
    </>
  )
  if (state.step === QuizStep.RESULTS) {
    content = (
      <div className="flex flex-col justify-center items-center gap-y-8">
        <div className="text-lg font-bold">Your results are ready!</div>
        <div>You got a 3/5</div>
        <div>Your answers</div>
        {state.answers.map((answer, index) => (
          <div key={index}>{answer}</div>
        ))}
        <div className="text-xs text-slate-500">Share this result</div>
      </div>
    )
  }

  if (state.step === QuizStep.GRADING) {
    content = (
      <div className="flex flex-col justify-center items-center gap-y-8">
        <div className="text-lg">Grading your quiz...</div>
        <Loader2 className="h-8 w-8 animate-spin"></Loader2>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-16 items-center justify-center">
      <div className="flex text-2xl font-bold text-center">{quiz.title}</div>
      {content}
    </div>
  )
}
const QuizQuestion = ({
  state,
  dispatch,
  questions,
}: {
  state: QuizState
  dispatch: any
  questions: any
}) => {
  const playerName = questions[state.index].name
  const currentAnswer = state.answers[state.index] || ''

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center w-full md:w-96">
      <div className="flex text-xl">{playerName}</div>
      <div className="text-xs text-slate-500">{`(${state.index + 1}/${questions.length})`}</div>
      <AutoCompleteInput
        inputValue={currentAnswer}
        setInputValue={(answer) => dispatch({ type: QuizAction.SET_ANSWER, payload: { answer } })}
      />
    </div>
  )
}

const QuizNavigationControls = ({
  state,
  dispatch,
  questions,
}: {
  state: QuizState
  dispatch: any
  questions: any
}) => {
  return (
    <div className="flex flex-row justify-between w-full px-8 lg:max-w-96">
      <Button
        disabled={state.index === 0}
        onClick={() => dispatch({ type: QuizAction.PREVIOUS_QUESTION })}
        className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 "
      >
        <LeftArrow />
        <div className="pl-2">Previous</div>
      </Button>
      <Button
        disabled={state.index === questions.length - 1}
        onClick={() => {
          dispatch({ type: QuizAction.NEXT_QUESTION })
        }}
        className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 "
      >
        <div className="pr-2">Next</div>
        <RightArrow />
      </Button>
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
