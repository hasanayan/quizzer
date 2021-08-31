import { FC } from "react";
import { useParams } from "react-router";
import { useQuiz } from "services/quiz";
import { QuizForm } from "./QuizForm";

export const QuizDetail: FC = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const [quiz] = useQuiz(contentId);
  if (!quiz) return null;
  return <QuizForm value={quiz} />;
};
