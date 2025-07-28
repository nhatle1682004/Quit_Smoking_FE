// src/components/UserProfileDropdown.js
import React from "react";
import { Dropdown, Avatar, Divider, Space, Typography } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const { Text, Title } = Typography;

const UserProfileDropdown = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy thông tin user từ Redux store
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined style={{ fontSize: "20px", color: "#222" }} />,
      label: "Trang cá nhân",
    },
    // Thêm Dashboard cho admin hoặc coach
    ...(user?.role === "ADMIN" || user?.role === "COACH"
      ? [
          {
            key: "dashboard",
            icon: (
              <SettingOutlined style={{ fontSize: "20px", color: "#222" }} />
            ),
            label:
              user.role === "COACH" ? "Coach Dashboard" : "Admin Dashboard",
          },
        ]
      : []),
    {
      key: "my-package",
      icon: <CreditCardOutlined style={{ fontSize: "20px", color: "#222" }} />,
      label: "Gói của tôi",
    },
    {
      key: "plan-history-preview",
      icon: <HistoryOutlined style={{ fontSize: "20px", color: "#222" }} />,
      label: "Lịch sử kế hoạch",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: "20px" }} />,
      label: <span className="text-red-500">Đăng xuất</span>,
      danger: true,
    },
  ];

  const handleMenuClick = (key) => {
    switch (key) {
      case "profile":
        navigate("/profile");
        break;
      case "dashboard":
        if (user?.role === "COACH") {
          navigate("/dashboard-coach");
        } else {
          navigate("/dashboard");
        }
        break;
      case "schedule":
        navigate("/schedule");
        break;
      case "my-package":
        navigate("/user-package");
        break;
      case "plan-history-preview":
        navigate("/plan-history-preview");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "terms":
        navigate("/terms");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }

    // Gọi callback nếu có
    if (onMenuClick) {
      onMenuClick(key);
    }
  };

  const menu = (
    <div className="w-full sm:w-[300px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {/* Phần Header của Dropdown */}
      <div className="p-4 border-b border-gray-200">
        <Space>
          {/* Avatar removed */}
          <div>
            <Title level={5} className="!mb-0">
              {user?.username}
            </Title>
          </div>
        </Space>
      </div>

      {/* Các mục Menu */}
      <ul className="py-2">
        {menuItems.map((item) =>
          item.type === "divider" ? (
            <Divider key="divider" className="my-1" />
          ) : (
            <li
              key={item.key}
              onClick={() => handleMenuClick(item.key)}
              className="flex items-center gap-4 px-4 py-3 text-base text-[#222] cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <a
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Avatar
          size={40}
          src={user?.avatarUrl || undefined}
          style={
            user?.avatarUrl
              ? undefined
              : {
                  backgroundColor: stringToColor(user?.username || "User"),
                  fontWeight: "bold",
                  verticalAlign: "middle",
                }
          }
        >
          {!user?.avatarUrl && getLastWord(user?.username || "?")}
        </Avatar>
        <span className="font-semibold hidden sm:inline text-white">
          {user?.username}
        </span>
      </a>
    </Dropdown>
  );
};

export default UserProfileDropdown;

// Thêm các hàm giống như ở UserAvatar
const stringToColor = (str) => {
  const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068"];
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return colors[sum % colors.length];
};

const getLastWord = (name) => {
  if (!name || typeof name !== "string") return "?";
  const words = name.trim().split(/\s+/);
  return words.length > 0 ? words[words.length - 1] : "?";
};
