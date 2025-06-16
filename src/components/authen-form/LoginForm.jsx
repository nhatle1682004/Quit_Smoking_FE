import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./login.css";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import GoogleLoginButton from "../authen-button/GoogleLoginButton";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

function LoginForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      const response = await api.post("login", values);
      console.log(response.data);
      const { role, fullName } = response.data;
      console.log(role, fullName);

      dispatch(login(response.data));
      localStorage.setItem("token", response.data.token);
      toast.success("Đăng nhập thành công!");
      if (role === "ADMIN") navigate("/dashboard");
      else if (role === "CUSTOMER") navigate("/");

    } catch (e) {
      console.log(e);
      toast.error(e.response.data);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-form">
      <h1>Đăng Nhập</h1>
      <Form
        name="basic"
        layout="vertical"
        labelCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Nhập tên đăng nhập"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Nhập mật khẩu"
          />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Đăng Nhập
          </Button>
        </Form.Item>
      </Form>

      <div className="divider">
        <span>hoặc</span>
      </div>

      <GoogleLoginButton />

      <p className="mt-4 text-center text-sm">
        Nếu chưa có tài khoản?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          Đăng ký
        </span>
      </p>
    </div>
  );
}
/*******  e13bf13f-099f-463c-ae63-6c0288d5afe7  *******/

export default LoginForm;
