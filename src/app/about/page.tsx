'use client'

import { PageTitle } from '@/components/ui/common'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-6 leading-7">
      <PageTitle>About</PageTitle>
      <p>
        From??? is a simple game born from a simple activity: watching NBA games with your friends
        and quizzing each other on where players played in college. My old roommate Andrew and I
        would do this non-stop during the NBA playoffs (note: I was good at finding obscure players,
        Andrew was actually good at answering).{' '}
      </p>
      <p>
        Eventually, I made the{' '}
        <a
          className="font-bold underline text-orange-500"
          href="https://forms.gle/Yr9Ct3AubgDqTXYR7"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Original From??? Quiz
        </a>{' '}
        on Google Forms of 30 questions (10 easy, 10 medium, 10 hard) shared it with a bunch of
        friends who seemed to enjoy it. I made this web version to bring it to the masses, and make
        more quizzes available.
      </p>
      <p>
        You can find the web version of the original quiz{' '}
        <a
          className="font-bold underline text-orange-500"
          href="https://from-game.com/quiz/the-original"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        , and it&apos;s leaderboard is{' '}
        <a
          className="font-bold underline text-orange-500"
          href="https://from-game.com/the-original/leaderboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        . (To Jeff D: you&apos;re an absolute degen and the only one to get a perfect score. Bravo.)
      </p>
      <p>Have fun and happy From????ing!</p>
      <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <span className="font-bold">Disclaimer:</span> This is not affiliated with the NBA or any of
        the NBA teams. This is a fan-made project and is not endorsed by the NBA.
      </div>
      <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <span className="font-bold">Disclaimer 2:</span> Did I mess up a player&apos;s college or
        origin? Let me know and I&apos;ll fix it:{' '}
        <a className="font-bold underline text-orange-500" href="mailto:nba-from-game@proton.me">
          nba-from-game@proton.me
        </a>
        .
      </div>
      <div className="italic text-gray-600 font-bold text-sm">
        To Andrew L. , James N. and Danny &quot;Coach Dan&quot; N. -- thank you for helping bring this to
        life.
      </div>
    </div>
  )
}
