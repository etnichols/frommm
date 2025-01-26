"use client";

import Grid from "@components/Grid";
import Card from "@root/components/Card";
import Button from "@root/components/Button";
import { useRouter } from "next/navigation";

export default function Page() {
  return (
    <Grid>
      <div className="flex flex-col gap-y-8">
        <QuizCard title="The Original" slug="the-original">
          Where it all began. Thirty questions of increasing difficulty. Note:
          intentionally excludes Big 12 players.
        </QuizCard>
        <QuizCard title="NBA All Stars" slug="all-stars">
          Active NBA All Stars. 15 Questions.
        </QuizCard>
        <QuizCard
          title="2023 NBA Draft Lottery Picks"
          slug="2023-nba-draft-lottery-picks"
        >
          Who's feeling lucky? 2023 NBA Draft Lottery Picks. 14 questions.
        </QuizCard>
      </div>
    </Grid>
  );
}

function QuizCard(props: {
  title: string;
  children: React.ReactNode;
  slug: string;
}) {
  const router = useRouter();
  const { title, children, slug } = props;
  return (
    <Card mode="left" title={title}>
      {children}
      <br />
      <br />
      <Button onClick={() => router.push(`/quiz/${slug}`)}>Take Quiz</Button>
    </Card>
  );
}
