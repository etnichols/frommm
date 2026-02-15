import { useCallback, useReducer } from 'react'

import type { Origin } from '@/lib/server/origins'
import type { QuizQuestion } from '@/types/quiz'

export enum RandomQuizStep {
  PLAYING = 'PLAYING',
  FEEDBACK = 'FEEDBACK',
  STOPPED = 'STOPPED',
}

export interface RandomQuizState {
  /** The current player being shown */
  currentQuestion: QuizQuestion | null
  /** All players in the current batch (queue) */
  batch: QuizQuestion[]
  /** Index within the current batch */
  batchIndex: number
  /** Current step (playing, showing feedback, or stopped) */
  step: RandomQuizStep
  /** The user's latest answer */
  currentAnswer: Origin | null
  /** Whether the latest answer was correct */
  lastAnswerCorrect: boolean | null
  /** Current streak of consecutive correct answers */
  streak: number
  /** Best streak achieved this session */
  bestStreak: number
  /** Total correct answers */
  totalCorrect: number
  /** Total questions answered */
  totalAnswered: number
  /** Full history of questions and answers for the results page */
  history: { question: QuizQuestion; answer: Origin | null }[]
  /** Whether we're loading a new batch */
  isLoadingBatch: boolean
  /** Input value for the autocomplete */
  inputValue: string
}

export enum RandomQuizAction {
  SET_BATCH = 'SET_BATCH',
  SUBMIT_ANSWER = 'SUBMIT_ANSWER',
  NEXT_PLAYER = 'NEXT_PLAYER',
  STOP = 'STOP',
  SET_LOADING = 'SET_LOADING',
  SET_INPUT_VALUE = 'SET_INPUT_VALUE',
}

type Action =
  | { type: RandomQuizAction.SET_BATCH; payload: QuizQuestion[] }
  | { type: RandomQuizAction.SUBMIT_ANSWER; payload: Origin | null }
  | { type: RandomQuizAction.NEXT_PLAYER }
  | { type: RandomQuizAction.STOP }
  | { type: RandomQuizAction.SET_LOADING; payload: boolean }
  | { type: RandomQuizAction.SET_INPUT_VALUE; payload: string }

function randomQuizReducer(state: RandomQuizState, action: Action): RandomQuizState {
  switch (action.type) {
    case RandomQuizAction.SET_BATCH: {
      const newBatch = action.payload
      return {
        ...state,
        batch: newBatch,
        batchIndex: 0,
        currentQuestion: newBatch[0] || null,
        isLoadingBatch: false,
        step: RandomQuizStep.PLAYING,
      }
    }
    case RandomQuizAction.SUBMIT_ANSWER: {
      const answer = action.payload
      const isCorrect =
        answer !== null &&
        state.currentQuestion !== null &&
        state.currentQuestion.players.origin.id === Number(answer.id)

      const newStreak = isCorrect ? state.streak + 1 : 0
      const newBestStreak = Math.max(state.bestStreak, newStreak)

      return {
        ...state,
        currentAnswer: answer,
        lastAnswerCorrect: isCorrect,
        streak: newStreak,
        bestStreak: newBestStreak,
        totalCorrect: state.totalCorrect + (isCorrect ? 1 : 0),
        totalAnswered: state.totalAnswered + 1,
        step: RandomQuizStep.FEEDBACK,
        history: state.currentQuestion
          ? [...state.history, { question: state.currentQuestion, answer }]
          : state.history,
      }
    }
    case RandomQuizAction.NEXT_PLAYER: {
      const nextIndex = state.batchIndex + 1
      // If we've exhausted the batch, signal that we need more
      if (nextIndex >= state.batch.length) {
        return {
          ...state,
          batchIndex: nextIndex,
          currentQuestion: null,
          currentAnswer: null,
          lastAnswerCorrect: null,
          step: RandomQuizStep.PLAYING,
          isLoadingBatch: true,
          inputValue: '',
        }
      }
      return {
        ...state,
        batchIndex: nextIndex,
        currentQuestion: state.batch[nextIndex],
        currentAnswer: null,
        lastAnswerCorrect: null,
        step: RandomQuizStep.PLAYING,
        inputValue: '',
      }
    }
    case RandomQuizAction.STOP: {
      // If currently playing (no answer submitted yet), just stop
      // If in feedback mode, the answer is already in history
      if (state.step === RandomQuizStep.PLAYING && state.currentQuestion) {
        // Record a skip for the current unanswered question
        return {
          ...state,
          step: RandomQuizStep.STOPPED,
        }
      }
      return {
        ...state,
        step: RandomQuizStep.STOPPED,
      }
    }
    case RandomQuizAction.SET_LOADING: {
      return {
        ...state,
        isLoadingBatch: action.payload,
      }
    }
    case RandomQuizAction.SET_INPUT_VALUE: {
      return {
        ...state,
        inputValue: action.payload,
      }
    }
    default:
      return state
  }
}

const initialState: RandomQuizState = {
  currentQuestion: null,
  batch: [],
  batchIndex: 0,
  step: RandomQuizStep.PLAYING,
  currentAnswer: null,
  lastAnswerCorrect: null,
  streak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  history: [],
  isLoadingBatch: true,
  inputValue: '',
}

export function useRandomQuiz() {
  const [state, dispatch] = useReducer(randomQuizReducer, initialState)

  const submitAnswer = useCallback(
    (answer: Origin) => {
      dispatch({ type: RandomQuizAction.SUBMIT_ANSWER, payload: answer })
    },
    [],
  )

  const nextPlayer = useCallback(() => {
    dispatch({ type: RandomQuizAction.NEXT_PLAYER })
  }, [])

  const stop = useCallback(() => {
    dispatch({ type: RandomQuizAction.STOP })
  }, [])

  const loadBatch = useCallback(
    (players: QuizQuestion[]) => {
      dispatch({ type: RandomQuizAction.SET_BATCH, payload: players })
    },
    [],
  )

  return { state, dispatch, submitAnswer, nextPlayer, stop, loadBatch }
}
