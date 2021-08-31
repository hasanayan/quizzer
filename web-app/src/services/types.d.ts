declare module API {
  export enum QuestionType {
    STRING_ANSWER = 0,
    SINGLE_CHOICE = 1,
    MULTIPLE_CHOICE = 2,
  }

  export type BaseQuestion = {
    id: string;
    title: string;
    type: QuestionType;
  };

  export type Option = {
    label: string;
    value: string;
  };

  export type SingleChoiceQuestion = BaseQuestion & {
    type: QuestionType.SINGLE_CHOICE;
    options: Option[];
    answer: string;
  };

  export type MultipleChoiceQuestion = BaseQuestion & {
    type: QuestionType.MULTIPLE_CHOICE;
    options: Option[];
    answer: string[];
  };

  export type StringAnswerQuestion = BaseQuestion & {
    type: QuestionType.STRING_ANSWER;
    answer: string;
  };

  export type Question =
    | SingleChoiceQuestion
    | MultipleChoiceQuestion
    | StringAnswerQuestion;

  export type Quiz = {
    id: string;
    title: string;
    questions: Question[];
  };
}
