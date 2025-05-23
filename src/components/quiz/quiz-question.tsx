'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { QuizAction, QuizState } from '@/lib/hooks/use-quiz'

import { Button } from '../ui/button'
import { OriginsAutocomplete } from '../ui/origins-autocomplete'
import { QuizQuestion as QuizQuestionType } from '@/types/quiz'
import { TeamIcon } from '../logos/team-icon'
import { useRef } from 'react'

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
  const inputRef = useRef<HTMLInputElement>(null)

  const currentQuestion: QuizQuestionType = questions[index]

  const playerName = currentQuestion.players.name
  const hint = currentQuestion.hint
  const team = currentQuestion.players.team || 'Unsigned/Retired'
  const currentAnswer = answers[index] || undefined

  const isFinalQuestion = state.index === questions.length - 1

  const IconComponent = TeamIcon.get(team.id)

  return (
    <div>
      <div className="flex flex-col gap-y-8 w-full items-center">
        <div className="flex flex-col gap-y-2 items-center">
          <div className="flex text-lg">{playerName}</div>
          {IconComponent && <IconComponent size={60} />}
          <div className="flex text-sm">{team.team}</div>
        </div>
        <OriginsAutocomplete
          ref={inputRef}
          value={currentAnswer}
          emptyMessage="No results found"
          resetKey={index}
          placeholder="Search for origin..."
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
              setTimeout(() => {
                inputRef.current?.focus()
              }, 0)
            }}
            className="min-w-24 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 "
          >
            <div className="pr-2">Next →</div>
          </Button>
        </div>
        {hint && (
          <Accordion type="single" collapsible className="w-32 mb-4">
            <AccordionItem value="hint" className="border-none">
              <AccordionTrigger className="py-2 text-sm text-gray-500">
                <span>Show Hint</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-500">{hint}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
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
      <Accordion type="single" collapsible className="p-4">
        <AccordionItem value="notes">
          <AccordionTrigger className="text-base">How to answer</AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-y-2 text-sm">
              <li>For international players, enter their country of origin</li>
              <li>
                For players who have played for multiple college teams, enter the team they played
                for most recently before turning pro
              </li>
              <li>
                You can search for colleges by common acronyms, e.g. Texas Christian University{' '}
                {`->`} TCU
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
