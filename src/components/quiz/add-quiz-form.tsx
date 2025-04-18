'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AutoCompleteInput, Option } from '@/components/ui/autocomplete-input'
import { QuizQuestion as DBQuizQuestion, Quiz } from '@/types/quiz'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createQuiz, updateQuiz } from '@/lib/server/quizzes'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '../ui/text-area'
import { createClient } from '@/lib/supabase/client'

interface QuizQuestion {
  id?: number
  playerId: number | null
  orderIndex: number
  hint: string
  difficulty: number
  points: number
}

interface QuizFormData {
  id?: number
  title: string
  slug: string
  description: string
  difficulty: number
  isPublished: boolean
  questions: QuizQuestion[]
}

interface QuizFormProps {
  initialData?: {
    quiz: Quiz
    questions: (DBQuizQuestion & {
      difficulty?: number
      points?: number
    })[]
  }
  onSuccess?: (quizId: number, isEdit: boolean) => void
}

type Player = Option

const difficultyOptions = [
  { value: '1', label: 'Easy' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'Hard' },
]

// Memoized Question Entry Component
const QuestionEntry = React.memo(
  ({
    question,
    index,
    players,
    onUpdate,
    onRemove,
    isRemovable,
    shouldFocus,
  }: {
    question: QuizQuestion
    index: number
    players: Player[]
    onUpdate: (index: number, field: keyof QuizQuestion, value: string | number | null) => void
    onRemove: (index: number) => void
    isRemovable: boolean
    shouldFocus?: boolean
  }) => {
    const handleHintChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(index, 'hint', e.target.value)
      },
      [index, onUpdate],
    )

    const handlePlayerChange = useCallback(
      (player: Option | null) => {
        onUpdate(index, 'playerId', player ? parseInt(player.value) : null)
      },
      [index, onUpdate],
    )

    const handleDifficultyChange = useCallback(
      (difficulty: Option | null) => {
        onUpdate(index, 'difficulty', difficulty ? parseInt(difficulty.value) : 1)
      },
      [index, onUpdate],
    )

    const handlePointsChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1
        onUpdate(index, 'points', value)
      },
      [index, onUpdate],
    )

    return (
      <div className="space-y-2 p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Question {index + 1}</h3>
          {isRemovable && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-600"
              aria-label={`Remove question ${index + 1}`}
            >
              Remove
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`player-${index}`}>Player</Label>
          <AutoCompleteInput
            value={players.find((p) => p.value === question.playerId?.toString())}
            options={players}
            emptyMessage="No players found"
            onValueChange={handlePlayerChange}
            aria-required="true"
            aria-label="Select player for question"
          />
        </div>

        <Accordion type="single" collapsible className="w-full border rounded-md">
          <AccordionItem value="hint" className="border-none">
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <span className="text-sm font-medium">Hint</span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <Input
                id={`hint-${index}`}
                value={question.hint}
                onChange={handleHintChange}
                placeholder="Enter hint for the player"
                required
                autoFocus={shouldFocus}
                aria-label="Hint for the question"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`difficulty-${index}`}>Difficulty</Label>
            <AutoCompleteInput
              value={difficultyOptions.find((d) => d.value === question.difficulty.toString())}
              options={difficultyOptions}
              emptyMessage="No difficulty options found"
              onValueChange={handleDifficultyChange}
              aria-label="Question difficulty"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`points-${index}`}>Points</Label>
            <Input
              id={`points-${index}`}
              type="number"
              min="1"
              value={question.points}
              onChange={handlePointsChange}
              aria-label="Points for correct answer"
            />
          </div>
        </div>
      </div>
    )
  },
)

QuestionEntry.displayName = 'QuestionEntry'

