import React from "react";
import "./register.css";
import { Button, Checkbox, Form, Input, Radio } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

function RegisterForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      await api.post("register", values);
      toast.success("Tạo tài khoản thành công!");
      navigate("/login");
    } catch (e) {
      console.log(e);
      const msg =
        e.response?.data?.message || e.response?.data || "Đăng ký thất bại";
      const lowerMsg = msg.toLowerCase();

      if (lowerMsg.includes("username")) {
        toast.error("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác!");
      } else if (lowerMsg.includes("email")) {
        toast.error("Email đã được sử dụng. Vui lòng dùng email khác!");
      } else {
        toast.error(msg);
      }
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
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="fullName"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên!" },
            { min: 5, message: "Họ và tên phải có ít nhất 5 ký tự!" },
            {
              pattern: /^(?!\s)[A-Za-zÀ-ỹ\s]+$/,
              message:
                "Họ và tên không được bắt đầu bằng khoảng trắng, chứa số hoặc ký tự đặc biệt!",
            },
          ]}
        >
          <Input
            prefix={<IdcardOutlined className="text-gray-400" />}
            placeholder="Nhập họ và tên của bạn"
          />
        </Form.Item>

        <Form.Item
          // label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Nhập email của bạn"
          />
        </Form.Item>

        <Form.Item
          // label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập!" },

            { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },

            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: "Không khoảng trắng hoặc ký tự đặc biệt!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Nhập tên đăng nhập"
          />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined className="text-gray-400" />}
            placeholder="Nhập số điện thoại"
          />
        </Form.Item>

        <Form.Item
          // label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
            {
              pattern: /^\S+$/,
              message: "Không được chứa khoảng trắng!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Nhập mật khẩu"
          />
        </Form.Item>

        <Form.Item
          // label="Xác nhận mật khẩu"
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
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Nhập lại mật khẩu"
          />
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng Ký
          </Button>
        </Form.Item>

        <Form.Item className="!mb-0">
          <div className="text-center mt-4">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegisterForm;
