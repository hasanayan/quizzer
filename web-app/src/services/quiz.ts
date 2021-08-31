import useSWR, { mutate } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { fetcher } from "./Fetcher";

const URL = "https://localhost:5001/quiz";
export const useQuiz = (id: string): [API.Quiz, boolean, Error] => {
  const { data, error } = useSWR<API.Quiz>(`${URL}/${id}`, {
    suspense: true,
    fetcher,
  });

  return [data!, !error && !data, error];
};

export const upsertQuiz = async (quiz: API.Quiz) => {
  const response = await fetcher<API.Quiz>(
    quiz.id ? `${URL}/${quiz.id}` : URL,
    {
      method: quiz.id ? "PATCH" : "POST",
      body: JSON.stringify(quiz),
    }
  );

  (mutate as ScopedMutator<API.Quiz[]>)(URL, (data = []) => {
    const filteredData = quiz.id ? data.filter((c) => c.id !== quiz.id) : data;
    return [...filteredData, response];
  });

  (mutate as ScopedMutator<API.Quiz>)(`${URL}/${response.id}`, response);
};

export const removeQuiz = async (id: string) => {
  await fetcher(`${URL}/${id}`, {
    method: "DELETE",
  });

  // (mutate as ScopedMutator<API.Quiz[]>)(URL, (data) =>
  //   data?.filter((quiz) => quiz.id !== id)
  // );

  mutate(`${URL}`);

  mutate(`${URL}/${id}`);
};
