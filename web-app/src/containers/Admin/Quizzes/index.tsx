import { FC } from "react";
import { useRouteMatch, Switch, Route, Link } from "react-router-dom";
import { QuizDetail } from "./QuizDetail";
import { QuizForm } from "./QuizForm";
import { QuizList } from "./QuizList";

export const Quiz: FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/new`}>
        <QuizForm />
      </Route>
      <Route path={`${path}/:contentId`}>
        <QuizDetail />
      </Route>
      <Route exact>
        <QuizList />
      </Route>
    </Switch>
  );
};
