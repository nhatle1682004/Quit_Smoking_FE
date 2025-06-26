import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Card,
  Flex,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons"; // Import Ant Design Icons
import { toast } from "react-toastify"; // Ensure react-toastify is installed and configured
import React, { useEffect, useState } from "react";
import api from "./../../../configs/axios"; // Assuming this is correctly configured
import { useForm } from "antd/es/form/Form";

// Make sure react-toastify's CSS is imported in your main App.js or index.js
// import 'react-toastify/dist/ReactToastify.css';

function CoachManagement() {
  const { Title, Text } = Typography;
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state for table
  const [isModalLoading, setIsModalLoading] = useState(false); // Added loading state for modal form submission

  // Fetch danh sách coach từ API
  const fetchCoaches = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const res = await api.get("/user");
      const data = res.data.filter((u) => u.role === "COACH");
      setCoaches(data);
    } catch (err) {
      toast.error("Không thể tải danh sách coach. Vui lòng thử lại.");
      console.error("Fetch coaches error:", err);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  // Submit form (Add/Edit)
  const handleSubmit = async (values) => {
    setIsModalLoading(true); // Set modal loading
    try {
      if (editingId) {
        await api.put(`/user/${editingId}`, values);
        toast.success("Cập nhật coach thành công!");
      } else {
        await api.post("/user", { ...values, role: "COACH" });
        toast.success("Thêm coach mới thành công!");
      }
      setOpen(false);
      fetchCoaches();
      form.resetFields();
      setEditingId(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi lưu thông tin coach";
      toast.error(errorMessage);
      console.error("Submit form error:", err);
    } finally {
      setIsModalLoading(false); // Unset modal loading
    }
  };

  // Delete coach
  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      toast.success("Xoá coach thành công!");
      fetchCoaches();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Không thể xoá coach.";
      toast.error(errorMessage);
      console.error("Delete coach error:", err);
    }
  };

  // Restore coach (assuming there's an API endpoint for this)
  const handleRestore = async (user) => {
    if (!user.active) {
      try {
        await api.put(`/user/${user.id}/restore`); // Assuming /user/:id/restore endpoint
        toast.success("Khôi phục coach thành công!");
        fetchCoaches();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Lỗi khi khôi phục coach.";
        toast.error(errorMessage);
        console.error("Restore coach error:", err);
      }
    } else {
      toast.info("Coach này đang hoạt động. Không cần khôi phục.");
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Khu vực",
      dataIndex: "area",
      key: "area",
      render: (area) => area || <Text type="secondary">N/A</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Đang hoạt động" : "Tạm dừng"}
        </Tag>
      ),
      filters: [
        { text: "Đang hoạt động", value: true },
        { text: "Tạm dừng", value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue(record);
              setOpen(true);
            }}
            disabled={!record.active} // Disable edit if not active
            tooltip="Sửa thông tin coach"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá coach "${record.fullName}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Hủy"
            placement="topRight"
            disabled={!record.active} // Disable delete if not active
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={!record.active}
              tooltip="Xoá coach này"
            >
              Xoá
            </Button>
          </Popconfirm>
          <Button
            onClick={() => handleRestore(record)}
            icon={<RollbackOutlined />}
            disabled={record.active} // Disable restore if already active
            tooltip="Khôi phục coach"
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "30px", color: "#1890ff" }}
      >
        <span
          style={{ borderBottom: "3px solid #1890ff", paddingBottom: "5px" }}
        >
          Quản lý Coach Hỗ trợ Cai Nghiện Thuốc lá
        </span>
      </Title>

      <Card
        title="Danh sách Coach"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
              form.resetFields();
              setEditingId(null);
            }}
            size="large"
          >
            Thêm Coach Mới
          </Button>
        }
        style={{
          marginBottom: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Table
          columns={columns}
          dataSource={coaches}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>

      <Modal
        title={
          <Title level={4}>
            {editingId ? "Chỉnh sửa Thông tin Coach" : "Thêm Coach Mới"}
          </Title>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null} // Custom footer for submit button inside form
        centered // Center the modal on the screen
        maskClosable={!isModalLoading} // Prevent closing modal when loading
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ tên đầy đủ" />
          </Form.Item>

          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" disabled={!!editingId} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập địa chỉ email" />
          </Form.Item>

          {!editingId && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item label="Khu vực" name="area">
            <Input placeholder="Nhập khu vực hoạt động (ví dụ: Hà Nội, TP.HCM)" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="active"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            initialValue={true} // Default to active for new coaches
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={true}>Đang hoạt động</Select.Option>
              <Select.Option value={false}>Tạm dừng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isModalLoading}
              style={{ marginTop: "20px" }}
            >
              {editingId ? "Cập nhật Coach" : "Thêm Coach Mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CoachManagement;
