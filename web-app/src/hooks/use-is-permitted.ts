import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

export const useIsPermitted = (permission?: string, flag?: boolean) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (flag === undefined || flag === true) {
      getAccessTokenSilently().then((token) => {
        const scopes = jwt_decode<{ scope: string }>(token).scope.split(" ");
        if (!permission) {
          setIsAuthorized(true);
          return;
        }
        if (scopes.includes(permission)) {
          setIsAuthorized(true);
        } else setIsAuthorized(false);
      });
    }
  }, [getAccessTokenSilently, permission, flag]);

  return isAuthorized;
};
