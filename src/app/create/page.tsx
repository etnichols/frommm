'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlayerForm } from '@/components/player/player-form'
import { QuizForm } from '@/components/quiz/quiz-form'
import { createClient } from '@/lib/supabase/client'

export default function CreatePage() {
  const [formType, setFormType] = useState<'player' | 'quiz' | 'editPlayer'>('player')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [playerData, setPlayerData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Search for players when query changes
  useEffect(() => {
    if (!searchQuery || formType !== 'editPlayer' || playerData) return

    const searchPlayers = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('players')
          .select('id, name, team:team_id(team), origin:origin_id(name)')
          .ilike('name', `%${searchQuery}%`)
          .order('name')
          .limit(10)

        if (error) throw error
        setSearchResults(data || [])
      } catch (err: any) {
        setError(`Failed to search players: ${err.message || 'Unknown error'}`)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      searchPlayers()
    }, 300) // Debounce search

    return () => clearTimeout(timer)
  }, [searchQuery, formType, supabase, playerData])

  // Fetch player data by ID
  const fetchPlayerById = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*, team:team_id(id, team), origin:origin_id(id, name)')
        .eq('id', id)
        .single()

      if (error) throw error
      setPlayerData(data)
      setSearchQuery('') // Clear search after selecting a player
      setSearchResults([])
    } catch (err: any) {
      setError(`Failed to load player: ${err.message || 'Unknown error'}`)
      setPlayerData(null)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setPlayerData(null)
    setSearchQuery('')
    setSearchResults([])
    setError(null)
  }

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">This feature is not available in production</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex justify-center space-x-4">
        <Button
          variant={formType === 'player' ? 'default' : 'outline'}
          onClick={() => setFormType('player')}
          aria-pressed={formType === 'player'}
          className={formType === 'player' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        >
          Add Players
        </Button>
        <Button
          variant={formType === 'editPlayer' ? 'default' : 'outline'}
          onClick={() => {
            setFormType('editPlayer')
            resetForm()
          }}
          aria-pressed={formType === 'editPlayer'}
          className={formType === 'editPlayer' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        >
          Edit Player
        </Button>
        <Button
          variant={formType === 'quiz' ? 'default' : 'outline'}
          onClick={() => setFormType('quiz')}
          aria-pressed={formType === 'quiz'}
          className={formType === 'quiz' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        >
          Create Quiz
        </Button>
      </div>

      {formType === 'player' && <PlayerForm />}

      {formType === 'editPlayer' && (
        <div className="max-w-md mx-auto">
          {!playerData ? (
            <>
              <div className="mb-4 space-y-2">
                <Label htmlFor="searchQuery">Search Player by Name</Label>
                <div className="flex space-x-2">
                  <Input
                    id="searchQuery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter player name"
                  />
                  <Button onClick={resetForm} variant="outline">
                    Reset
                  </Button>
                </div>
              </div>

              {loading && <p className="text-gray-500">Searching...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {searchResults.length > 0 && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <h3 className="font-medium p-3 bg-gray-50">Search Results</h3>
                  <ul className="divide-y">
                    {searchResults.map((player) => (
                      <li key={player.id} className="p-3">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left"
                          onClick={() => fetchPlayerById(player.id)}
                        >
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-gray-500">
                              {player.team?.team || 'No Team'} •{' '}
                              {player.origin?.name || 'Unknown Origin'}
                            </div>
                          </div>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {searchQuery && !loading && searchResults.length === 0 && !error && (
                <p className="text-gray-500 mt-2">
                  No players found matching &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Editing Player: {playerData.name}</h2>
                <Button variant="outline" onClick={resetForm} size="sm">
                  Back to Search
                </Button>
              </div>

              <PlayerForm
                initialData={playerData}
                onSuccess={() => {
                  resetForm()
                }}
              />
            </>
          )}
        </div>
      )}

      {formType === 'quiz' && <QuizForm />}
    </div>
  )
}
