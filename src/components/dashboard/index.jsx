import React, { useState } from "react";
import {
  BellOutlined,
  DollarOutlined,
  FileOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Button, Avatar, Dropdown } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";

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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

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
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            width: "100%",
            padding: "0 24px"
          }}>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              Dashboard
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px" }}>
                Xin chào, {user?.fullName || user?.username || "User"}
              </span>
              <Avatar 
                style={{ 
                  backgroundColor: user?.avatarUrl ? 'transparent' : '#1890ff',
                  backgroundImage: user?.avatarUrl ? `url(${user.avatarUrl})` : 'none'
                }}
              >
                {!user?.avatarUrl && (user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U")}
              </Avatar>
              <Button 
                type="primary" 
                danger
                icon={<LogoutOutlined />} 
                onClick={handleLogout}
                size="small"
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </Header>
       
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
