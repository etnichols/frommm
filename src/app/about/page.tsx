'use client'

import { Section } from '@/components/ui/section'

export default function Home() {
  const paragraphs = [
    [
      `You're watching an NBA game, recognize a player from their college days, and turn to your friends and ask,`,
    ],
    [`From???`, 'text-2xl font-bold italic text-center pb-8'],
    [`They think for a few seconds, and then give up. "I don't know, where?"`],
    [`Then you hit them with the answer, flexing your sports knowledge.`],
    [`This is the "From???" game. And now, it's a website.`],
    [
      `The quizzes here are straightfoward: for every player shown, identify where they went to college. You can create your own quizzes, share it with your friends and check out the leaderboards to see who's the best.`,
    ],
    [`Don't know where to start? Check out The Original™ quiz that started this whole thing.`],
    [`Have fun and happy From????ing!`],
  ]

  return (
    <Section headline="What the heck is From???">
      {paragraphs.map(([item, classes], index) => (
        <p key={index} className={`leading-loose ${classes || ''}`}>
          {item}
        </p>
      ))}
    </Section>
  )
}
