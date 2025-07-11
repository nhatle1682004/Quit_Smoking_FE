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
      const response = await api.post("/login", values);
      const userData = response.data;
      const { role } = userData;

      // Gửi action để lưu thông tin user vào Redux store
      dispatch(login(userData));
      // Lưu token vào localStorage để duy trì đăng nhập
      localStorage.setItem("token", userData.token);

      toast.success("Đăng nhập thành công!");

      // Điều hướng dựa trên vai trò (role)
      if (role === "ADMIN") {
        navigate("/dashboard"); // Điều hướng ADMIN đến dashboard chung
      } else if (role === "COACH") {
        navigate("/dashboard-coach"); // Điều hướng COACH đến dashboard riêng
      } else if (role === "CUSTOMER") {
        // Kiểm tra xem CUSTOMER đã điền thông tin ban đầu chưa
        try {
          // Tạo config riêng cho request này để đảm bảo có token
          const apiConfig = {
            headers: { Authorization: `Bearer ${userData.token}` },
          };
          await api.get("/initial-condition/active", apiConfig);
          // Nếu request thành công (không ném lỗi 403/404), tức là đã có dữ liệu
          navigate("/"); // Điều hướng về trang chủ
        } catch (error) {
          // Nếu API trả về lỗi (ví dụ 403/404/500), tức là chưa có dữ liệu
          if (
            error.response?.status === 403 ||
            error.response?.status === 404 ||
            error.response?.status === 500
          ) {
            navigate("/initial-condition"); // Điều hướng đến trang điền thông tin
          } else {
            // Xử lý các lỗi mạng hoặc lỗi không mong muốn khác
            navigate("/");
          }
        }
      }
    } catch (e) {
      console.error(e);
      if (
        e.response &&
        (e.response.status === 401 || e.response.status === 400)
      ) {
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
