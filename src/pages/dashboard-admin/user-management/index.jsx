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
        toast.success("User updated successfully");
      } else {
        await api.post("user", values);
        toast.success("User created successfully");
      }
      setOpen(false);
      form.resetFields();
      setEditingUserId(null);
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data || "An error occurred.");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("user");
      setDatas(response.data);
    } catch (error) {
      toast.error(error.response?.data || "Failed to fetch users.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      toast.success("User deleted successfully");
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data || "Failed to delete user.");
    }
  };

  const handleRestoreUser = async (user) => {
    if (!user.active) {
      try {
        await api.put(`/user/${user.id}/restore`);
        toast.success("Account restored successfully");
        fetchUser();
      } catch (error) {
        toast.error("Failed to restore account");
      }
    } else {
      toast.info("This account is already active.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
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
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
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
            title="Delete account"
            description="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            disabled={!record.active}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button onClick={() => handleRestoreUser(record)}>Restore</Button>
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
          setEditingUserId(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingUserId ? "Save" : "Create"}
      >
        <Form labelCol={{ span: 24 }} onFinish={handleSubmit} form={form}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              { required: true, message: "Please enter your full name!" },
              { min: 5, message: "Name must be at least 5 characters long." },
              {
                pattern: /^(?!\s).+$/,
                message: "Name cannot start with whitespace!",
              },
            ]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter a username!" },
              { min: 4, message: "Username must be at least 4 characters!" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "No spaces or special characters allowed!",
              },
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          {!editingUserId && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters!" },
                {
                  pattern: /^\S+$/,
                  message: "Password cannot contain spaces!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
          )}

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Radio.Group>
              <Radio value="MALE">Male</Radio>
              <Radio value="FEMALE">Female</Radio>
              
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value="ADMIN">Admin</Select.Option>
              <Select.Option value="CUSTOMER">Customer</Select.Option>
              <Select.Option value="COACH">Coach</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Premium Account"
            name="premium"
            valuePropName="checked"
          >
            <Checkbox>Enable Premium</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
