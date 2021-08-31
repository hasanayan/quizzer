import { Button, Input, Card, PageHeader, Form, Typography } from "antd";
import { FC } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";
import styled from "styled-components";
import { useCallback } from "react";
import { upsertQuiz } from "services/quiz";
import { useHistory } from "react-router";
import { Question } from "./Question";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { QuestionType } from "services/constants";
import FormItem from "antd/lib/form/FormItem";

const validationSchema = Joi.object({
  title: Joi.string().label("Title").required(),
  questions: Joi.array()
    .label("Questions")
    .min(1)
    .required()
    .items(
      Joi.object({
        title: Joi.string().label("Title").required(),
        answer: Joi.when("type", {
          is: QuestionType.MULTIPLE_CHOICE,
          then: Joi.array().items(Joi.string()).required(),
          otherwise: Joi.string().empty("").required(),
        })
          .label("Answer")
          .required(),
        type: Joi.any().required().label("Type"),
        options: Joi.when("type", {
          not: QuestionType.STRING_ANSWER,
          then: Joi.array().min(2).required(),
        }).label("Options"),
      }).unknown(true)
    ),
}).unknown(true);

const resolver = joiResolver(validationSchema);
export const QuizForm: FC<{ value?: API.Quiz }> = ({ value }) => {
  const history = useHistory();
  const formMethods = useForm<API.Quiz>({
    defaultValues: value,
    resolver,
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: "questions",
    shouldUnregister: true,
  });

  const onSubmit = useCallback(
    (values: API.Quiz) => {
      upsertQuiz(values);
      history.push("/admin/quizzes");
    },
    [history]
  );

  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => history.push("/admin/quizzes")}
        title="New Quiz"
        style={{ background: "white", marginBottom: "32px" }}
        extra={[
          <Button type="primary" key="0" htmlType="submit" form="quiz-form">
            Submit
          </Button>,
        ]}
      />

      <Form
        onSubmitCapture={formMethods.handleSubmit(onSubmit)}
        id="quiz-form"
        initialValues={value}
      >
        <Container>
          <FormProvider {...formMethods}>
            <Card style={{ background: "white", marginBottom: "32px" }}>
              <Controller
                name="title"
                control={formMethods.control}
                render={({ field, formState: { errors } }) => {
                  return (
                    <>
                      <FormItem
                        help={errors.title?.message}
                        validateStatus={errors.title ? "error" : undefined}
                        hasFeedback={!!errors.title}
                      >
                        <Input placeholder="Quiz Name" {...field} />
                      </FormItem>
                      {errors.questions?.message && (
                        <Typography.Text type="danger">
                          {errors.questions?.message}
                        </Typography.Text>
                      )}
                    </>
                  );
                }}
              />
            </Card>

            {fields.map((value, index) => {
              return (
                <StyledQuestion
                  key={value.id}
                  index={index}
                  value={value}
                  control={formMethods.control}
                  onClickRemove={remove}
                />
              );
            })}
          </FormProvider>
          <Button
            onClick={() => append({})}
            type="dashed"
            style={{ color: "#1890ff" }}
          >
            Add Question
          </Button>
        </Container>
      </Form>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 748px;
  margin: 0 auto;
  padding-bottom: 32px;
`;

const StyledQuestion = styled(Question)`
  margin-bottom: 32px;
  .option-container {
    & > * {
      margin-bottom: 8px;
    }
  }
`;
