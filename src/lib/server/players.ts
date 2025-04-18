'use server'

import { createClient } from '../supabase/server'

export async function createPlayer(formData: {
  name: string
  teamId: number | null
  originId: number | null
}) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from('players').insert([
      {
        name: formData.name,
        team_id: formData.teamId,
        origin_id: formData.originId,
      },
    ])

    if (error) throw error

    return { success: true, error: '' }
  } catch (error) {
    return { success: false, error: 'Failed to create player: ' + JSON.stringify(error, null, 2) }
  }
}

export async function updatePlayer(
  playerId: number,
  formData: {
    name?: string
    teamId?: number | null
    originId?: number | null
  },
) {
  const supabase = await createClient()

  try {
    const updateData: any = {}

    if (formData.name !== undefined) updateData.name = formData.name
    if (formData.teamId !== undefined) updateData.team_id = formData.teamId
    if (formData.originId !== undefined) updateData.origin_id = formData.originId

    const { error } = await supabase.from('players').update(updateData).eq('id', playerId)

    if (error) throw error

    return { success: true, error: '' }
  } catch (error) {
    return { success: false, error: 'Failed to update player: ' + JSON.stringify(error, null, 2) }
  }
}

export async function getPlayer(playerId: number) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('players')
      .select('*, team:team_id(id, team), origin:origin_id(id, name)')
      .eq('id', playerId)
      .single()

    if (error) throw error

    return { success: true, player: data, error: '' }
  } catch (error) {
    return {
      success: false,
      player: null,
      error: 'Failed to get player: ' + JSON.stringify(error, null, 2),
    }
  }
}
