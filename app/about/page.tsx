"use client";

import { Section } from "@components/ui/section";
import Grid from "@root/components/Grid";
import Row from "@root/components/Row";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-6">
      <Row className="tracking-wide font-semibold">About</Row>
      <p>
        From??? is a simple game for degenerate NBA fans who want to prove to
        their friends how much they know about NBA players and their alma
        maters.
      </p>
      <p>
        If you're here, you're probably one of them, and you've probably played
        this game while sitting on the couch with your buddies. Jalen Brunson
        pops up on the TV, you point wildly and ask:
      </p>
      <p className="text-center">"From???"</p>
      <p>
        They pause, respond with "...Xavier?" At which point you groan and shame
        them for their absolute miss (Answer: Villanova. That's an easy one).
      </p>
      <p>
        The quizzes here are an online version of that experience. Take a quiz
        and add your score to the leaderboard and see how you stack up against
        fellow degens.
      </p>
      <p>Have fun and happy From????ing!</p>
    </div>
  );
}
