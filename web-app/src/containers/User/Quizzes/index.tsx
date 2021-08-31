import { FC } from "react";
import { useParams } from "react-router-dom";
import { QuizList } from "./QuizList";
import { Quiz } from "./QuizDetail";

export const Quizzes: FC = () => {
  const { contentId } = useParams<{ contentId?: string }>();

  if (contentId) return <Quiz id={contentId} />;
  else return <QuizList />;
};
