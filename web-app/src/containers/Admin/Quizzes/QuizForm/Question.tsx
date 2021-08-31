import {
  Radio,
  Checkbox,
  Card,
  Row,
  Input,
  Space,
  Button,
  Select,
  Typography,
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import { nanoid } from "nanoid";
import { FC, useCallback } from "react";
import { useFormState } from "react-hook-form";
import { useWatch, useFieldArray, Controller, Control } from "react-hook-form";
import { QuestionType } from "services/constants";
import styled from "styled-components";

export const Question: FC<{
  index: number;
  className?: string;
  value?: API.Question;
  control: Control<API.Quiz, object>;
  onClickRemove: (index: any) => any;
}> = ({ index, className, value, control, onClickRemove }) => {
  const type = useWatch({
    name: `questions.${index}.type`,
  });

  const { fields, append, remove } = useFieldArray({
    name: `questions.${index}.options`,
    control: control,
  });

  const options = fields as unknown as API.Option[];

  const appendOption = useCallback(() => {
    append({ label: "New Option", value: nanoid() });
  }, [append]);

  const removeOptionAt = useCallback(
    (index: number) => {
      remove([index]);
    },
    [remove]
  );

  const { errors } = useFormState();

  useWatch({ name: `questions.${index}.options` });

  const OptionComponent =
    type === QuestionType.SINGLE_CHOICE ? Radio : Checkbox;

  return (
    <Card className={className} bordered>
      <Row>
        <Controller
          name={`questions.${index}.title`}
          render={({ field, formState: { errors } }) => (
            <FormItem
              hasFeedback={Boolean(errors.questions?.[index]?.title)}
              help={errors.questions?.[index]?.title?.message}
              validateStatus={
                errors.questions?.[index]?.title ? "error" : undefined
              }
              style={{ flexGrow: 1, marginRight: "8px" }}
            >
              <GrowingInput placeholder="Question" {...field} />
            </FormItem>
          )}
        />

        <Controller
          name={`questions.${index}.type`}
          render={({ field, formState: { errors } }) => (
            <FormItem
              hasFeedback={Boolean(errors.questions?.[index]?.type)}
              help={errors.questions?.[index]?.type?.message}
              validateStatus={
                errors.questions?.[index]?.type ? "error" : undefined
              }
            >
              <Select
                placeholder="Type"
                style={{ width: "160px" }}
                options={questionTypeOptions}
                {...field}
              />
            </FormItem>
          )}
        />
      </Row>
      <br />
      {type === QuestionType.STRING_ANSWER && (
        <Controller
          name={`questions.${index}.answer`}
          render={({ field, formState: { errors } }) => (
            <FormItem
              hasFeedback={Boolean(errors.questions?.[index]?.answer)}
              help={errors.questions?.[index]?.answer?.message}
              validateStatus={
                errors.questions?.[index]?.answer ? "error" : undefined
              }
              style={{ flexGrow: 1, marginRight: "8px" }}
              initialValue={value?.answer || ""}
            >
              <GrowingInput placeholder="Answer" {...field} />
            </FormItem>
          )}
        />
      )}
      {(type === QuestionType.SINGLE_CHOICE ||
        type === QuestionType.MULTIPLE_CHOICE) && (
        <>
          <Controller
            name={`questions.${index}.answer`}
            shouldUnregister
            defaultValue={
              type === QuestionType.MULTIPLE_CHOICE ? [] : undefined
            }
            render={({ field, formState: { errors } }) => (
              <FormItem
                hasFeedback={Boolean(errors.questions?.[index]?.answer)}
                help={errors.questions?.[index]?.answer?.message}
                validateStatus={
                  errors.questions?.[index]?.answer ? "error" : undefined
                }
                style={{ flexGrow: 1, marginRight: "8px", marginBottom: 0 }}
              >
                <OptionComponent.Group
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="option-container"
                  {...field}
                >
                  {options.map((option, optionIndex) => (
                    <OptionComponent
                      value={option.value}
                      //@ts-expect-error
                      key={option.id}
                      style={{ marginLeft: 0 }}
                    >
                      <Space>
                        <Controller
                          control={control}
                          name={`questions.${index}.options.${optionIndex}`}
                          render={({ field }) => (
                            <FormItem
                              name={`questions.${index}.options.${optionIndex}`}
                              hasFeedback={Boolean(
                                errors[
                                  `questions.${index}.options.${optionIndex}`
                                ]
                              )}
                              validateStatus={
                                errors[
                                  `questions.${index}.options.${optionIndex}`
                                ]
                                  ? "error"
                                  : undefined
                              }
                              help={
                                errors[
                                  `questions.${index}.options.${optionIndex}`
                                ]?.message
                              }
                              initialValue={option.label}
                            >
                              <Input
                                placeholder="Type option here"
                                value={field.value || option.value}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange({
                                    label: value,
                                    value: option.value,
                                  });
                                }}
                              />
                            </FormItem>
                          )}
                        />

                        {options.length > 1 && (
                          <Button
                            onClick={() => {
                              removeOptionAt(optionIndex);
                            }}
                            size="small"
                            style={{ marginBottom: "22px" }}
                          >
                            X
                          </Button>
                        )}
                      </Space>
                    </OptionComponent>
                  ))}
                </OptionComponent.Group>
              </FormItem>
            )}
          />
          <Button
            onClick={() => appendOption()}
            type="default"
            style={{ color: "#1890ff", marginLeft: "24px" }}
            htmlType="button"
          >
            Add Option
          </Button>

          {errors.questions?.[index].options && (
            <Typography.Paragraph type="danger">
              {errors.questions?.[index].options.message}
            </Typography.Paragraph>
          )}
        </>
      )}
      <div style={{ marginTop: "32px" }}>
        <Button danger onClick={() => onClickRemove(index)}>
          Remove Question
        </Button>
      </div>
    </Card>
  );
};

const GrowingInput = styled(Input)`
  flex-grow: 1;
  margin-right: 8px;
`;

const questionTypeOptions = [
  { label: "Typed Answer", value: QuestionType.STRING_ANSWER },
  { label: "Single Choice", value: QuestionType.SINGLE_CHOICE },
  {
    label: "Multiple Choice",
    value: QuestionType.MULTIPLE_CHOICE,
  },
];
