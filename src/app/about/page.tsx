'use client'

import { Section } from '@/components/section'

export default function Home() {
  const paragraphs = [
    "It's the game you've probably played a thousand times with your friends: you're watching an NBA game, see a player you know, and ask you're friend, \"You guys know where he went to college??\"",
    'This, my friends, is the "From???" game. And now, it\'s a website.',
    'The game is simple: for every player shown, identify where they went to college.',
    'Create quizzes, share with your friends, compare scores, earn your bragging rights.',
  ]

  return (
    <Section headline="About From???">
      {paragraphs.map((item, index) => (
        <p key={index} className="leading-loose">
          {item}
        </p>
      ))}
    </Section>
  )
}
