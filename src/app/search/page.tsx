'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { PageTitle } from '@/components/ui/common'
import { createClient } from '@/lib/supabase/client'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Search for players when query changes
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([])
      return
    }

    const searchPlayers = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('players')
          .select('id, name, team:team_id(team), origin:origin_id(name)')
          .ilike('name', `%${searchQuery}%`)
          .order('name')
          .limit(20)

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
  }, [searchQuery, supabase])

  const resetSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setError(null)
  }

  return (
    <div className="mt-4 flex flex-col gap-y-6 flex-grow">
      <PageTitle>Player Search</PageTitle>
      <div className="w-full md:max-w-md mx-auto">
        <div className="flex space-x-2 w-full">
          <Input
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for player by name"
            aria-label="Search for players"
            className="flex-1"
          />
          {searchQuery && (
            <Button onClick={resetSearch} variant="outline" aria-label="Clear search">
              Clear
            </Button>
          )}
        </div>

        {loading && <p className="text-gray-500 text-center">Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-4">
            <h2 className="font-medium">Search Results</h2>
            <div className="grid gap-4">
              {searchResults.map((player) => (
                <Card key={player.id} className="w-full">
                  <CardHeader className="pb-2">
                    <CardTitle>{player.name}</CardTitle>
                    <CardDescription>
                      {player.team?.team || 'No Team'} • {player.origin?.name || 'Unknown Origin'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searchQuery && !loading && searchResults.length === 0 && !error && (
          <p className="text-gray-500 mt-2 text-center">
            No players found matching &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>
    </div>
  )
}
