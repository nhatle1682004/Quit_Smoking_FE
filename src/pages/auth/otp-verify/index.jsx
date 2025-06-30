import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../configs/axios";

const OtpVerify = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const emailInState = location.state?.email || "";

  const onFinish = async (values) => {
    const { email, otp, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/forgot-password/verify", {
        email,
        otp,
        newPassword,
      });

      message.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      message.error(
        error.response?.data ||
          "Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-center text-xl font-semibold mb-2">
        Đặt lại mật khẩu
      </h1>

      <p className="text-center mb-6">
        Nhập mã OTP đã gửi về email và đặt lại mật khẩu của bạn.
      </p>

      <Form
        name="otp-verify"
        layout="vertical"
        initialValues={{ email: emailInState }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input disabled={!!emailInState} />
        </Form.Item>

        <Form.Item
          name="otp"
          label="Mã OTP"
          rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
        >
          <Input placeholder="Nhập mã OTP" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải tối thiểu 6 ký tự!" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu xác nhận không khớp!");
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Xác thực & Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-4 text-gray-500 text-xs text-center">
        Lưu ý: Mã OTP chỉ có hiệu lực trong 5&nbsp;phút.<br />
        Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
      </div>
    </div>
  );
};

export default OtpVerify;
