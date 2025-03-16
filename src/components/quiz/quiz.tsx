'use client'

import { useEffect, useReducer } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

import { QuizType, type QuizQuestion } from '@/models/Quiz'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { SaveResultDialog } from './save-result-dialog'
import { AutoCompleteInput } from '../ui/autocomplete-input'
import { PageTitle } from '../ui/common'

// Define action types
enum QuizAction {
  SET_ANSWER = 'SET_ANSWER',
  NEXT_QUESTION = 'NEXT_QUESTION',
  PREVIOUS_QUESTION = 'PREVIOUS_QUESTION',
  GRADE_QUIZ = 'GRADE_QUIZ',
  DISPLAY_RESULTS = 'DISPLAY_RESULTS',
  SET_INPUT_VALUE = 'SET_INPUT_VALUE',
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

// TODO: Save answers to DB
function quizReducer(state: QuizState, action: { type: QuizAction; payload?: any }) {
  switch (action.type) {
    case QuizAction.SET_ANSWER:
      const updatedAnswers = [...state.answers]
      updatedAnswers[state.index] = action.payload.answer
      return { ...state, answers: updatedAnswers, inputValue: '' }
    case QuizAction.NEXT_QUESTION:
      return {
        ...state,
        index: state.index + 1,
        inputValue: '',
      }
    case QuizAction.PREVIOUS_QUESTION:
      return {
        ...state,
        index: state.index - 1,
        inputValue: '',
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
    case QuizAction.SET_INPUT_VALUE:
      return {
        ...state,
        inputValue: action.payload.inputValue,
      }
    default:
      return state
  }
}

export default function QuizComponent({
  quiz,
  origins,
  questions,
}: {
  quiz: any
  questions: any[]
  origins: any[]
}) {
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
      }, 2500)
    }
  }, [state.step])

  const isFinalQuestion = state.index === questions.length - 1

  let content = (
    <div className="flex flex-col gap-y-6 h-full">
      <QuizQuestion state={state} questions={questions} dispatch={dispatch} origins={origins} />
      <QuizNavigationControls state={state} questions={questions} dispatch={dispatch} />
      {isFinalQuestion && (
        <Button
          onClick={() => dispatch({ type: QuizAction.GRADE_QUIZ })}
          className="w-48 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400"
        >
          Grade Quiz
        </Button>
      )}
    </div>
  )
  if (state.step === QuizStep.RESULTS) {
    content = (
      <QuizResults
        state={state}
        dispatch={dispatch}
        questions={questions}
        answers={state.answers}
        quizId={quiz._id}
        slug={quiz.slug}
      />
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
    <div className="flex flex-col gap-y-6">
      <PageTitle>{quiz.title}</PageTitle>
      {quiz.description && (
        <div className="text-sm">
          <span className="font-bold">Note:</span> {quiz.description}
        </div>
      )}
      {content}
    </div>
  )
}

const QuizResults = ({
  state,
  dispatch,
  questions,
  answers: any,
  quizId,
  slug,
}: {
  state: QuizState
  dispatch: any
  questions: QuizQuestion[]
  answers: string[]
  quizId: string
  slug: string
}) => {
  const correctAnswerCount = questions
    .map((question, index) => {
      return question.college === state.answers[index]
    })
    .filter(Boolean).length

  const percentage = Math.floor((correctAnswerCount / questions.length) * 100)

  const saveQuizResult = async (initials: string) => {
    const quizResult = {
      answers: state.answers,
      quizId,
      score: correctAnswerCount,
      initials,
    }

    const saveQuizResultResponse = await fetch(`/api/quiz/${slug}`, {
      method: 'POST',
      body: JSON.stringify(quizResult),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const saveQuizResultJson = await saveQuizResultResponse.json()

    return saveQuizResultJson
  }

  return (
    <div className="flex flex-col justify-center items-center gap-y-8">
      <div className="text-lg font-bold tracking-wider">
        Result: {correctAnswerCount}/{questions.length} ({percentage}%)
      </div>
      <SaveResultDialog saveResultFn={saveQuizResult} />
      <Table className="text-xs">
        <TableCaption>Your Quiz Results</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Player</TableHead>
            <TableHead>Your Answer</TableHead>
            <TableHead>Correct Answer</TableHead>
            <TableHead className="text-right"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => {
            const isCorrect = question.college === state.answers[index]
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{question.name}</TableCell>
                <TableCell>{state.answers[index] || 'No answer'}</TableCell>
                <TableCell>{question.college}</TableCell>
                <TableCell className="text-right">{isCorrect ? '✅' : '❌'}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

const PLACEHOLDER_VALUE = { value: '', label: '' }
const QuizQuestion = ({
  state,
  dispatch,
  questions,
  origins,
}: {
  state: QuizState
  dispatch: any
  questions: any
  origins: any[]
}) => {
  const { inputValue, index, answers } = state

  const currentQuestion = questions[index]

  const playerName = currentQuestion.players.name
  const currentTeam = currentQuestion.players.team.team
  const currentAnswer = answers[index] || ''
  const currentValue = currentAnswer || inputValue

  return (
    <div className="flex flex-col gap-y-4 w-full h-[400px]">
      <div className="flex text-lg">{playerName}</div>
      <div className="flex text-sm">{currentTeam}</div>
      <AutoCompleteInput
        emptyMessage="No results found"
        value={currentValue ? { value: currentValue, label: currentValue } : undefined}
        options={origins.map((origin) => ({ value: origin.id, label: origin.name, id: origin.id }))}
        resetKey={index}
        onValueChange={(option) => {
          dispatch({ type: QuizAction.SET_INPUT_VALUE, payload: { inputValue: option.value } })
          dispatch({ type: QuizAction.SET_ANSWER, payload: { answer: option.value } })
        }}
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
    <div className="flex flex-row justify-between items-center w-full px-8 lg:max-w-96">
      <Button
        variant="outline"
        disabled={state.index === 0}
        onClick={() => dispatch({ type: QuizAction.PREVIOUS_QUESTION })}
        className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 "
      >
        <div className="pl-2">← Previous</div>
      </Button>
      <div className="text-xs text-slate-500">{`(${state.index + 1}/${questions.length})`}</div>
      <Button
        variant="outline"
        disabled={state.index === questions.length - 1}
        onClick={() => {
          dispatch({ type: QuizAction.NEXT_QUESTION })
        }}
        className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 "
      >
        <div className="pr-2">Next →</div>
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
