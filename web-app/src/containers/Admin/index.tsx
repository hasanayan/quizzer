import { Redirect, Switch } from "react-router-dom";
import { FC } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import { Quiz } from "containers/Admin/Quizzes";

const Admin: FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/quizzes`}>
        <Quiz />
      </Route>
      <Route>
        <Redirect to={`${path}/quizzes`} />
      </Route>
    </Switch>
  );
};

export default Admin;
