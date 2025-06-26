import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  message,
  Radio,
  Image,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  ManOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { updateUser } from "../../../redux/features/userSlice";
import api from "../../../configs/axios";

const Profile = () => {
  const { Title, Text } = Typography;
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize Ant Design form fields with Redux user data
  useEffect(() => {
    // Chỉ setFieldsValue khi user có dữ liệu và form đã sẵn sàng
    if (user && form) {
      form.setFieldsValue({
        fullName: user.fullName || "",
        gender: user.gender || "MALE", // Đảm bảo có giá trị mặc định
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user, form]); // Thêm 'form' vào dependency array

  const handleSubmit = async (values) => {
    console.log("Form submission initiated. Values:", values); // DEBUG
    setIsLoading(true);
    try {
      // ===== BƯỚC GỠ LỖI: Giả lập cuộc gọi API =====
      console.log("Bắt đầu giả lập cuộc gọi API trong 2 giây...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Giả sử API trả về thành công với dữ liệu đã cập nhật
      const updatedFields = values;
      console.log("Giả lập API thành công!", updatedFields);
      // ===============================================

      /*
      // ----- MÃ GỐC (TẠM THỜI VÔ HIỆU HÓA) -----
      const token = user?.token;

      if (!token) {
        message.error("Xác thực không thành công. Vui lòng đăng nhập lại.");
        setIsLoading(false);
        return;
      }

      const response = await api.put("user/me", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedFields = response.data;
      // -----------------------------------------
      */

      const updatedUserData = {
        ...user,
        ...updatedFields,
      };

      dispatch(updateUser(updatedUserData));
      message.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi khi cập nhật hồ sơ.";
      message.error(errorMessage);
      console.error("Lỗi khi gửi form:", err); // Log lỗi chi tiết hơn
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại thông tin đã nhập!");
  };

  const cancelEdit = () => {
    // Reset form fields to original user values from Redux
    form.setFieldsValue({
      fullName: user?.fullName || "",
      gender: user?.gender || "MALE",
      avatarUrl: user?.avatarUrl || "",
    });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "30px", color: "#1890ff" }}
      >
        <span
          style={{ borderBottom: "3px solid #1890ff", paddingBottom: "5px" }}
        >
          Hồ Sơ Cá Nhân
        </span>
      </Title>

      <Card
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Image
            width={120}
            height={120}
            src={user?.avatarUrl}
            alt="Avatar"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #f0f0f0",
            }}
            fallback="https://via.placeholder.com/120?text=No+Avatar"
          />
        </div>

        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit} // Ant Design's way to handle submission
            onFinishFailed={onFinishFailed} // DEBUG: Add this to see validation errors
            // initialValues được thiết lập lại mỗi khi component render nếu isEditing thay đổi
            // Điều này đảm bảo form luôn bắt đầu với giá trị đúng từ Redux user
            initialValues={{
              fullName: user?.fullName || "",
              gender: user?.gender || "MALE",
              avatarUrl: user?.avatarUrl || "",
            }}
          >
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên!" },
                { min: 5, message: "Họ tên phải có ít nhất 5 ký tự." },
                {
                  pattern: /^(?!\s).+$/,
                  message: "Họ tên không được bắt đầu bằng khoảng trắng!",
                },
              ]}
            >
              <Input placeholder="Nhập họ tên đầy đủ" />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Radio.Group>
                <Radio value="MALE">Nam</Radio>
                <Radio value="FEMALE">Nữ</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Avatar (URL)"
              name="avatarUrl"
              // `required: true` có thể là nguyên nhân nếu người dùng không muốn set avatar
              // Hãy cân nhắc nếu avatar là bắt buộc hay tùy chọn.
              // Nếu tùy chọn, bỏ `required: true`
              rules={[{ type: "url", message: "Phải là một URL hợp lệ!" }]}
            >
              <Input placeholder="https://example.com/avatar.jpg" />
            </Form.Item>

            {form.getFieldValue("avatarUrl") && (
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <Image
                  width={100}
                  height={100}
                  src={form.getFieldValue("avatarUrl")}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                  fallback="https://via.placeholder.com/100x100?text=No+Img"
                />
                <Text
                  type="secondary"
                  style={{ display: "block", marginTop: "8px" }}
                >
                  Xem trước ảnh đại diện
                </Text>
              </div>
            )}

            <Space
              size="middle"
              style={{
                width: "100%",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                type="default"
                onClick={cancelEdit}
                disabled={isLoading}
                icon={<CloseOutlined />}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<SaveOutlined />}
              >
                Lưu thay đổi
              </Button>
            </Space>
          </Form>
        ) : (
          <div className="space-y-4">
            <div style={{ marginBottom: "16px" }}>
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "12px" }}
              >
                Họ tên
              </Text>
              <Space>
                <UserOutlined style={{ color: "#1890ff" }} />
                <Text strong>{user?.fullName || "Chưa cập nhật"}</Text>
              </Space>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "12px" }}
              >
                Tên đăng nhập
              </Text>
              <Space>
                <UserOutlined style={{ color: "#1890ff" }} />
                <Text strong>{user?.username || "Chưa cập nhật"}</Text>
              </Space>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "12px" }}
              >
                Email
              </Text>
              <Space>
                <MailOutlined style={{ color: "#1890ff" }} />
                <Text strong>{user?.email || "Chưa cập nhật"}</Text>
              </Space>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "12px" }}
              >
                Giới tính
              </Text>
              <Space>
                <ManOutlined style={{ color: "#1890ff" }} />
                <Text strong>
                  {user?.gender === "MALE"
                    ? "Nam"
                    : user?.gender === "FEMALE"
                    ? "Nữ"
                    : "Chưa cập nhật"}
                </Text>
              </Space>
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
              style={{ marginTop: "24px" }}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
