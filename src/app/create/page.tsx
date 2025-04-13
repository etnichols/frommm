'use client'

import { AddPlayerForm } from '@/components/player/add-player-form'

export default function CreatePage() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">This feature is not available in production</h1>
      </div>
    )
  }
  return <AddPlayerForm />
}
