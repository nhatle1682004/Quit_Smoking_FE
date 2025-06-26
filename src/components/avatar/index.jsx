import React from "react";
import { Avatar } from "antd";

/* Sinh màu nền từ tên */
const stringToColor = (str) => {
  const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068"];
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return colors[sum % colors.length];
};

/* Lấy từ cuối tên */
const getLastWord = (name) => {
  if (!name || typeof name !== "string") return "?";
  const words = name.trim().split(/\s+/);
  return words.length > 0 ? words[words.length - 1] : "?";
};

/* Avatar Component */
const UserAvatar = ({ fullName = "?", avatarUrl = "", size = 32 }) => {
  const hasImage = avatarUrl && avatarUrl.trim() !== "";

  return hasImage ? (
    <Avatar
      size={size}
      src={avatarUrl}
      alt={getLastWord(fullName)}
    />
  ) : (
    <Avatar
      size={size}
      style={{
        backgroundColor: stringToColor(fullName),
        fontWeight: "bold",
        verticalAlign: "middle",
      }}
    >
      {getLastWord(fullName)}
    </Avatar>
  );
};

export default UserAvatar;
