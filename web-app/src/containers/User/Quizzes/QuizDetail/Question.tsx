import { Checkbox, Input, Radio, Button, Typography } from "antd";
import { useState } from "react";
import { FC } from "react";
import { QuestionType } from "services/constants";
import styled from "styled-components";

type Answer = string | string[];

export const Question: FC<{
  question: API.Question;
  answer?: Answer;
  onClickNext: (answer: Answer) => any;
  onClickPrevious?: (answer: Answer) => any;
}> = ({
  question,
  answer: previouslySelectedAnswer,
  onClickNext,
  onClickPrevious,
}) => {
  const [answer, setAnswer] = useState<Answer>(previouslySelectedAnswer || "");

  return (
    <Container>
      <Typography.Paragraph style={{ marginBottom: "32px" }}>
        {question.title}
      </Typography.Paragraph>
      {question.type === QuestionType.STRING_ANSWER && (
        <Input
          value={answer as string}
          onChange={(e) => {
            const value = e.target.value;
            setAnswer(value);
          }}
        />
      )}
      {question.type === QuestionType.MULTIPLE_CHOICE && (
        <Checkbox.Group
          options={question.options}
          onChange={(e) => setAnswer(e as string[])}
          value={answer as string[]}
        />
      )}
      {question.type === QuestionType.SINGLE_CHOICE && (
        <Radio.Group
          options={question.options}
          onChange={(e) => setAnswer(e.target.value)}
          value={answer as string[]}
        />
      )}
      <div style={{ marginTop: "32px", display: "flex" }}>
        {onClickPrevious && (
          <Button
            onClick={() => {
              onClickPrevious(answer);
            }}
          >
            Previous
          </Button>
        )}
        <Button
          onClick={() => {
            onClickNext(answer);
          }}
          style={{ flexGrow: 1, marginLeft: "8px" }}
          type="primary"
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
