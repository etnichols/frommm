'use server'

import { Origin as BaseOrigin } from '@/types/quiz'
import { cache } from 'react'
import { createClient } from '../supabase/server'

// Extend the base Origin type with additional fields from the database
export interface Origin extends BaseOrigin {
  created_at: string
  type: number
}

// Use React's cache function to cache the results
export const fetchOrigins = cache(async (): Promise<Origin[]> => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('origins')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching origins:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Failed to fetch origins:', error)
    return []
  }
})
