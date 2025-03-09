"use client";

import Badge from "./badge";
import Grid from "./grid";
import Row from "./row";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <Grid className="flex flex-col mb-4">
      <div className="flex flex-col gap-y-4">
        <Basketballs />
        <div>
          From??? Basketball Quizzes <Badge>{"0.0.2"}</Badge>
        </div>
        <Row>
          <ActionBar
            items={[
              {
                body: "About",
                onClick: () => router.push("/about"),
              },
              {
                body: "Browse",
                onClick: () => router.push("/quizzes"),
              },
              {
                body: "Leaderboard",
                onClick: () => router.push("/leaderboard"),
              },
            ]}
          />
        </Row>
      </div>
    </Grid>
  );
}

function Basketballs() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/")}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          router.push("/");
        }
      }}
      className="flex flex-row gap-x-4 items-center cursor-pointer"
    >
      {new Array(4).fill(0).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: decoration
        <div key={`basketball-${index}`} className="flex flex-row gap-x-4">
          <div className="bg-orange-500 size-6 rounded-full" />
          <div className="rotate-45 bg-black size-5 text-white">
            <div className="-rotate-45 flex items-center justify-center h-full">
              {"?"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
