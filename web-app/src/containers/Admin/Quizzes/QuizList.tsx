import { Button, Card, List, PageHeader, Typography } from "antd";
import { ContentContainer } from "components/AppLayout";
import { Bouncer } from "components/Bouncer";
import { FC } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { removeQuiz } from "services/quiz";
import { useQuizList } from "services/quiz-list";

export const QuizList: FC = () => {
  const [quizzes] = useQuizList();

  const { url, path } = useRouteMatch();
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Quizzes"
        style={{ background: "white", marginBottom: "32px" }}
        extra={[
          <Link to={`${path}/new`} key="0">
            <Button type="primary">New Quiz</Button>
          </Link>,
        ]}
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
                <Bouncer permission="content:delete">
                  <Button
                    type="primary"
                    danger
                    onClick={() => removeQuiz(item.id)}
                  >
                    X
                  </Button>
                </Bouncer>
              </List.Item>
            )}
          />
        </Card>
      </ContentContainer>
    </>
  );
};
