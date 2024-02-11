'use client'

import { Section } from '@/components/section'

export default function Home() {
  return (
    <Section headline="About From???">
      <p className="leading-loose">
        It's the game you've probably played a thousand times with your friends: you're watching an
        NBA game, see a player you know, and ask you're friend, "You guys know where he went to
        college??"
      </p>
      <p className="leading-loose">
        This, my friends, is the "From???" game. And now, it's a website.
      </p>
      <p className="leading-loose">
        The game is simple: for every player shown, identify where they went to college.
      </p>
      <p className="leading-loose">
        Create quizzes, share with your friends, compare scores, earn your bragging rights.
      </p>
    </Section>
  )
}
