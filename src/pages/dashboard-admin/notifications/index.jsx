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

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    keyword: "",
    dateRange: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [form] = Form.useForm();
  const [viewDetails, setViewDetails] = useState(false);

  // Mô phỏng dữ liệu - trong thực tế sẽ được lấy từ API
  useEffect(() => {
    fetchNotifications();
  }, [filters, pagination.current, pagination.pageSize]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Trong thực tế, thay thế đoạn này bằng API call thực
      // const response = await api.get('/notifications', {
      //   params: {
      //     type: filters.type !== 'all' ? filters.type : undefined,
      //     status: filters.status !== 'all' ? filters.status : undefined,
      //     keyword: filters.keyword || undefined,
      //     startDate: filters.dateRange ? filters.dateRange[0].format('YYYY-MM-DD') : undefined,
      //     endDate: filters.dateRange ? filters.dateRange[1].format('YYYY-MM-DD') : undefined,
      //     page: pagination.current,
      //     pageSize: pagination.pageSize
      //   }
      // });

      // Dữ liệu mẫu
      const mockData = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Thông báo ${i + 1}: ${
          i % 3 === 0
            ? "Chương trình mới"
            : i % 3 === 1
            ? "Cập nhật ứng dụng"
            : "Lời nhắc hằng ngày"
        }`,
        content: `Đây là nội dung chi tiết của thông báo ${i + 1}. ${
          i % 3 === 0
            ? "Chúng tôi ra mắt chương trình cai thuốc lá mới"
            : i % 3 === 1
            ? "Phiên bản mới đã sẵn sàng để tải về"
            : "Đừng quên theo dõi quá trình cai thuốc của bạn hôm nay!"
        }`,
        type: i % 3 === 0 ? "program" : i % 3 === 1 ? "system" : "reminder",
        status:
          i % 4 === 0
            ? "draft"
            : i % 4 === 1
            ? "scheduled"
            : i % 4 === 2
            ? "sent"
            : "failed",
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        scheduledFor:
          i % 4 === 1
            ? new Date(
                Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
              ).toISOString()
            : null,
        sentAt:
          i % 4 === 2
            ? new Date(
                Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000
              ).toISOString()
            : null,
        targetGroups: i % 2 === 0 ? ["all"] : ["premium", "new_users"],
        sendToAll: i % 2 === 0,
        isPinned: i % 5 === 0,
      }));

      const filteredData = mockData.filter((notification) => {
        const matchType =
          filters.type === "all" || notification.type === filters.type;
        const matchStatus =
          filters.status === "all" || notification.status === filters.status;
        const matchKeyword =
          !filters.keyword ||
          notification.title
            .toLowerCase()
            .includes(filters.keyword.toLowerCase()) ||
          notification.content
            .toLowerCase()
            .includes(filters.keyword.toLowerCase());

        let matchDateRange = true;
        if (filters.dateRange) {
          const notificationDate = dayjs(notification.createdAt);
          matchDateRange =
            notificationDate.isAfter(filters.dateRange[0]) &&
            notificationDate.isBefore(filters.dateRange[1]);
        }

        return matchType && matchStatus && matchKeyword && matchDateRange;
      });

      setNotifications(filteredData);
      setPagination({
        ...pagination,
        total: filteredData.length,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleSearch = (value) => {
    setFilters({
      ...filters,
      keyword: value,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const showCreateModal = () => {
    setSelectedNotification(null);
    setModalTitle("Tạo Thông Báo Mới");
    form.resetFields();
    form.setFieldsValue({
      type: "system",
      status: "draft",
      sendToAll: true,
      isPinned: false,
      scheduledFor: null,
    });
    setModalVisible(true);
    setViewDetails(false);
  };

  const showEditModal = (notification) => {
    setSelectedNotification(notification);
    setModalTitle("Chỉnh Sửa Thông Báo");
    form.setFieldsValue({
      ...notification,
      scheduledFor: notification.scheduledFor
        ? dayjs(notification.scheduledFor)
        : null,
    });
    setModalVisible(true);
    setViewDetails(false);
  };

  const showViewModal = (notification) => {
    setSelectedNotification(notification);
    setModalTitle("Chi Tiết Thông Báo");
    form.setFieldsValue({
      ...notification,
      scheduledFor: notification.scheduledFor
        ? dayjs(notification.scheduledFor)
        : null,
    });
    setModalVisible(true);
    setViewDetails(true);
  };

  const handleSaveNotification = async (values) => {
    try {
      // Xử lý dữ liệu trước khi gửi
      const formData = {
        ...values,
        scheduledFor:
          values.status === "scheduled" && values.scheduledFor
            ? values.scheduledFor.format("YYYY-MM-DD HH:mm:ss")
            : null,
      };

      if (selectedNotification) {
        // Cập nhật thông báo
        // await api.put(`/notifications/${selectedNotification.id}`, formData);
        message.success("Đã cập nhật thông báo");

        // Cập nhật UI
        setNotifications(
          notifications.map((item) =>
            item.id === selectedNotification.id
              ? { ...item, ...formData }
              : item
          )
        );
      } else {
        // Tạo thông báo mới
        // const response = await api.post('/notifications', formData);
        // Giả lập response
        const newNotification = {
          id: Math.max(...notifications.map((n) => n.id)) + 1,
          ...formData,
          createdAt: new Date().toISOString(),
        };

        message.success("Đã tạo thông báo mới");

        // Cập nhật UI
        setNotifications([newNotification, ...notifications]);
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving notification:", error);
      message.error("Không thể lưu thông báo");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      // Trong thực tế, gọi API để xóa thông báo
      // await api.delete(`/notifications/${id}`);

      message.success("Đã xóa thông báo");

      // Cập nhật UI
      setNotifications(notifications.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      message.error("Không thể xóa thông báo");
    }
  };

  const handleSendNotification = async (id) => {
    try {
      // Trong thực tế, gọi API để gửi thông báo
      // await api.post(`/notifications/${id}/send`);

      message.success("Đã gửi thông báo");

      // Cập nhật UI
      setNotifications(
        notifications.map((item) =>
          item.id === id
            ? { ...item, status: "sent", sentAt: new Date().toISOString() }
            : item
        )
      );
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error("Không thể gửi thông báo");
    }
  };

  const getTypeTag = (type) => {
    switch (type) {
      case "system":
        return <Tag color="blue">Hệ thống</Tag>;
      case "program":
        return <Tag color="green">Chương trình</Tag>;
      case "reminder":
        return <Tag color="orange">Nhắc nhở</Tag>;
      default:
        return <Tag>Khác</Tag>;
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "draft":
        return (
          <Tag icon={<EditOutlined />} color="default">
            Bản nháp
          </Tag>
        );
      case "scheduled":
        return (
          <Tag icon={<ClockCircleOutlined />} color="purple">
            Đã lên lịch
          </Tag>
        );
      case "sent":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã gửi
          </Tag>
        );
      case "failed":
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="error">
            Lỗi
          </Tag>
        );
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.isPinned && <Badge dot color="red" />}
          <a onClick={() => showViewModal(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => getTypeTag(type),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thời gian gửi",
      key: "sendTime",
      render: (_, record) => {
        if (record.status === "scheduled") {
          return (
            <Text type="warning">
              {new Date(record.scheduledFor).toLocaleString("vi-VN")}
            </Text>
          );
        } else if (record.status === "sent") {
          return (
            <Text type="success">
              {new Date(record.sentAt).toLocaleString("vi-VN")}
            </Text>
          );
        }
        return "-";
      },
    },
    {
      title: "Đối tượng",
      key: "target",
      render: (_, record) =>
        record.sendToAll ? (
          <Tag color="cyan">Tất cả người dùng</Tag>
        ) : (
          <Space>
            {record.targetGroups.map((group) => (
              <Tag key={group}>
                {group === "premium"
                  ? "Premium"
                  : group === "new_users"
                  ? "Người dùng mới"
                  : group}
              </Tag>
            ))}
          </Space>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => showViewModal(record)}
            />
          </Tooltip>

          {record.status === "draft" && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => showEditModal(record)}
              />
            </Tooltip>
          )}

          {(record.status === "draft" || record.status === "failed") && (
            <Tooltip title="Gửi ngay">
              <Button
                type="default"
                icon={<SendOutlined />}
                onClick={() => handleSendNotification(record.id)}
              />
            </Tooltip>
          )}

          {record.status !== "sent" && (
            <Tooltip title="Xóa">
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa thông báo này?"
                onConfirm={() => handleDeleteNotification(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="notifications-container p-6">
      <Card bordered={false}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="mb-0">
              Quản lý thông báo
            </Title>
            <Text type="secondary">
              Tạo và quản lý các thông báo đến người dùng
            </Text>
          </div>

          <Space>
            <Badge
              count={
                notifications.filter((item) => item.status === "draft").length
              }
              overflowCount={99}
            >
              <Button>Thông báo nháp</Button>
            </Badge>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              Tạo thông báo mới
            </Button>
          </Space>
        </div>

        <div className="flex flex-wrap justify-between mb-4 gap-2">
          <div className="flex flex-wrap gap-2">
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={(value) => handleFilterChange("type", value)}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả loại</Option>
              <Option value="system">Hệ thống</Option>
              <Option value="program">Chương trình</Option>
              <Option value="reminder">Nhắc nhở</Option>
            </Select>

            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={(value) => handleFilterChange("status", value)}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="draft">Bản nháp</Option>
              <Option value="scheduled">Đã lên lịch</Option>
              <Option value="sent">Đã gửi</Option>
              <Option value="failed">Lỗi</Option>
            </Select>

            <RangePicker
              style={{ width: 240 }}
              onChange={(dates) => handleFilterChange("dateRange", dates)}
              placeholder={["Từ ngày", "Đến ngày"]}
            />

            <Input.Search
              placeholder="Tìm kiếm theo tiêu đề, nội dung"
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              style={{ width: 250 }}
            />
          </div>

          <Button onClick={fetchNotifications}>Làm mới dữ liệu</Button>
        </div>

        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          bordered
          scroll={{ x: true }}
        />
      </Card>

      {/* Modal tạo/chỉnh sửa thông báo */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          viewDetails
            ? [
                <Button key="close" onClick={() => setModalVisible(false)}>
                  Đóng
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => form.submit()}
                >
                  Lưu
                </Button>,
              ]
        }
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveNotification}
          disabled={viewDetails}
        >
          <Form.Item
            name="title"
            label="Tiêu đề thông báo"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề thông báo" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề thông báo..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung thông báo"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung thông báo" },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Nhập nội dung chi tiết thông báo..."
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Loại thông báo"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="system">Hệ thống</Option>
                <Option value="program">Chương trình</Option>
                <Option value="reminder">Nhắc nhở</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="draft">Bản nháp</Option>
                <Option value="scheduled">Lên lịch gửi</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.status !== currentValues.status
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("status") === "scheduled" ? (
                <Form.Item
                  name="scheduledFor"
                  label="Thời gian gửi"
                  rules={[
                    { required: true, message: "Vui lòng chọn thời gian gửi" },
                  ]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="sendToAll"
              label="Đối tượng nhận thông báo"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Tất cả người dùng"
                unCheckedChildren="Nhóm người dùng cụ thể"
              />
            </Form.Item>

            <Form.Item
              name="isPinned"
              label="Ghim thông báo"
              valuePropName="checked"
              tooltip="Thông báo được ghim sẽ hiện ở đầu danh sách thông báo của người dùng"
            >
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.sendToAll !== currentValues.sendToAll
            }
          >
            {({ getFieldValue }) =>
              !getFieldValue("sendToAll") ? (
                <Form.Item
                  name="targetGroups"
                  label="Chọn nhóm người dùng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ít nhất một nhóm người dùng",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Chọn các nhóm người dùng"
                  >
                    <Option value="premium">Người dùng Premium</Option>
                    <Option value="new_users">Người dùng mới</Option>
                    <Option value="inactive">Người dùng không hoạt động</Option>
                  </Select>
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
