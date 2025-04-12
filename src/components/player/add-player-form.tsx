'use client'

import { AutoCompleteInput, Option } from '@/components/ui/autocomplete-input'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { createPlayer } from '@/lib/server/players'

interface PlayerEntry {
  name: string
  originId: number | null
}

interface PlayerFormData {
  teamId: number | null
  players: PlayerEntry[]
}

type Team = Option
type Origin = Option

// Memoized Player Entry Component
const PlayerEntry = React.memo(
  ({
    player,
    index,
    origins,
    onUpdate,
    onRemove,
    isRemovable,
  }: {
    player: PlayerEntry
    index: number
    origins: Origin[]
    onUpdate: (index: number, field: keyof PlayerEntry, value: string | number | null) => void
    onRemove: (index: number) => void
    isRemovable: boolean
  }) => {
    const handleNameChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(index, 'name', e.target.value)
      },
      [index, onUpdate],
    )

    const handleOriginChange = useCallback(
      (origin: Option | null) => {
        onUpdate(index, 'originId', origin ? parseInt(origin.value) : null)
      },
      [index, onUpdate],
    )

    return (
      <div className="space-y-2 p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Player {index + 1}</h3>
          {isRemovable && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`name-${index}`}>Name</Label>
          <Input
            id={`name-${index}`}
            value={player.name}
            onChange={handleNameChange}
            placeholder="Enter player name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Origin</Label>
          <AutoCompleteInput
            value={origins.find((o) => o.value === player.originId?.toString())}
            options={origins}
            emptyMessage="No origins found"
            onValueChange={handleOriginChange}
          />
        </div>
      </div>
    )
  },
)

PlayerEntry.displayName = 'PlayerEntry'

export function AddPlayerForm() {
  const [formData, setFormData] = useState<PlayerFormData>({
    teamId: null,
    players: [{ name: '', originId: null }],
  })
  const [teams, setTeams] = useState<Team[]>([])
  const [origins, setOrigins] = useState<Origin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  // Memoize the origins data to prevent unnecessary re-renders
  const memoizedOrigins = useMemo(() => origins, [origins])

  // Fetch teams and origins on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, originsResponse] = await Promise.all([
          supabase.from('nba_teams').select('id, team'),
          supabase.from('origins').select('id, name'),
        ])

        if (teamsResponse.error) throw teamsResponse.error
        if (originsResponse.error) throw originsResponse.error

        setTeams(
          teamsResponse.data.map((team) => ({
            value: team.id.toString(),
            label: team.team || 'Unknown Team',
          })),
        )

        setOrigins(
          originsResponse.data.map((origin) => ({
            value: origin.id.toString(),
            label: origin.name || 'Unknown Origin',
          })),
        )
      } catch (error) {
        setError('Failed to load teams and origins')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const validPlayers = formData.players.filter(
          (player) => player.name.trim() && player.originId !== null,
        )

        if (validPlayers.length === 0) {
          setError('Please add at least one valid player')
          setIsLoading(false)
          return
        }

        const results = await Promise.all(
          validPlayers.map((player) =>
            createPlayer({
              name: player.name.trim(),
              teamId: formData.teamId,
              originId: player.originId,
            }),
          ),
        )

        const failedPlayers = results
          .filter((result) => !result.success)
          .map((result, index) => `${validPlayers[index].name}: ${result.error}`)

        if (failedPlayers.length > 0) {
          setError(`Failed to add some players:\n${failedPlayers.join('\n')}`)
        }

        if (results.some((result) => result.success)) {
          setSuccess(`Successfully added ${results.filter((r) => r.success).length} players!`)
          setFormData((prev) => ({
            teamId: prev.teamId,
            players: [{ name: '', originId: null }],
          }))
        }
      } catch (error) {
        setError('Unknown error adding players: ' + JSON.stringify(error, null, 2))
      } finally {
        setIsLoading(false)
      }
    },
    [formData],
  )

  const addPlayerEntry = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      players: [...prev.players, { name: '', originId: null }],
    }))
  }, [])

  const removePlayerEntry = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index),
    }))
  }, [])

  const updatePlayerEntry = useCallback(
    (index: number, field: keyof PlayerEntry, value: string | number | null) => {
      setFormData((prev) => ({
        ...prev,
        players: prev.players.map((player, i) =>
          i === index ? { ...player, [field]: value } : player,
        ),
      }))
    },
    [],
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
      <div className="space-y-2">
        <Label>Team</Label>
        <AutoCompleteInput
          value={teams.find((t) => t.value === formData.teamId?.toString())}
          options={teams}
          emptyMessage="No teams found"
          onValueChange={(team) =>
            setFormData((prev) => ({ ...prev, teamId: team ? parseInt(team.value) : null }))
          }
        />
      </div>

      <div className="space-y-4">
        {formData.players.map((player, index) => (
          <PlayerEntry
            key={index}
            player={player}
            index={index}
            origins={memoizedOrigins}
            onUpdate={updatePlayerEntry}
            onRemove={removePlayerEntry}
            isRemovable={index > 0}
          />
        ))}

        <Button type="button" variant="outline" onClick={addPlayerEntry} className="w-full">
          Add Another Player
        </Button>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}

      <Button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600"
        disabled={isLoading}
      >
        {isLoading ? 'Adding Players...' : 'Add Players'}
      </Button>
    </form>
  )
}
