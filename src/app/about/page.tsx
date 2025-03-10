'use client'

import Row from '@/components/ui/row'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-6">
      <Row className="tracking-wide font-semibold">About</Row>
      <p>
        From??? is a simple game for degenerate NBA fans who want to prove to their friends how much
        they know about NBA players and their alma maters.
      </p>
      <p>
        If you&apos;re here, you&apos;re probably one of them, and you&apos;ve probably played this
        game while sitting on the couch with your buddies. Jalen Brunson pops up on the TV, you
        point wildly and ask:
      </p>
      <p className="text-center">&quot;From???&quot;</p>
      <p>
        They pause, respond with &quot;...Xavier?&quot; At which point you groan and shame them for
        their absolute miss (Answer: Villanova. That&apos;s an easy one).
      </p>
      <p>
        The quizzes here are an online version of that experience. Take a quiz and add your score to
        the leaderboard and see how you stack up against fellow degens.
      </p>
      <p>Have fun and happy From????ing!</p>
    </div>
  )
}
