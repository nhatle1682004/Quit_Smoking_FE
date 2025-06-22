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
    <div>UserManagement</div>
  )
}

export default UserManagement;