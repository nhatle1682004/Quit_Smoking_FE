import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./login.css";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import GoogleLoginButton from "../authen-button/GoogleLoginButton";

function LoginForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      // values: thông tin người dùng nhập
      const response = await api.post("login", values);
      console.log(response.data);
      //lưu thông tin đăng nhập của người dùng vào 1 chỗ nào đó mà bất kỳ đâu cũng có thể use được
      // cái đó gọi là redux == session bên môn prj
      toast.success("Login successful!");

      //dispatch: gui action den redux den redux store
      // action: la 1 object co 2 thuoc tinh la type va payload
      // type: la ten cua action
      dispatch(login(response.data.data));
      localStorage.setItem("token", response.data.data.token);
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
      toast.error("Login failed!");
      // show ra màn hình cho người dùng biết lỗi
      // toast.error(e.data.data);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-form">
      <h1>Login</h1>
      <Form
        name="basic"
        layout="vertical"
        labelCol={{ span: 24 }}
        // wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <GoogleLoginButton />
    </div>
  );
}
/*******  e13bf13f-099f-463c-ae63-6c0288d5afe7  *******/

export default LoginForm;
