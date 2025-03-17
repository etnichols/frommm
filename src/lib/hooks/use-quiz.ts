import { useEffect, useReducer } from 'react'

import { QuizQuestion } from '@/types/quiz'

export enum QuizAction {
  SET_ANSWER = 'SET_ANSWER',
  NEXT_QUESTION = 'NEXT_QUESTION',
  PREVIOUS_QUESTION = 'PREVIOUS_QUESTION',
  GRADE_QUIZ = 'GRADE_QUIZ',
  DISPLAY_RESULTS = 'DISPLAY_RESULTS',
  SET_INPUT_VALUE = 'SET_INPUT_VALUE',
}

export enum QuizStep {
  QUESTIONS,
  GRADING,
  RESULTS,
}

export interface QuizState {
  index: number
  inputValue: string
  answers: number[]
  step: QuizStep
  questions: QuizQuestion[]
}

function quizReducer(state: QuizState, action: { type: QuizAction; payload?: any }) {
  switch (action.type) {
    case QuizAction.SET_ANSWER:
      const updatedAnswers = [...state.answers]
      updatedAnswers[state.index] = Number(action.payload.answer.id)
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

export function useQuiz(questions: any[]) {
  const [state, dispatch] = useReducer(quizReducer, {
    index: 0,
    inputValue: '',
    answers: [],
    step: QuizStep.QUESTIONS,
    questions,
  })

  useEffect(() => {
    if (state.step === QuizStep.GRADING) {
      // Grade quiz, save results, and display results.
      setTimeout(() => {
        dispatch({ type: QuizAction.DISPLAY_RESULTS })
      }, 2500)
    }
  }, [state.step, dispatch])

  return { state, dispatch }
}
