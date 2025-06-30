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
  Switch, // Vẫn có thể giữ lại hoặc xóa đi nếu không dùng ở đâu khác
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import api from "./../../../configs/axios";
import { useForm } from "antd/es/form/Form";

function CoachManagement() {
  const { Title, Text } = Typography;
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user");
      const data = res.data.filter((u) => u.role === "COACH");
      setCoaches(data);
    } catch (err) {
      toast.error("Không thể tải danh sách coach. Vui lòng thử lại.");
      console.error("Fetch coaches error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleSubmit = async (values) => {
    setIsModalLoading(true);
    try {
      // THAY ĐỔI QUAN TRỌNG: Thêm cứng "premium: true" vào payload
      const payload = { ...values, role: "COACH", premium: true };

      if (editingId) {
        delete payload.password;
        await api.put(`/user/${editingId}`, payload);
        toast.success("Cập nhật coach thành công!");
      } else {
        await api.post("/user", payload);
        toast.success("Thêm coach mới thành công!");
      }
      setOpen(false);
      fetchCoaches();
      form.resetFields();
      setEditingId(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Lỗi khi lưu thông tin coach. Vui lòng kiểm tra lại dữ liệu.";
      toast.error(errorMessage);
      console.error("Submit form error:", err.response || err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      toast.success("Xoá coach thành công! Trạng thái đã được cập nhật.");
      fetchCoaches();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Không thể xoá coach.";
      toast.error(errorMessage);
      console.error("Delete coach error:", err);
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.put(`/user/${id}/restore`);
      toast.success("Khôi phục coach thành công!");
      fetchCoaches();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Lỗi khi khôi phục coach.";
      toast.error(errorMessage);
      console.error("Restore coach error:", err);
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender === "MALE" ? "Nam" : "Nữ"),
    },
    {
      title: "Premium",
      dataIndex: "premium",
      key: "premium",
      render: (premium) => (
        // Cột này sẽ luôn hiển thị tag "Có" cho các coach
        <Tag color={premium ? "gold" : "default"}>
          {premium ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
      filters: [
        { text: "Hoạt động", value: true },
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
          />
          {record.active ? (
            <Popconfirm
              title="Xác nhận tạm dừng"
              description={`Bạn có chắc muốn tạm dừng coach "${record.fullName}"?`}
              onConfirm={() => handleDelete(record.id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          ) : (
            <Button
              onClick={() => handleRestore(record.id)}
              icon={<RollbackOutlined />}
              style={{ color: "green", borderColor: "green" }}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Quản lý Coach
      </Title>

      <Card
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
        onCancel={() => setOpen(false)}
        afterClose={() => {
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
        centered
        maskClosable={!isModalLoading}
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

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
            </Select>
          </Form.Item>

          {/* XÓA BỎ: Đã xóa Form Item cho Premium ở đây */}

          <Form.Item style={{ marginTop: "20px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isModalLoading}
            >
              {editingId ? "Cập nhật" : "Thêm Mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CoachManagement;
