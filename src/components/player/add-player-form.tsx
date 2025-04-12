'use client'

import { AutoCompleteInput, Option } from '@/components/ui/autocomplete-input'
import { useEffect, useRef, useState } from 'react'

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

  // Fetch teams and origins on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: teamsData, error: teamsError } = await supabase
          .from('nba_teams')
          .select('id, team')

        if (teamsError) throw teamsError

        const { data: originsData, error: originsError } = await supabase
          .from('origins')
          .select('id, name')

        if (originsError) throw originsError

        setTeams(
          teamsData.map((team) => ({
            value: team.id.toString(),
            label: team.team || 'Unknown Team',
          })),
        )

        setOrigins(
          originsData.map((origin) => ({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Filter out empty entries
      const validPlayers = formData.players.filter(
        (player) => player.name.trim() && player.originId !== null,
      )

      if (validPlayers.length === 0) {
        setError('Please add at least one valid player')
        setIsLoading(false)
        return
      }

      // Create all players
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
        setFormData({
          teamId: formData.teamId, // Keep the same team
          players: [{ name: '', originId: null }], // Reset to one empty player
        })
      }

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      setError('Unknown error adding players: ' + JSON.stringify(error, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  const addPlayerEntry = () => {
    setFormData((prev) => ({
      ...prev,
      players: [...prev.players, { name: '', originId: null }],
    }))
  }

  const removePlayerEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index),
    }))
  }

  const updatePlayerEntry = (
    index: number,
    field: keyof PlayerEntry,
    value: string | number | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.map((player, i) =>
        i === index ? { ...player, [field]: value } : player,
      ),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
      <div className="space-y-2">
        <Label>Team</Label>
        <AutoCompleteInput
          value={teams.find((t) => t.value === formData.teamId?.toString())}
          options={teams}
          emptyMessage="No teams found"
          onValueChange={(team) =>
            setFormData({ ...formData, teamId: team ? parseInt(team.value) : null })
          }
        />
      </div>

      <div className="space-y-4">
        {formData.players.map((player, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Player {index + 1}</h3>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePlayerEntry(index)}
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
                onChange={(e) => updatePlayerEntry(index, 'name', e.target.value)}
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
                onValueChange={(origin) =>
                  updatePlayerEntry(index, 'originId', origin ? parseInt(origin.value) : null)
                }
              />
            </div>
          </div>
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
