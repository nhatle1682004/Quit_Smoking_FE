import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../configs/axios";

import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Tag,
  Select,
  Dropdown,
  Menu,
  message,
  Typography,
  Form,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  DownOutlined,
  SyncOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Component to display a single statistic card
const StatCard = ({ title, value, colorClass }) => (
  <div className={`rounded-lg p-4 ${colorClass}`}>
    <p className="text-sm text-gray-700">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

// Component to display a client's information card
const ClientCard = ({ client, onSendMessage }) => {
  const { progress } = client;
  const cravingColor =
    progress.cravingIntensity > 75
      ? "bg-red-500"
      : progress.cravingIntensity > 50
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={client.avatarUrl}
            alt={client.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {client.fullName}
            </h3>
            <p className="text-sm text-gray-500">{client.email}</p>
            {client.joinedDate && (
              <p className="text-xs text-gray-400">
                Joined: {client.joinedDate}
              </p>
            )}
          </div>
        </div>
        {client.plan === "Premium" && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {client.plan}
          </span>
        )}
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-3">Progress Overview</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <StatCard
            title="Smoke-Free Days"
            value={progress.smokeFreeDays}
            colorClass="bg-green-100"
          />
          <StatCard
            title="Cigarettes Avoided"
            value={progress.cigarettesAvoided}
            colorClass="bg-blue-100"
          />
          <StatCard
            title="Money Saved"
            value={`$${progress.moneySaved}`}
            colorClass="bg-yellow-100"
          />
        </div>
      </div>
      <div className="mb-5">
        <h4 className="font-semibold text-gray-700 mb-2">Craving Intensity</h4>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`${cravingColor} h-2.5 rounded-full`}
            style={{ width: `${progress.cravingIntensity}%` }}
          ></div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-auto">
        {/* UPDATED LINK: Points to the nested route */}
        <Link
          to={`/dashboard-coach/client-details/${client.id}`}
          state={{ clientName: client.fullName }}
          className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View Details
        </Link>
        <button
          onClick={() => onSendMessage(client)}
          className="p-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          title={`Send message to ${client.fullName}`}
        >
          <HiOutlineChatAlt2 size={20} />
        </button>
      </div>
    </div>
  );
};

const STATUS_COLORS = {
  PENDING: "orange",
  CONFIRMED: "green",
  CANCELED: "red",
  COMPLETED: "blue",
};
const AVAILABLE_STATUSES = ["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"];

