'use client'

export default function Home() {
  const paragraphs = [
    `The From??? game is a simple concept. You're watching an NBA game, recognize a player from their college days, and turn to your friends and ask,`,
    `From???`,
    `They think for a few seconds, and then give up. "I don't know, where?"`,
    `Then you hit them with the answer, flexing your sports knowledge. This is the "From???" game. And now, it's a website.`,
    `The quizzes here are straightfoward: for every player shown, identify where they went to college.`,
    `This site lets you take From??? quizzes, including The Original™ that started this whole thing. You can also create your own quizzes and share it with your friends.`,
    `Test your knowledge, climb the leaderboards and earn your bragging rights.`,
  ]

  return (
    <div className="flex flex-col gap-8 items-center lg:min-h-72 overflow-scroll">
      <h1 className="flex text-xl text-center mx-8 font-semibold tracking-wide">
        What the hell is 'From???'
      </h1>
      {paragraphs.map((item, index) => (
        <p key={index} className="leading-loose">
          {item}
        </p>
      ))}
    </div>
  )
}
