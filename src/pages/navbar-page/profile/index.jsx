import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Card,
  Typography,
  Divider,
  Space,
  Tabs,
  Popconfirm,
} from "antd";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import ProfileInitialCondition from "../../../components/profile-initial-condition";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/userSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  // Fetch account information
  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/me");
      console.log(response.data);
      setProfile(response.data);
      form.setFieldsValue(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tải thông tin cá nhân");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------------------- Submit handlers ---------------------- */
  const handleSubmitProfile = async (values) => {
    try {
      const response = await api.put("/user/me", values);
      setProfile(response.data);
      console.log(response.data.phoneNumber);
      form.setFieldsValue(response.data);
      toast.success("Cập nhật thông tin cá nhân thành công!");
      setEditing(false);
    } catch (err) {
      console.log(err);
      toast.error("Cập nhật thông tin cá nhân không thành công");
    }
  };

  const dispatch = useDispatch();

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/user/me");

      // Xóa localStorage nếu bạn lưu token ở đó
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch(logout());
      toast.success("Xóa tài khoản thành công!");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Xóa tài khoản không thành công");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <Title level={2} className="text-center">
            Thông tin tài khoản
          </Title>

          <Tabs defaultActiveKey="1" className="mb-4">
            <Tabs.TabPane tab="Thông tin tài khoản" key="1">
              <Card bordered={false}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmitProfile}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="fullName"
                      label="Họ và tên"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên" },
                        {
                          min: 5,
                          message: "Họ và tên phải có ít nhất 5 ký tự!",
                        },
                        {
                          pattern: /^(?!\s)[A-Za-zÀ-ỹ\s]+$/,
                          message:
                            "Họ và tên không được bắt đầu bằng khoảng trắng, chứa số hoặc ký tự đặc biệt!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập họ tên" disabled={!editing} />
                    </Form.Item>

                    <Form.Item
                      name="gender"
                      label="Giới tính"
                      rules={[
                        { required: true, message: "Vui lòng chọn giới tính" },
                      ]}
                    >
                      <Select placeholder="Chọn giới tính" disabled={!editing}>
                        <Option value="MALE">Nam</Option>
                        <Option value="FEMALE">Nữ</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                      <Input disabled />
                    </Form.Item>

                    <Form.Item name="username" label="Tên đăng nhập">
                      <Input disabled />
                    </Form.Item>

                    <Form.Item
                      name="phoneNumber"
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                        {
                          pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b$/,
                          message: "Số điện thoại không hợp lệ!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập số điện thoại"
                        disabled={!editing}
                      />
                    </Form.Item>
                  </div>

                  {profile?.premium !== undefined && (
                    <>
                      <Divider />
                      <Text strong>Trạng thái tài khoản: </Text>
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          profile.premium
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      ></span>
                    </>
                  )}

                  <Divider />
                  <Space>
                    {editing ? (
                      <>
                        <Button
                          type="primary"
                          onClick={() => form.submit()}
                          htmlType="submit"
                        >
                          Lưu
                        </Button>
                        <Button
                          onClick={() => {
                            form.setFieldsValue(profile);
                            setEditing(false);
                          }}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          icon={<LockOutlined />}
                          onClick={() => navigate("/reset-password")}
                        >
                          Đổi mật khẩu
                        </Button>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => setEditing(true)}
                        >
                          Chỉnh sửa thông tin cá nhân
                        </Button>

                        <Popconfirm
                          title="Bạn chắc chắn muốn xóa tài khoản?"
                          description="Thao tác này không thể hoàn tác. Bạn có chắc chắn không?"
                          okText="Xác nhận"
                          cancelText="Hủy"
                          onConfirm={handleDeleteAccount}
                          okButtonProps={{ danger: true }}
                        >
                          <Button danger>Xóa tài khoản</Button>
                        </Popconfirm>
                      </>
                    )}
                  </Space>
                </Form>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Thông tin khai báo" key="2">
              <ProfileInitialCondition />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
