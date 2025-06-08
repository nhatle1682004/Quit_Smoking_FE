import React, { useState } from "react";
import {
  BellOutlined,
  DollarOutlined,
  FileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,
  };
}
const items = [
  getItem("Notifications", "notifications", <BellOutlined />),
  getItem("Blog Moderation", "blogModeration", <FileOutlined />),
  getItem("Upgrade Suggestions", "upgradeSuggestions", <DollarOutlined />),
  getItem("User Management", "userManagement", <UserOutlined />),

  //     getItem("Tom", "3"),
  //     getItem("Bill", "4"),
  //     getItem("Alex", "5"),
  //   ]),
  //   getItem("Team", "sub2", <TeamOutlined />, [
  //     getItem("Team 1", "6"),
  //     getItem("Team 2", "8"),
  //   ]),
  //   getItem("Files", "9", <FileOutlined />),
];
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
       
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "User" }, { title: "Bill" }]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet/>
             {/* khi nguời dùng ấn item bên tay trái lập tức render children vô outlet */}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
