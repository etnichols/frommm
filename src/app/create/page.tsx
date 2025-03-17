'use client'

import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

export default function Home() {
  return (
    <Section headline="Create Quiz Page">
      <div className="text-base text-center">Not Yet Implemented. Come Back Soon!</div>
      {process.env.NODE_ENV === 'development' && (
        <Button
          onClick={async () => {
            console.log('Create Test Quiz')
          }}
          className="bg-emerald-500 w-full md:w-48"
        >
          Create Test Quiz
        </Button>
      )}
    </Section>
  )
}
