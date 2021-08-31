import useSWR from "swr";
import { fetcher } from "./Fetcher";

const URL = "https://localhost:5001/quiz";
export const useQuizList = (): [API.Quiz[], boolean, Error] => {
  const { data, error } = useSWR<API.Quiz[]>(URL, {
    suspense: true,
    fetcher: fetcher,
  });

  return [data!, !error && !data, error];
};
