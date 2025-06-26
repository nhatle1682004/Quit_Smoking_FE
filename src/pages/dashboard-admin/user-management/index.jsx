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
        toast.success("User updated successfully!");
      } else {
        await api.post("user", values);
        toast.success("New user created successfully!");
      }

      setOpen(false);
      fetchUser();
      form.resetFields();
      setEditingUserId(null);
    } catch (err) {
      toast.error(err.response?.data || "An error occurred");
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
      toast.error(error.response?.data || "Failed to load users");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      toast.success("User deleted successfully");
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data || "Delete failed");
    }
  };

  const handleRestoreUser = async (user) => {
    if (!user.active) {
      try {
        await api.put(`/user/${user.id}/restore`);
        toast.success("User restored successfully!");
        fetchUser();
      } catch (error) {
        toast.error("Restore failed!");
      }
    } else {
      toast.info("This account is already active.");
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
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            disabled={!record.active}
          >
            <Button type="primary" danger disabled={!record.active}>
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
      {/* Nút thêm người dùng */}
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          setEditingUserId(null);
          form.resetFields();
        }}
      >
        Add New User
      </Button>

      {/* Bảng dữ liệu người dùng */}
      <Table columns={columns} dataSource={datas} rowKey="id" />

      {/* Modal thêm/sửa người dùng */}
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
          {/* Họ và tên */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              { required: true, message: "Please enter full name!" },
              { min: 5, message: "Name must be at least 5 characters." },
              {
                pattern: /^(?!\s).+$/,
                message: "Name cannot start with a space!",
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          {/* Tên đăng nhập */}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter username!" },


              { min: 3, message: "Username must be at least 3 characters!" },


              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "No spaces or special characters allowed!",
              },
            ]}
          >

            {/* <Input placeholder="Enter username" readOnly={!!editingUserId} /> */}


            <Input
              placeholder="Enter username"
              readOnly={!!editingUserId} // Nếu đang sửa thì không cho chỉnh username
            />
          </Form.Item>

          {/* Email */}
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

          {/* Giới tính */}
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

          {/* Mật khẩu - chỉ hiển thị khi tạo mới */}
          {!editingUserId && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password!" },
                { min: 6, message: "Password must be at least 6 characters." },
                {
                  pattern: /^\S+$/,
                  message: "Password cannot contain spaces!",
                },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          {/* Tài khoản Premium */}
          <Form.Item
            label="Premium Account"
            name="premium"
            valuePropName="checked"
          >
            <Checkbox>Enable Premium</Checkbox>
          </Form.Item>

          {/* Vai trò */}
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select placeholder="Select role">

    
              <Select.Option value="CUSTOMER">Customer</Select.Option>
              <Select.Option value="COACH">Coach</Select.Option>
            </Select>
          </Form.Item>

          {/* Nút submit */}
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
