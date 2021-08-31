import { FC } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useIsPermitted } from "hooks/use-is-permitted";
import { useAuth0 } from "@auth0/auth0-react";

export const AppLayout: FC = ({ children }) => {
  const hasAdminAccess = useIsPermitted("admin");
  const { user, logout } = useAuth0();
  return (
    <StyledLayout>
      <Layout.Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item className="active" key="/">
            <Link to="/">Home</Link>
          </Menu.Item>

          {hasAdminAccess && (
            <Menu.Item className="active" key="/admin">
              <Link to="/admin">Admin</Link>
            </Menu.Item>
          )}
          <Menu.Item style={{ marginLeft: "auto" }} key="username">
            {user?.name}
          </Menu.Item>
          <Menu.Item key="logout" onClick={() => logout()}>
            Logout
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content>{children}</Layout.Content>
      <Layout.Footer>Quizzer 2021 Created by Hasan Ayan</Layout.Footer>
    </StyledLayout>
  );
};

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: rgb(250, 250, 250);
`;

export const ContentContainer = styled.div`
  width: 748px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 32px 0;
`;
