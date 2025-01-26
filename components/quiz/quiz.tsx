"use client";

import { useEffect, useReducer, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import type { QuizType, QuizQuestion } from "@models/Quiz";
import { Loader2 } from "lucide-react";
import AutoCompleteInput from "../ui/autocomplete-input";
import { Button } from "../ui/button";
import { SaveResultDialog } from "./save-result-dialog";
import Row from "../Row";
import Card from "../Card";
import ActionListItem from "../ActionListItem";
import Input from "../Input";

// Define action types
enum QuizAction {
  SET_ANSWER = "SET_ANSWER",
  NEXT_QUESTION = "NEXT_QUESTION",
  PREVIOUS_QUESTION = "PREVIOUS_QUESTION",
  GRADE_QUIZ = "GRADE_QUIZ",
  DISPLAY_RESULTS = "DISPLAY_RESULTS",
}

enum QuizStep {
  QUESTIONS,
  GRADING,
  RESULTS,
}

interface QuizState {
  index: number;
  inputValue: string;
  answers: string[];
  step: QuizStep;
}

// TODO: Save answers to DB
function quizReducer(
  state: QuizState,
  action: { type: QuizAction; payload?: any }
) {
  switch (action.type) {
    case QuizAction.SET_ANSWER:
      const updatedAnswers = [...state.answers];
      updatedAnswers[state.index] = action.payload.answer;
      return { ...state, answers: updatedAnswers };
    case QuizAction.NEXT_QUESTION:
      return {
        ...state,
        index: state.index + 1,
      };
    case QuizAction.PREVIOUS_QUESTION:
      return {
        ...state,
        index: state.index - 1,
      };
    case QuizAction.GRADE_QUIZ:
      return {
        ...state,
        step: QuizStep.GRADING,
      };
    case QuizAction.DISPLAY_RESULTS:
      return {
        ...state,
        step: QuizStep.RESULTS,
      };
    default:
      return state;
  }
}

export default function QuizComponent({ quiz }: { quiz: QuizType }) {
  const [state, dispatch] = useReducer(quizReducer, {
    index: 0,
    inputValue: "",
    answers: [],
    step: QuizStep.QUESTIONS,
  });

  useEffect(() => {
    if (state.step === QuizStep.GRADING) {
      // Grade quiz, save results, and display results.
      setTimeout(() => {
        dispatch({ type: QuizAction.DISPLAY_RESULTS });
      }, 3000);
    }
  }, [state.step]);

  const { questions: rawQuestions, slug } = quiz;
  const questions = rawQuestions;

  const isFinalQuestion = state.index === questions.length - 1;

  let content = (
    <>
      <QuizQuestionComponent
        state={state}
        questions={questions}
        dispatch={dispatch}
      />
      {/* <QuizNavigationControls
        state={state}
        questions={questions}
        dispatch={dispatch}
      /> */}
      {isFinalQuestion && (
        <Button
          onClick={() => dispatch({ type: QuizAction.GRADE_QUIZ })}
          className="w-48 flex items-center justify-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400"
        >
          Grade Quiz
        </Button>
      )}
    </>
  );
  if (state.step === QuizStep.RESULTS) {
    content = (
      <QuizResults
        state={state}
        dispatch={dispatch}
        questions={questions}
        answers={state.answers}
        quizId={quiz._id}
        slug={slug}
      />
    );
  }

  if (state.step === QuizStep.GRADING) {
    content = (
      <div className="flex flex-col justify-center items-center gap-y-8">
        <div className="text-lg">Grading your quiz...</div>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card mode="left" title={quiz.title}>
      <div className="flex flex-col gap-y-4">
        {quiz.description && <Row>{quiz.description}</Row>}
        {content}
      </div>
    </Card>
  );
}

const QuizResults = ({
  state,
  dispatch,
  questions,
  answers: any,
  quizId,
  slug,
}: {
  state: QuizState;
  dispatch: any;
  questions: QuizQuestion[];
  answers: string[];
  quizId: string;
  slug: string;
}) => {
  const correctAnswerCount = questions
    .map((question, index) => {
      return question.college === state.answers[index];
    })
    .filter(Boolean).length;

  const percentage = Math.floor((correctAnswerCount / questions.length) * 100);

  const saveQuizResult = async (initials: string) => {
    const quizResult = {
      answers: state.answers,
      quizId,
      score: correctAnswerCount,
      initials,
    };

    const saveQuizResultResponse = await fetch(`/api/quiz/${slug}`, {
      method: "POST",
      body: JSON.stringify(quizResult),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const saveQuizResultJson = await saveQuizResultResponse.json();

    return saveQuizResultJson;
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-8">
      <div className="text-lg font-bold tracking-wider">
        Result: {correctAnswerCount}/{questions.length} ({percentage}%)
      </div>
      <SaveResultDialog saveResultFn={saveQuizResult} />
      <Table className="text-xs">
        <TableCaption>Your Quiz Results</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Player</TableHead>
            <TableHead>Your Answer</TableHead>
            <TableHead>Correct Answer</TableHead>
            <TableHead className="text-right"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => {
            const isCorrect = question.college === state.answers[index];
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{question.name}</TableCell>
                <TableCell>{state.answers[index] || "No answer"}</TableCell>
                <TableCell>{question.college}</TableCell>
                <TableCell className="text-right">
                  {isCorrect ? "✅" : "❌"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* <div className="cursor-pointer hover:underline text-xs font-bold tracking-wide text-slate-500">
        Share this result
      </div> */}
    </div>
  );
};

const QuizQuestionComponent = ({
  state,
  dispatch,
  questions,
}: {
  state: QuizState;
  dispatch: any;
  questions: any;
}) => {
  const [value, setValue] = useState("");
  const playerName = questions[state.index].name;
  const currentAnswer = state.answers[state.index] || "";

  return (
    <Row>
      <Row>
        Test player with long name
        <span className="ml-3 text-slate-500">{`(${state.index + 1}/${questions.length})`}</span>
      </Row>
      <div className="flex flex-col gap-y-4">
        <Input
          autoComplete="off"
          name="input_test_empty"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // dispatch({ type: QuizAction.SET_ANSWER, payload: { answer: e.target.value } })
          }}
        />
        <QuizNavigationControls
          state={state}
          dispatch={dispatch}
          questions={questions}
        />
      </div>
    </Row>
  );
};

const QuizNavigationControls = ({
  state,
  dispatch,
  questions,
}: {
  state: QuizState;
  dispatch: any;
  questions: any;
}) => {
  return (
    <div>
      <ActionListItem
        icon="⭢"
        onClick={() => dispatch({ type: QuizAction.NEXT_QUESTION })}
      >
        Next Question
      </ActionListItem>
      <ActionListItem
        icon="⭠"
        onClick={() => dispatch({ type: QuizAction.PREVIOUS_QUESTION })}
      >
        Previous Question
      </ActionListItem>
    </div>
  );
};
