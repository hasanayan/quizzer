import { useAuth0 } from "@auth0/auth0-react";
import { FC } from "react";

let tokenGetter: () => Promise<string>;

export const FetcherSetup: FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  tokenGetter = getAccessTokenSilently;
  return <></>;
};

export const fetcher = async <T extends {}>(
  input: RequestInfo,
  init?: RequestInit
) => {
  const token = await tokenGetter();
  const response = await fetch(input, {
    ...(init || {}),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  return (await response.json()) as T;
};
