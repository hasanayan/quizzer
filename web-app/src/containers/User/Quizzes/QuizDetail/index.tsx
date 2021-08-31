import { useCallback, useMemo } from "react";
import { useState } from "react";
import { FC } from "react";
import styled from "styled-components";
import { Question } from "./Question";
import { useQuiz } from "services/quiz";
import { Controller, useForm } from "react-hook-form";
import { QuestionType } from "services/constants";
import { ContentContainer } from "components/AppLayout";
import { Button, Card, PageHeader, Typography } from "antd";
import { Link, useHistory } from "react-router-dom";

export const Quiz: FC<{ id: string }> = ({ id }) => {
  const [quiz] = useQuiz(id);

  const history = useHistory();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const goToNextQuestion = useCallback(
    () => setCurrentQuestion((state) => state + 1),
    []
  );

  const goToPreviousQuestion = useCallback(
    () => setCurrentQuestion((state) => state - 1),
    []
  );

  const { control, getValues } = useForm();

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Quizzes"
        style={{ background: "white", marginBottom: "32px" }}
        onBack={() => history.push("/quizzes")}
      />
      <ContentContainer>
        <Typography.Title>{quiz.title}</Typography.Title>
        {currentQuestion < quiz.questions.length && (
          <Typography.Paragraph>
            Question {currentQuestion + 1}/{quiz.questions.length}
          </Typography.Paragraph>
        )}

        <Card>
          {currentQuestion < quiz.questions.length && (
            <Controller
              name={`${currentQuestion}`}
              control={control}
              render={({ field }) => (
                <Question
                  question={quiz.questions[currentQuestion]}
                  onClickNext={(answer) => {
                    field.onChange(answer);
                    goToNextQuestion();
                  }}
                  onClickPrevious={
                    currentQuestion > 0
                      ? (answer) => {
                          field.onChange(answer);
                          goToPreviousQuestion();
                        }
                      : undefined
                  }
                  answer={field.value}
                />
              )}
            />
          )}

          {currentQuestion === quiz.questions.length && (
            <Results answers={getValues()} quiz={quiz} />
          )}
        </Card>
      </ContentContainer>
    </>
  );
};

const Results: FC<{ quiz: API.Quiz; answers: Record<string, any> }> = ({
  quiz,
  answers,
}) => {
  const history = useHistory();

  const score = useMemo(() => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (question.type === QuestionType.STRING_ANSWER) {
        if (question.answer.toLowerCase() === answers[index].toLowerCase()) {
          correctAnswers++;
          return;
        }
      } else if (question.type === QuestionType.SINGLE_CHOICE) {
        if (question.answer === answers[index]) {
          correctAnswers++;
          return;
        }
      } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
        const _answer = answers[index] as string[];
        if (
          _answer.length === question.answer.length &&
          !question.answer.some((answer) => !_answer.includes(answer))
        ) {
          correctAnswers++;
          return;
        }
      }
    });
    return (correctAnswers / quiz.questions.length) * 100;
  }, [quiz, answers]);
  return (
    <div>
      <Typography.Paragraph>
        Finished: You got {score.toFixed(2)} out of 100 points
      </Typography.Paragraph>
      <br />
      <Button onClick={() => history.push("/quizzes")}>
        See Other Quizzes
      </Button>
    </div>
  );
};
