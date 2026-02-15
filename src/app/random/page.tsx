'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { OriginsAutocomplete } from '@/components/ui/origins-autocomplete'
import { PageTitle } from '@/components/ui/common'
import { TeamIcon } from '@/components/logos/team-icon'
import type { QuizQuestion } from '@/types/quiz'
import type { Origin } from '@/lib/server/origins'
import { getRandomPlayers, type RandomPlayer } from '@/lib/server/players'
import {
  useRandomQuiz,
  RandomQuizStep,
} from '@/lib/hooks/use-random-quiz'
import { RandomQuizResults } from '@/components/quiz/random-quiz-results'

/**
 * Transform raw player data from the server into QuizQuestion shape
 * so we can reuse existing quiz components and types.
 */
function playersToQuizQuestions(players: RandomPlayer[]): QuizQuestion[] {
  return players.map((player, index) => ({
    id: player.id,
    player_id: player.id,
    order_index: index,
    hint: undefined,
    players: {
      id: player.id,
      name: player.name,
      origin: player.origin,
      team: player.team,
    },
  }))
}

export default function RandomQuizPage() {
  const { state, dispatch, submitAnswer, nextPlayer, stop, loadBatch } = useRandomQuiz()
  const inputRef = useRef<HTMLInputElement>(null)
  const fetchingRef = useRef(false)

  const fetchBatch = useCallback(async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    try {
      const result = await getRandomPlayers(10)
      if (result.success && result.players.length > 0) {
        const questions = playersToQuizQuestions(result.players)
        loadBatch(questions)
      }
    } catch (error) {
      console.error('Failed to fetch random players:', error)
    } finally {
      fetchingRef.current = false
    }
  }, [loadBatch])

  // Fetch initial batch and subsequent batches when needed
  useEffect(() => {
    if (state.isLoadingBatch && state.step !== RandomQuizStep.STOPPED) {
      fetchBatch()
    }
  }, [state.isLoadingBatch, state.step, fetchBatch])

  // Results screen
  if (state.step === RandomQuizStep.STOPPED) {
    return (
      <div className="mt-4 flex flex-col gap-y-6 flex-grow">
        <PageTitle>Random Mode — Results</PageTitle>
        <RandomQuizResults state={state} />
      </div>
    )
  }

  // Loading state
  if (state.isLoadingBatch || !state.currentQuestion) {
    return (
      <div className="mt-4 flex flex-col gap-y-6 flex-grow">
        <PageTitle>Random Mode</PageTitle>
        <div className="flex flex-col justify-center items-center gap-y-6 mt-8">
          <Loader2 className="size-6 text-orange-500 animate-spin" />
          <div className="text-sm">Loading players...</div>
        </div>
      </div>
    )
  }

  const { currentQuestion, streak, bestStreak, totalCorrect, totalAnswered } = state
  const playerName = currentQuestion.players.name
  const team = currentQuestion.players.team
  const IconComponent = TeamIcon.get(team.id)

  // Feedback screen — show whether the answer was correct
  if (state.step === RandomQuizStep.FEEDBACK) {
    const isCorrect = state.lastAnswerCorrect
    const correctOrigin = currentQuestion.players.origin.name

    return (
      <div className="mt-4 flex flex-col gap-y-6 flex-grow">
        <PageTitle>Random Mode</PageTitle>
        <StatsBar
          streak={streak}
          bestStreak={bestStreak}
          totalCorrect={totalCorrect}
          totalAnswered={totalAnswered}
        />
        <div className="flex flex-col gap-y-6 w-full items-center">
          <div className="flex flex-col gap-y-2 items-center">
            <div className="flex text-lg">{playerName}</div>
            {IconComponent && <IconComponent size={60} />}
            <div className="flex text-sm">{team.team}</div>
          </div>

          <div
            className={`flex flex-col items-center gap-y-2 p-4 rounded-lg border-2 ${
              isCorrect
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-red-400 bg-red-50'
            }`}
          >
            <div className={`text-lg font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            {!isCorrect && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Your answer:</span>{' '}
                {state.currentAnswer?.name || 'No answer'}
              </div>
            )}
            <div className="text-sm text-gray-600">
              <span className="font-medium">Correct answer:</span> {correctOrigin}
            </div>
          </div>

          <div className="flex flex-row gap-x-4">
            <Button
              variant="outline"
              onClick={() => {
                nextPlayer()
                setTimeout(() => inputRef.current?.focus(), 0)
              }}
              className="min-w-32"
            >
              Next Player →
            </Button>
            <Button
              variant="outline"
              onClick={stop}
              className="min-w-24 border-red-300 text-red-600 hover:bg-red-50"
            >
              Stop
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Playing screen — show the question
  return (
    <div className="mt-4 flex flex-col gap-y-6 flex-grow">
      <PageTitle>Random Mode</PageTitle>
      <StatsBar
        streak={streak}
        bestStreak={bestStreak}
        totalCorrect={totalCorrect}
        totalAnswered={totalAnswered}
      />
      <div className="flex flex-col gap-y-8 w-full items-center">
        <div className="flex flex-col gap-y-2 items-center">
          <div className="flex text-lg">{playerName}</div>
          {IconComponent && <IconComponent size={60} />}
          <div className="flex text-sm">{team.team}</div>
        </div>
        <OriginsAutocomplete
          ref={inputRef}
          emptyMessage="No results found"
          resetKey={`${currentQuestion.id}-${state.batchIndex}`}
          placeholder="Search for origin..."
          onValueChange={(option) => {
            submitAnswer(option)
          }}
        />
        <div className="flex flex-row gap-x-4">
          <Button
            variant="outline"
            onClick={() => {
              // Skip — submit null answer
              submitAnswer(null as unknown as Origin)
            }}
            className="min-w-24"
          >
            Skip
          </Button>
          <Button
            variant="outline"
            onClick={stop}
            className="min-w-24 border-red-300 text-red-600 hover:bg-red-50"
          >
            Stop
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatsBar({
  streak,
  bestStreak,
  totalCorrect,
  totalAnswered,
}: {
  streak: number
  bestStreak: number
  totalCorrect: number
  totalAnswered: number
}) {
  const percentage = totalAnswered > 0 ? Math.floor((totalCorrect / totalAnswered) * 100) : 0

  return (
    <div className="flex flex-row justify-center gap-x-6 text-sm">
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Streak</span>
        <span className="text-lg font-bold text-orange-500">{streak}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Best</span>
        <span className="text-lg font-bold text-emerald-500">{bestStreak}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Score</span>
        <span className="text-lg font-bold">
          {totalCorrect}/{totalAnswered}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Accuracy</span>
        <span className="text-lg font-bold">{percentage}%</span>
      </div>
    </div>
  )
}
