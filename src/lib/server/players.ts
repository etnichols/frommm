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
