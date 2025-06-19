import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Radio,
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
import { useForm } from "antd/es/form/Form";

function UserManagement() {
  const { Text } = Typography;
  const [open, setOpen] = useState(false);
  const [datas, setDatas] = useState([]);
  const [form] = useForm();
  const [editingUserId, setEditingUserId] = useState(null);

  const handleSubmit = async (values) => {
    try {
      if (editingUserId) {
        await api.put(`/user/${editingUserId}`, values);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await api.post("user", values);
        toast.success("Tạo người dùng mới thành công!");
      }

      setOpen(false);
      fetchUser();
      form.resetFields();
      setEditingUserId(null);
    } catch (err) {
      toast.error(err.response?.data || "Đã xảy ra lỗi");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("user");
      const users = response.data.map((user) => ({
        ...user,
        active: user.active === true || user.active === "true",
      }));
      setDatas(users);
    } catch (error) {
      toast.error(error.response?.data || "Không thể tải người dùng");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      toast.success("Xóa người dùng thành công");
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data || "Xóa thất bại");
    }
  };

  const handleRestoreUser = async (user) => {
    if (!user.active) {
      try {
        await api.put(`/user/${user.id}/restore`);
        toast.success("Khôi phục tài khoản thành công!");
        fetchUser();
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
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
              setEditingUserId(record.id);
              form.setFieldsValue(record);
            }}
            disabled={!record.active}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            disabled={!record.active}
          >
            <Button type="primary" danger disabled={!record.active}>
              Delete
            </Button>
          </Popconfirm>
          <Button onClick={() => handleRestoreUser(record)}>Khôi phục</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          setEditingUserId(null);
          form.resetFields();
        }}
      >
        Add new User
      </Button>

      <Table columns={columns} dataSource={datas} rowKey="id" />

      <Modal
        title={editingUserId ? "Edit User" : "Add New User"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingUserId(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleSubmit}
          layout="vertical"
        >
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
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
              <Radio value="other">Khác</Radio>
            </Radio.Group>
          </Form.Item>

          {!editingUserId && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingUserId ? "Update User" : "Create New User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
