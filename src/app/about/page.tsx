'use client'

import { PageTitle } from '@/components/ui/common'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-6">
      <PageTitle>About</PageTitle>
      <p>
        From??? is a simple game for degenerate NBA fans who want to prove to their friends how much
        they know about NBA players and their alma maters.
      </p>
      <p>
        You&apos;ve probably played this game while sitting on the couch with your buddies. You're
        watching the Knicks and Jalen Brunson nails a three. You point wildly at the TV and ask:
      </p>
      <p className="text-center">&quot;Jalen Brunson. From???&quot;</p>
      <p>
        Your friend pauses, wracks his brain, and responds with &quot;...Xavier?&quot; At which
        point you groan and shame them for their absolute miss (Answer: Villanova. That&apos;s an
        easy one).
      </p>
      <p>
        The quizzes here are an online version of that experience. Take a quiz and add your score to
        the leaderboard and see how you stack up against fellow degens.
      </p>
      <p>Have fun and happy From????ing!</p>
    </div>
  )
}
