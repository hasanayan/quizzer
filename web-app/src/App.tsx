import { Auth0Provider } from "@auth0/auth0-react";
import { PrivateRoute } from "components/PrivateRoute";
import { Quizzes } from "containers/User";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { AppLayout } from "components/AppLayout";
import { FetcherSetup } from "services/Fetcher";
import React from "react";

const Admin = React.lazy(() => import("./containers/Admin"));

const requestedPermissions = [
  "content:read",
  "content:write",
  "content:delete",
  "admin",
];
const scope = requestedPermissions.concat(["profile email openid"]).join(" ");

const App = () => {
  return (
    <BrowserRouter>
      <Auth0Provider
        domain="quizzer.eu.auth0.com"
        clientId="3HadCZ70bQLGBcEinBYZxjv688kkXYUQ"
        audience="https://api.quizzer.com"
        redirectUri={window.location.origin}
        scope={scope}
        cacheLocation="localstorage"
        useRefreshTokens
      >
        <PrivateRoute>
          <FetcherSetup />
          <AppLayout>
            <Suspense fallback={<>Loading</>}>
              <Switch>
                <Route path="/quiz/:contentId?">
                  <Suspense fallback="Loading">
                    <Quizzes />
                  </Suspense>
                </Route>

                <PrivateRoute path="/admin" permission="admin">
                  <Suspense fallback="Loading">
                    <Admin />
                  </Suspense>
                </PrivateRoute>

                <Route>
                  <Redirect to="/quiz" />
                </Route>
              </Switch>
            </Suspense>
          </AppLayout>
        </PrivateRoute>
      </Auth0Provider>
    </BrowserRouter>
  );
};

export default App;
