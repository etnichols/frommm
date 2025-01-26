"use client";

import { Button } from "@components/ui/button";
import { NBA_DRAFT_LOTTERY_PICKS_2023 } from "@lib/data/lottery-picks";
import { Section } from "@components/ui/section";
import { useState } from "react";

export default function Home() {
  // const [quiz, setQuiz] = useState<string>('')
  const [message, setMessage] = useState<string>("");

  const handleCreateQuiz = async () => {
    try {
      const quizCreationResponse = await fetch("/api/quiz/create", {
        method: "POST",
        body: JSON.stringify(NBA_DRAFT_LOTTERY_PICKS_2023),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const quizCreationJson = await quizCreationResponse.json();
      setMessage("Quiz created successfully");
    } catch (e) {
      console.error(e);
      setMessage("Quiz creation failed, " + e);
    }
  };

  return (
    <Section headline="Create Quiz Page">
      <div className="text-base text-center">
        Not Yet Implemented. Come Back Soon!
      </div>
      {process.env.NODE_ENV === "development" && (
        <Button
          onClick={async () => {
            handleCreateQuiz();
          }}
          className="bg-emerald-500 w-full md:w-48"
        >
          Create Test Quiz
        </Button>
      )}
    </Section>
  );
}
