import { Card, List, PageHeader, Typography } from "antd";
import { ContentContainer } from "components/AppLayout";
import { FC } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useQuizList } from "services/quiz-list";

export const QuizList: FC = () => {
  const [quizzes] = useQuizList();

  const { url } = useRouteMatch();

  return (
    <>
      <PageHeader
        title="Quizzes"
        style={{ background: "white", marginBottom: "32px" }}
      />
      <ContentContainer>
        <Card>
          <List
            header={<div>Quizzes</div>}
            bordered
            dataSource={quizzes}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>
                  <Link to={`${url.replace(/\/$/, "")}/${item.id}`}>
                    {item.title}
                  </Link>
                </Typography.Text>
              </List.Item>
            )}
          />
        </Card>
      </ContentContainer>
    </>
  );
};
