import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post("/forgot-password", { email: values.email });
      setSent(true);
      message.success("Một email đặt lại mật khẩu đã được gửi!");
    } catch (error) {
      message.error(
        error.response?.data || "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Quên Mật Khẩu</h1>

      {sent ? (
        <div className="text-center">
          <p className="mb-4">
            Chúng tôi đã gửi email với hướng dẫn đặt lại mật khẩu.
          </p>
          <p className="mb-4">
            Vui lòng kiểm tra email của bạn và làm theo hướng dẫn.
          </p>
          <Button onClick={() => navigate("/login")}>Quay lại đăng nhập</Button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để
            đặt lại mật khẩu.
          </p>
          <Form name="forgot-password" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email của bạn"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
              >
                Gửi liên kết đặt lại
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center mt-4">
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Quay lại đăng nhập
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