function CoachDashboard() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [viewingBooking, setViewingBooking] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState({ keyword: "", status: null });

  const [isNotificationModalVisible, setIsNotificationModalVisible] =
    useState(false);
  const [currentTargetClient, setCurrentTargetClient] = useState(null);
  const [notificationForm] = Form.useForm();
  const [isSending, setIsSending] = useState(false);

  const fetchCoachData = useCallback(async () => {
  if (!currentUser?.id) {
    setIsLoading(false);
    setError("Please log in to view the dashboard.");
    return;
  }

    setIsLoading(true);
    try {
      // 1. Get the coach profile list to map to the coachId
      const coachListRes = await api.get("/coach/coaches");
      const coachProfile = coachListRes.data.find(
        (c) => c.accountId === currentUser.id
      );
      if (!coachProfile) {
        setError("Không tìm được coach profile cho tài khoản này!");
        setIsLoading(false);
        return;
      }
      const coachId = coachProfile.id;

      // 2. Get the coach's bookings using the correct coachId
      const response = await api.get(`/bookings/coach/${coachId}`);
      const coachBookings = response.data;

      // 3. Iterate to get the client list
      const clientMap = new Map();
      coachBookings.forEach((booking) => {
        const userInfo = booking.user;
        if (
          userInfo &&
          userInfo.customerId != null &&
          !clientMap.has(userInfo.customerId)
        ) {
          clientMap.set(userInfo.customerId, {
            id: userInfo.customerId,
            fullName: userInfo.fullName,
            email: userInfo.email,
            avatarUrl:
              userInfo.avatarUrl ||
              "https://placehold.co/100x100/EFEFEF/AAAAAA&text=No+Image",
            joinedDate: userInfo.joinedDate
              ? new Date(userInfo.joinedDate).toLocaleDateString()
              : "N/A",
            plan: userInfo.plan || "Basic",
            // Mock progress data
            progress: {
              smokeFreeDays: Math.floor(Math.random() * 30),
              cigarettesAvoided: Math.floor(Math.random() * 500),
              moneySaved: Math.floor(Math.random() * 200),
              cravingIntensity: Math.floor(Math.random() * 100),
            },
          });
        }
      });
      setClients(Array.from(clientMap.values()));

    const formattedBookings = coachBookings.map((booking) => ({
      ...booking,
      key: booking.bookingId,
      customerName: booking.user.fullName,
      status: booking.status.toUpperCase(),
    }));
    setAllBookings(formattedBookings);
  } catch (err) {
    setError("Failed to load dashboard data. Please try again.");
    console.error("Error fetching dashboard data:", err);
  } finally {
    setIsLoading(false);
  }
}, [currentUser]);


  useEffect(() => {
    fetchCoachData();
  }, [fetchCoachData]);

  // Effect to apply filters to the booking list
  useEffect(() => {
    let filteredData = [...allBookings];
    if (filters.keyword) {
      const keywordLower = filters.keyword.toLowerCase();
      filteredData = filteredData.filter(
        (b) =>
          b.customerName.toLowerCase().includes(keywordLower) ||
          b.bookingId.toString().includes(keywordLower)
      );
    }
    if (filters.status) {
      filteredData = filteredData.filter((b) => b.status === filters.status);
    }
    setBookings(filteredData);
    setPagination((p) => ({ ...p, total: filteredData.length, current: 1 }));
  }, [filters, allBookings]);

  // Handlers for the notification modal
  const showNotificationModal = (client) => {
    setCurrentTargetClient(client);
    setIsNotificationModalVisible(true);
    notificationForm.resetFields();
  };

  const closeNotificationModal = () => {
    setIsNotificationModalVisible(false);
    setCurrentTargetClient(null);
  };

  const handleSendNotification = async (values) => {
    if (!currentTargetClient || !currentUser?.id) {
      message.error("Không tìm thấy thông tin người gửi hoặc người nhận.");
      return;
    }
    setIsSending(true);
    try {
      const payload = {
        recipientIds: [currentTargetClient.id],
        senderId: currentUser.id,
        title: values.title,
        message: values.description,
        type: values.type,
      };

      await api.post("/notifications", payload);
      message.success(
        `Đã gửi thông báo thành công đến ${currentTargetClient.fullName}`
      );
      closeNotificationModal();
    } catch (err) {
      console.error(
        "Lỗi khi gửi thông báo:",
        err.response?.data || err.message
      );
      message.error("Không thể gửi thông báo. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  // Handlers for table and filters
  const handleTableChange = (pagination) => setPagination(pagination);
  const handleSearch = (value) => setFilters({ ...filters, keyword: value });
  const handleStatusFilterChange = (value) =>
    setFilters({ ...filters, status: value });
  const viewBookingDetails = (booking) => setViewingBooking(booking);
  const closeBookingDetails = () => setViewingBooking(null);

  // Handler to update booking status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, {
        status: newStatus.toLowerCase(),
      });
      message.success(`Đã cập nhật trạng thái thành ${newStatus}`);
      fetchCoachData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  // Columns definition for the bookings table
  const columns = [
    { title: "ID", dataIndex: "bookingId", key: "bookingId", width: 80 },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Time",
      key: "time",
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"} key={status}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 220,
      render: (_, record) => {
        const menuProps = {
          items: AVAILABLE_STATUSES.map((status) => ({
            key: status,
            label: `Chuyển thành ${status}`,
            disabled: record.status === status,
          })),
          onClick: ({ key }) => handleUpdateStatus(record.bookingId, key),
        };
        return (
          <Space size="small">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => viewBookingDetails(record)}
            >
              View
            </Button>
            <Dropdown menu={menuProps}>
              <Button type="primary">
                Approve <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  // Conditional rendering for loading and error states
  if (isLoading && !clients.length && !bookings.length) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Coach! Here's an overview of your clients.
          </p>
        </header>

        <div className="flex gap-4 mb-6">
          <Link
            to="/"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Về Homepage
          </Link>
          <Link
            to="/dashboard-coach"
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Quản lý khách hàng
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onSendMessage={showNotificationModal}
              />
            ))
          ) : (
            <p className="lg:col-span-2 text-center text-gray-500">
              No clients to display.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            My Appointments
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <Space wrap>
                <Input.Search
                  placeholder="Search by name, ID..."
                  onSearch={handleSearch}
                  enterButton={<SearchOutlined />}
                  className="w-full md:w-64"
                />
                <Select
                  placeholder="Filter by status"
                  onChange={handleStatusFilterChange}
                  allowClear
                  className="w-full md:w-52"
                >
                  {AVAILABLE_STATUSES.map((status) => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  ))}
                </Select>
              </Space>
              <Button
                type="default"
                icon={<SyncOutlined />}
                onClick={fetchCoachData}
                loading={isLoading}
              >
                Refresh
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={bookings}
              rowKey="key"
              pagination={pagination}
              loading={isLoading}
              onChange={handleTableChange}
              scroll={{ x: "max-content" }}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Modal for sending notifications */}
      {currentTargetClient && (
        <Modal
          title={`Gửi thông báo đến ${currentTargetClient.fullName}`}
          open={isNotificationModalVisible}
          onCancel={closeNotificationModal}
          footer={[
            <Button key="back" onClick={closeNotificationModal}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={isSending}
              onClick={() => notificationForm.submit()}
              icon={<SendOutlined />}
            >
              Gửi
            </Button>,
          ]}
          width={600}
        >
          <Form
            form={notificationForm}
            layout="vertical"
            onFinish={handleSendNotification}
            initialValues={{ title: "", description: "", type: "message" }}
          >
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input placeholder="Ví dụ: Lời nhắc buổi hẹn ngày mai" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại thông báo"
              rules={[
                { required: true, message: "Vui lòng chọn loại thông báo!" },
              ]}
            >
              <Select placeholder="Chọn loại thông báo">
                <Option value="message">Tin nhắn chung</Option>
                <Option value="reminder">Lời nhắc</Option>
                <Option value="update">Cập nhật tiến trình</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Nội dung"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <TextArea rows={4} placeholder="Nhập nội dung chi tiết..." />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Modal for viewing booking details */}
      <Modal
        title={
          <Title level={4}>Booking Details #{viewingBooking?.bookingId}</Title>
        }
        open={viewingBooking !== null}
        onCancel={closeBookingDetails}
        footer={[
          <Button key="back" onClick={closeBookingDetails}>
            Close
          </Button>,
        ]}
      >
        {viewingBooking && (
          <div>
            <Paragraph>
              <Text strong>Customer:</Text> {viewingBooking.customerName}
            </Paragraph>
            <Paragraph>
              <Text strong>Date:</Text>{" "}
              {new Date(viewingBooking.date).toLocaleDateString("vi-VN")}
            </Paragraph>
            <Paragraph>
              <Text strong>Time:</Text> {viewingBooking.startTime} -{" "}
              {viewingBooking.endTime}
            </Paragraph>
            <Paragraph>
              <Text strong>Status:</Text>{" "}
              <Tag color={STATUS_COLORS[viewingBooking.status] || "default"}>
                {viewingBooking.status}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Created At:</Text>{" "}
              {new Date(viewingBooking.createdAt).toLocaleString("vi-VN")}
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CoachDashboard;
