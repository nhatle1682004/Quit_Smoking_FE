import React from "react";
import "./register.css";
import { Button, Checkbox, Form, Input } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

function RegisterForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);

    // 400: bad request
    // 200: success
    try {
      // values: thông tin người dùng nhập
      await api.post("register", values);
      toast.success("Tạo tài khoản thành công!");
      navigate("/login");
    } catch (e) {
      console.log(e);
      // show ra màn hình cho người dùng biết lỗi
      toast.error(e.response.data);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="register-form">
      <h1> Tạo tài khoản mới</h1>
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
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input prefix={<IdcardOutlined className="text-gray-400" />} placeholder="Nhập họ và tên của bạn" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Nhập email của bạn" />
        </Form.Item>

        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Nhập lại mật khẩu" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng Ký
          </Button>
        </Form.Item>
      </Form>

    </div>
  );
}

export default RegisterForm;
