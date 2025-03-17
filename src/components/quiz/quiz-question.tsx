'use client'

import { QuizAction, QuizState } from '@/lib/hooks/use-quiz'

import { AutoCompleteInput } from '../ui/autocomplete-input'
import { AutoCompleteValues } from '@/lib/data/autocomplete-values'
import { Button } from '../ui/button'
import { QuizQuestion as QuizQuestionType } from '@/types/quiz'

export function QuizQuestion({
  state,
  dispatch,
  questions,
}: {
  state: QuizState
  dispatch: any
  questions: QuizQuestionType[]
}) {
  const { index, answers } = state

  const currentQuestion: QuizQuestionType = questions[index]

  const playerName = currentQuestion.players.name
  const team = currentQuestion.players.team?.team || 'Unsigned/Retired'
  const currentAnswer = answers[index] || undefined

  const isFinalQuestion = state.index === questions.length - 1

  return (
    <div className="flex flex-col gap-y-8 w-full">
      <div className="flex flex-col gap-y-2 items-center">
        <div className="flex text-lg">{playerName}</div>
        <div className="flex text-sm">{team}</div>
      </div>
      <AutoCompleteInput
        value={currentAnswer}
        emptyMessage="No results found"
        options={AutoCompleteValues}
        resetKey={index}
        onValueChange={(option) => {
          dispatch({ type: QuizAction.SET_ANSWER, payload: option })
        }}
      />
      <div className="flex flex-row justify-between items-center w-full px-8 lg:max-w-96">
        <Button
          variant="outline"
          disabled={state.index === 0}
          onClick={() => dispatch({ type: QuizAction.PREVIOUS_QUESTION })}
          className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 "
        >
          <div className="pl-2">← Prev</div>
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
      <div className="flex flex-col gap-y-2 items-center">
        {isFinalQuestion && (
          <Button
            onClick={() => dispatch({ type: QuizAction.GRADE_QUIZ })}
            className="w-48 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-emerald-500 hover:bg-emerald-600"
          >
            Grade Quiz
          </Button>
        )}
      </div>
    </div>
  )
}
