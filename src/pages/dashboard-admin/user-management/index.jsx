import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import api from "./../../../configs/axios";
import { toast } from "react-toastify";

function UserManagement() {
  const { Text } = Typography;
  const [open, setOpen] = useState(false);
  const [datas, setDatas] = useState([]);
  // lấy dữ liệu gửi xuống back-end
  const handleSubmit = async (values) => {
    //value giá trị người dùng nhập trên form
    // nhiệm vụ: cầm cục data chuyển xuống cho back-end
    try {
      const token = localStorage.getItem("token");
      console.log("Token hiện tại:", token);
      const response = await api.post("user", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Thêm user thành công");
      setOpen(false);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  // lay du lieu
  const fetchUser = async () => {
    try {
      const response = await api.get("user");
      setDatas(response.data);
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  // xoa du lieu nguoi dung
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/user/${id}`);
      toast.success("Xóa người dùng thành công");
      fetchUser(); // load lại danh sách
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  // cap nhat du lieu nguoi dung
  const handleUpdate = async (id, values) => {
    try {
      const response = await api.put(`/user/${id}`, { active: false });
      toast.success("Cập nhật thành công");
      fetchUser(); // cập nhật lại danh sách
      setOpen(false); // đóng modal nếu cần
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.put(`/user/${id}`, { active: false });
      toast.success("Đã chuyển user sang inactive!");
      fetchUser(); // cập nhật lại danh sách user nếu cần
    } catch (error) {
      toast.error("Có lỗi khi chuyển trạng thái user!");
    }
  };

  const handleRestoreUser = async (user) => {
    if (!user.active) {
      try {
        await api.put(`/user/${user.id}/restore`);
        toast.success("Khôi phục tài khoản thành công!");
        fetchUser(); // cập nhật lại danh sách user nếu cần
      } catch (error) {
        toast.error("Khôi phục tài khoản thất bại!");
      }
    } else {
      toast.info("Tài khoản này đang hoạt động, không cần khôi phục.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      render: (avatarUrl) => (
        <Image
          width={60}
          height={60}
          src={avatarUrl}
          alt="avatar"
          style={{ objectFit: "cover", borderRadius: 8 }}
          fallback="https://via.placeholder.com/60x60?text=No+Img"
        />
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "ADMIN" ? "volcano" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => gender || "N/A",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "gray"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Premium",
      dataIndex: "premium",
      key: "premium",
      render: (premium) =>
        premium ? (
          <CheckCircleOutlined style={{ color: "green", fontSize: 18 }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red", fontSize: 18 }} />
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
          <Button onClick={() => handleRestoreUser(record)}>Khôi phục</Button>
        </Space>
      ),
    },
  ];

  // useEffect(d/n hanh dong,[]: d/n dependency list: khi nao thi hanh dong trc dc chay)
  // [] => chay 1 lan duy nhat khi load page
  // () => {} : goi la anonymous function vi la ham ko co ten
  // [name]: chay moi khi ma bien name thay doi
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add new User
      </Button>
      <Table columns={columns} dataSource={datas} />
      <Modal title="Add new User" open={open} onCancel={() => setOpen(false)}>
        <Form labelCol={{ span: 24 }} onFinish={handleSubmit}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Premium Account"
            name="premium"
            valuePropName="checked"
          >
            <Checkbox>Enable Premium</Checkbox>
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value="ADMIN">Admin</Select.Option>
              <Select.Option value="CUSTOMER">Customer</Select.Option>
              <Select.Option value="COACH">Coach</Select.Option>
            </Select>
          </Form.Item>

          {/* Nếu muốn thêm avatar URL:
  <Form.Item label="Avatar URL" name="avatarUrl">
    <Input placeholder="Paste avatar image URL (optional)" />
  </Form.Item>
  */}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create New User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