export function QuizForm({ initialData, onSuccess }: QuizFormProps) {
  const isEditMode = !!initialData

  const [formData, setFormData] = useState<QuizFormData>(() => {
    if (initialData) {
      return {
        id: initialData.quiz.id,
        title: initialData.quiz.title || '',
        slug: initialData.quiz.slug || '',
        description: initialData.quiz.description || '',
        difficulty: initialData.quiz.difficulty || 1,
        isPublished: initialData.quiz.is_published || false,
        questions: initialData.questions.map((q) => ({
          id: q.id,
          playerId: q.player_id,
          orderIndex: q.order_index || 0,
          hint: q.hint || '',
          difficulty: q.difficulty || 1,
          points: q.points || 1,
        })),
      }
    }

    return {
      title: '',
      slug: '',
      description: '',
      difficulty: 1,
      isPublished: false,
      questions: [
        {
          playerId: null,
          orderIndex: 0,
          hint: '',
          difficulty: 1,
          points: 1,
        },
      ],
    }
  })

  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null)

  const supabase = createClient()

  // Memoize the players data to prevent unnecessary re-renders
  const memoizedPlayers = useMemo(() => players, [players])

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }, [])

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value
      setFormData((prev) => ({
        ...prev,
        title,
        slug: generateSlug(title),
      }))
    },
    [generateSlug],
  )

  const addQuestionEntry = useCallback(() => {
    setFormData((prev) => {
      const newIndex = prev.questions.length
      setLastAddedIndex(newIndex)
      return {
        ...prev,
        questions: [
          ...prev.questions,
          {
            playerId: null,
            orderIndex: newIndex,
            hint: '',
            difficulty: 1,
            points: 1,
          },
        ],
      }
    })
  }, [])

  // Fetch players on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase.from('players').select('id, name')

        if (error) throw error

        setPlayers(
          data.map((player) => ({
            value: player.id.toString(),
            label: player.name || 'Unknown Player',
          })),
        )
      } catch (error) {
        setError('Failed to load players')
      }
    }

    fetchPlayers()
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        if (!formData.title.trim()) {
          setError('Quiz title is required')
          setIsLoading(false)
          return
        }

        // Filter and prepare valid questions
        const validQuestions = formData.questions
          .filter((question) => question.playerId !== null && question.hint.trim())
          .map((question) => ({
            id: question.id,
            playerId: question.playerId,
            hint: question.hint,
            difficulty: question.difficulty,
            points: question.points,
            orderIndex: question.orderIndex,
          }))

        let result

        if (isEditMode && formData.id) {
          // Update existing quiz
          result = await updateQuiz(formData.id, {
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            difficulty: formData.difficulty,
            isPublished: formData.isPublished,
            questions: validQuestions,
          })
        } else {
          // Create new quiz
          result = await createQuiz({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            difficulty: formData.difficulty,
            isPublished: formData.isPublished,
            questions: validQuestions,
          })
        }

        if (!result.success) {
          throw new Error(result.error)
        }

        setSuccess(isEditMode ? 'Quiz updated successfully!' : 'Quiz created successfully!')

        if (onSuccess) {
          onSuccess(result.quizId, isEditMode)
        } else {
          // Only reset the form if we're not redirecting
          if (!isEditMode) {
            setFormData({
              title: '',
              slug: '',
              description: '',
              difficulty: 1,
              isPublished: false,
              questions: [
                {
                  playerId: null,
                  orderIndex: 0,
                  hint: '',
                  difficulty: 1,
                  points: 1,
                },
              ],
            })
          }

          // Clear success message after a delay
          setTimeout(() => {
            setSuccess(null)
          }, 3000)
        }
      } catch (error: any) {
        setError(
          `Failed to ${isEditMode ? 'update' : 'create'} quiz: ${error.message || 'Unknown error'}`,
        )
      } finally {
        setIsLoading(false)
      }
    },
    [formData, isEditMode, onSuccess],
  )

  const removeQuestionEntry = useCallback((index: number) => {
    setFormData((prev) => {
      const newQuestions = prev.questions
        .filter((_, i) => i !== index)
        .map((q, i) => ({
          ...q,
          orderIndex: i,
        }))
      return {
        ...prev,
        questions: newQuestions,
      }
    })
  }, [])

  const updateQuestionEntry = useCallback(
    (index: number, field: keyof QuizQuestion, value: string | number | null) => {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.map((question, i) =>
          i === index ? { ...question, [field]: value } : question,
        ),
      }))
    },
    [],
  )

  const handleDifficultyChange = useCallback((difficulty: Option | null) => {
    setFormData((prev) => ({
      ...prev,
      difficulty: difficulty ? parseInt(difficulty.value) : 1,
    }))
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="text-xl font-medium">Quiz Details</h2>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Enter quiz title"
            required
            aria-label="Quiz title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="url-friendly-slug"
            required
            aria-label="URL slug for the quiz"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Enter quiz description"
            rows={3}
            aria-label="Quiz description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Overall Difficulty</Label>
            <AutoCompleteInput
              emptyMessage="Select difficulty"
              value={difficultyOptions.find((d) => d.value === formData.difficulty.toString())}
              options={difficultyOptions}
              onValueChange={handleDifficultyChange}
              aria-label="Overall quiz difficulty"
            />
          </div>

          <div className="space-y-2 flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                }
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                aria-label="Publish quiz immediately"
              />
              <span>Publish Immediately</span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Quiz Questions</h2>

        {formData.questions.map((question, index) => (
          <QuestionEntry
            key={index}
            question={question}
            index={index}
            players={memoizedPlayers}
            onUpdate={updateQuestionEntry}
            onRemove={removeQuestionEntry}
            isRemovable={index > 0}
            shouldFocus={index === lastAddedIndex}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addQuestionEntry}
          className="w-full"
          aria-label="Add another question"
        >
          Add Another Question
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-500 text-sm" role="status">
          {success}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600"
        disabled={isLoading}
        aria-label={isEditMode ? 'Update quiz' : 'Create quiz'}
      >
        {isLoading
          ? isEditMode
            ? 'Updating Quiz...'
            : 'Creating Quiz...'
          : isEditMode
          ? 'Update Quiz'
          : 'Create Quiz'}
      </Button>
    </form>
  )
}
