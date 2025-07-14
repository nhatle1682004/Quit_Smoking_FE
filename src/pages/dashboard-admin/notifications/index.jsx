import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Card,
  Typography,
  Form,
  message,
  Popconfirm,
  Badge,
  Tooltip,
  DatePicker,
  Switch,
} from "antd";
import {
  BellOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  FilterOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Component này đóng vai trò là công cụ quản lý thông báo trung tâm cho Admin
function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [form] = Form.useForm();

  // Hàm gọi API để lấy danh sách tất cả thông báo đã tạo
  const fetchNotifications = async (params = {}) => {
    setLoading(true);
    try {
      // API call thật sẽ trông như thế này
      // const response = await api.get('/notifications/all', { params });
      // setNotifications(response.data.items);
      // setPagination(prev => ({...prev, total: response.data.total}));

      // Dữ liệu mẫu để hiển thị
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `Admin Announcement ${i + 1}`,
        description: `This is a system-wide announcement for all users.`,
        type: i % 2 === 0 ? "system" : "program",
        status: i % 3 === 0 ? "sent" : i % 3 === 1 ? "scheduled" : "draft",
        createdAt: dayjs().subtract(i, "day").toISOString(),
        scheduledFor: i % 3 === 1 ? dayjs().add(i, "day").toISOString() : null,
        recipientIds: ["all"],
      }));
      setNotifications(mockData);
      setPagination((prev) => ({ ...prev, total: mockData.length }));
    } catch (error) {
      message.error("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    });
  }, [filters, pagination.current, pagination.pageSize]);

  const handleModalOpen = (notification = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    setEditingNotification(notification);
    if (notification) {
      form.setFieldsValue({
        ...notification,
        scheduledFor: notification.scheduledFor
          ? dayjs(notification.scheduledFor)
          : null,
        recipientIds: notification.recipientIds?.includes("all")
          ? ["all"]
          : notification.recipientIds,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ recipientIds: ["all"] });
    }
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingNotification(null);
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      scheduledFor: values.scheduledFor
        ? values.scheduledFor.toISOString()
        : null,
    };

    // Nếu không chọn 'all', recipientIds đã là mảng các group
    if (payload.recipientIds.includes("all")) {
      payload.recipientIds = ["all"];
    }

    try {
      if (editingNotification) {
        // await api.put(`/notifications/${editingNotification.id}`, payload);
        message.success("Notification updated successfully!");
      } else {
        // await api.post('/notifications', payload);
        message.success("Notification created successfully!");
      }
      handleModalClose();
      fetchNotifications(); // Tải lại danh sách
    } catch (error) {
      message.error("Failed to save notification.");
    }
  };

  const handleDelete = async (id) => {
    try {
      // await api.delete(`/notifications/${id}`);
      message.success("Notification deleted!");
      fetchNotifications();
    } catch (error) {
      message.error("Failed to delete notification.");
    }
  };

  // Các cột cho bảng Ant Design
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "system" ? "blue" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "sent"
              ? "success"
              : status === "scheduled"
              ? "processing"
              : "default"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Recipients",
      dataIndex: "recipientIds",
      key: "recipientIds",
      render: (ids) => (
        <Tag color="purple">
          {ids?.includes("all") ? "All Users" : ids?.join(", ")}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleModalOpen(record, true)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              type="primary"
              ghost
              onClick={() => handleModalOpen(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={3}>Notification Management</Title>
            <Text type="secondary">
              Create and manage notifications for all users.
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleModalOpen()}
          >
            Create Notification
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(p) => setPagination(p)}
        />
      </Card>

      <Modal
        title={
          isViewOnly
            ? "View Notification"
            : editingNotification
            ? "Edit Notification"
            : "Create Notification"
        }
        open={modalVisible}
        onCancel={handleModalClose}
        footer={
          isViewOnly
            ? [
                <Button key="close" onClick={handleModalClose}>
                  Close
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={handleModalClose}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => form.submit()}
                >
                  Save
                </Button>,
              ]
        }
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          disabled={isViewOnly}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Option value="system">System</Option>
              <Option value="program">Program</Option>
              <Option value="announcement">Announcement</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="recipientIds"
            label="Recipients"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" placeholder="Select recipients">
              <Option value="all">All Users</Option>
              <Option value="premium">Premium Users</Option>
              <Option value="new_users">New Users</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="scheduled">Scheduled</Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.status !== curr.status}
          >
            {({ getFieldValue }) =>
              getFieldValue("status") === "scheduled" ? (
                <Form.Item
                  name="scheduledFor"
                  label="Schedule Time"
                  rules={[{ required: true }]}
                >
                  <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Notifications;
