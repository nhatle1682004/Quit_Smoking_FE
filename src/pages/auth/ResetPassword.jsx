import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import api from "../../configs/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    // Kiểm tra token có hợp lệ không
    if (!token) {
      setTokenValid(false);
      message.error("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
      return;
    }

    // Có thể thêm API call để xác thực token nếu cần
  }, [token]);

  const onFinish = async (values) => {
    if (!token) return;

    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password", {
        token: token,
        password: values.password,
      });
      setResetSuccess(true);
      message.success("Đặt lại mật khẩu thành công!");
    } catch (error) {
      message.error(
        error.response?.data || "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
      setTokenValid(false);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Link không hợp lệ</h1>
        <p className="mb-6">
          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </p>
        <Button onClick={() => navigate("/forgot-password")}>
          Yêu cầu link mới
        </Button>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          Đặt lại mật khẩu thành công!
        </h1>
        <p className="mb-6">Mật khẩu của bạn đã được cập nhật.</p>
        <Button type="primary" onClick={() => navigate("/login")}>
          Đăng nhập ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h1>
      <Form name="reset-password" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="password"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu mới"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Xác nhận đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
