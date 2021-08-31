import { FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useIsPermitted } from "hooks/use-is-permitted";

export type PrivateRouteProps<Path extends string = string> =
  RouteProps<Path> & {
    permission?: string;
  };

export const PrivateRoute: FC<PrivateRouteProps> = ({
  permission,
  ...routeProps
}) => {
  const { isLoading, isAuthenticated, loginWithRedirect, error } =
    useAuth0<{ scope: string }>();

  const isPermitted = useIsPermitted(permission, isAuthenticated);

  if (isLoading) return <>Authenticating</>;

  if (error) {
    return <>Oops! There was a problem while authenticating you.</>;
  }
  if (!isAuthenticated) {
    loginWithRedirect();
    return <>Redirecting to login page</>;
  }

  if (permission && isPermitted === null) return <>Authorizing</>;

  if (isPermitted === false) {
    return <Redirect to="/" />;
  }

  return <Route {...routeProps} />;
};
