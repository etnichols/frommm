'use client'

import { Section } from '@/components/section'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <Section headline="Quizzes Page">
      <Button
        onClick={() => {
          console.log('old school')
        }}
        className="flex w-64"
        variant="default"
      >
        {`"The Original"`}
      </Button>
      <Button
        onClick={() => {
          console.log('old school')
        }}
        className="flex w-64"
        variant="default"
      >
        {`2000s`}
      </Button>
      <Button
        onClick={() => {
          console.log('old school')
        }}
        className="flex w-64"
        variant="default"
      >
        {`Old School (90s or before)`}
      </Button>
    </Section>
  )
}
