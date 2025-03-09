"use client";

import { AVAILABLE_QUIZZES } from "@root/lib/data/quiz-list";
import { QuizCard } from "@root/components/quiz/quiz-card";
import Row from "@root/components/Row";

export default function Page() {
  return (
    <div className="flex flex-col gap-y-6">
      <Row className="tracking-wide font-semibold">
        Quizzes on where current and former NBA players went to college.
      </Row>
      <Row className="flex flex-col gap-y-6">
        {AVAILABLE_QUIZZES.map((quiz) => (
          <QuizCard key={quiz.slug} {...quiz} />
        ))}
      </Row>
    </div>
  );
}
