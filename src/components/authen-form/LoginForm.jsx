import React from "react";
import { Button, Checkbox, Form, Input, Select } from "antd";
import "./login.css";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { Link, useNavigate } from "react-router-dom";
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
      // values nguoi dung nhap
      const response = await api.post("login", values);
      console.log(response.data);
      // luu thong tin nguoi dung nhap vao 1 cho nao do ma bat ky dau cung su dung duoc
      // cai do goi la redux === session ben mon prj
      const { role, token } = response.data;
      console.log(role, token);

      //Gửi một action có tên login đến Redux store để cập nhật trạng thái đăng nhập.
      // action la 1 doi tuong co 2 thuoc tinh la type va payload
      // type: la ten cua action
      //payload: Là dữ liệu bạn muốn gửi kèm hành động, dùng để cập nhật vào state
      dispatch(login(response.data));
      localStorage.setItem("token", response.data.token);
      toast.success("Đăng nhập thành công!");


      if (role === "ADMIN" || role === "COACH") {
        navigate("/dashboard");
      } else if (role === "CUSTOMER") {
        try {
          const response = await api.get('/initial-condition/active');
          if (response.data) {
            console.log("Init condition:", response.data)
            navigate('/');
          } else {
            if (error.response?.status == 403) {
              navigate('/initial-condition');
            }
          }
        } catch (error) {
          if (error.response?.status == 403 || error.response?.status == 500) {
            navigate('/initial-condition');
            console.log("Init condition:", response.data)
          }
        }
      }
    } catch (e) {
      console.log(e);
      if (e.response && (e.response.status === 401 || e.response.status === 400)) {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      } else {
        toast.error("Đăng nhập thất bại!");
      }
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
           <Link to="/forgot-password">Quên mật khẩu?</Link>

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
export default LoginForm;
