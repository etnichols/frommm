"use client";

import ActionBar from "./ActionBar";
import Badge from "./Badge";
import Row from "./Row";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col gap-y-4">
        <Basketballs />
        <Row>
          From??? Basketball Quizzes <Badge>{"0.0.2"}</Badge>
        </Row>
      </div>
      <Row>
        <ActionBar
          items={[
            {
              body: "Leaderboard",
              onClick: () => router.push("/leaderboard"),
            },
            {
              body: "About",
              onClick: () => router.push("/about"),
            },
            {
              body: "Browse",
              onClick: () => router.push("/quizzes"),
            },
          ]}
        />
      </Row>
      <Row>
        Create, take and share quizzes on where current and former NBA players
        went to college.
      </Row>
    </div>
  );
}

function Basketballs() {
  return (
    <div className="flex flex-row gap-x-4 items-center justify-center">
      {new Array(4).fill(0).map((_, index) => (
        <>
          {/* biome-ignore lint/suspicious/noArrayIndexKey: <explanation> */}
          <div key={index} className="bg-orange-500 size-6 rounded-full" />
          {"?"}
        </>
      ))}
    </div>
  );
}
