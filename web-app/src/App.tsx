import { Auth0Provider } from "@auth0/auth0-react";
import { PrivateRoute } from "components/PrivateRoute";
import { Admin } from "containers/Admin";
import { Quizzes } from "containers/User";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { AppLayout } from "components/AppLayout";
import { FetcherSetup } from "services/Fetcher";

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
        domain="carna.eu.auth0.com"
        clientId="DBHyo9g3HKU9FCJdo319pV5W08ZKCD8e"
        audience="https://api.carna.ai"
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

                <Route path="/admin">
                  <Suspense fallback="Loading">
                    <Admin />
                  </Suspense>
                </Route>

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
