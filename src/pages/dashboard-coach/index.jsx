import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../configs/axios"; // Đảm bảo đường dẫn này đúng

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
  // message, // <-- ĐÃ XÓA DÒNG NÀY (Không dùng Ant Design message nữa)
  Typography,
  Form,
  Spin,
  Empty,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  DownOutlined,
  SyncOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import dayjs from "dayjs";
import { toast } from "react-toastify"; // <-- ĐÃ THÊM DÒNG NÀY: Import toast

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Đã xóa message.config vì nó chỉ dành cho Ant Design message

// Component to display a single statistic card
const StatCard = ({ title, value, colorClass }) => (
  <div className={`rounded-lg p-4 ${colorClass}`}>
    <p className="text-sm text-gray-700">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

// Component to display a client's information card
const ClientCard = ({ client, onSendMessage, isLoadingSmokingLog }) => {
  // Use optional chaining for progress to avoid errors if it's undefined
  const progress = client.progress || {};

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {client.fullName}
            </h3>
            <p className="text-sm text-gray-500">{client.email}</p>
            {client.joinedDate && (
              <p className="text-xs text-gray-400">
                {/* Joined: {client.joinedDate} */}
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
        <h4 className="font-semibold text-gray-700 mb-3">
          Progress Overview (Today)
        </h4>
        {isLoadingSmokingLog ? (
          <div className="text-center py-4">
            <Spin size="small" />{" "}
            <span className="text-gray-500">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <StatCard
              title="Điếu hút hôm nay"
              value={
                progress.cigarettesToday !== undefined
                  ? progress.cigarettesToday
                  : "N/A"
              }
              colorClass="bg-red-100"
            />
            {progress.coStatus && (
              <StatCard
                title="CO Status"
                value={progress.coStatus}
                colorClass="bg-purple-100"
              />
            )}
            {progress.lungStatus && (
              <StatCard
                title="Lung Status"
                value={progress.lungStatus}
                colorClass="bg-teal-100"
              />
            )}
            {progress.dailyHealthPercent !== undefined && (
              <StatCard
                title="Daily Health %"
                value={`${progress.dailyHealthPercent}%`}
                colorClass="bg-orange-100"
              />
            )}
            {progress.bloodPressure && (
              <StatCard
                title="Blood Pressure"
                value={progress.bloodPressure}
                colorClass="bg-lime-100"
              />
            )}
            {progress.heartRate && (
              <StatCard
                title="Heart Rate"
                value={progress.heartRate}
                colorClass="bg-pink-100"
              />
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 mt-auto">
        <Link
          to={`/dashboard-coach/client-details/${client.id}`}
          state={{ clientName: client.fullName }}
          className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Gửi nhiệm vụ cho {client.fullName}
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

  // State to manage loading of smoking logs individually
  const [smokingLogLoadingMap, setSmokingLogLoadingMap] = useState({});

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

      // 3. Iterate to get the client list and fetch smoking logs
      const clientMap = new Map();
      const today = dayjs().format("YYYY-MM-DD"); // Get today's date for smoking log API

      const clientPromises = coachBookings.map(async (booking) => {
        const userInfo = booking.user;
        if (
          userInfo &&
          userInfo.customerId != null &&
          !clientMap.has(userInfo.customerId)
        ) {
          const clientData = {
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
            progress: {}, // Initialize progress as empty
          };
          clientMap.set(userInfo.customerId, clientData);

          // Fetch smoking log for each client for today
          setSmokingLogLoadingMap((prev) => ({
            ...prev,
            [userInfo.customerId]: true,
          }));
          try {
            const smokingLogRes = await api.get(
              `/smoking-log/user/${userInfo.customerId}/day`,
              { params: { date: today } } // Pass today's date as query parameter
            );
            // Update client's progress with ALL actual smoking log data from Swagger
            clientData.progress = {
              cigarettesToday: smokingLogRes.data.cigarettesToday,
              targetCigarettes: smokingLogRes.data.targetCigarettes,
              nicotineEstimate: smokingLogRes.data.nicotineEstimate,
              coStatus: smokingLogRes.data.coStatus,
              moneySavedToday: smokingLogRes.data.moneySavedToday,
              lungStatus: smokingLogRes.data.lungStatus,
              tasteStatus: smokingLogRes.data.tasteStatus,
              bloodPressureStatus: smokingLogRes.data.bloodPressureStatus,
              bloodPressure: smokingLogRes.data.bloodPressure,
              circulationStatus: smokingLogRes.data.circulationStatus,
              skinStatus: smokingLogRes.data.skinStatus,
              heartRate: smokingLogRes.data.heartRate,
              heartRateStatus: smokingLogRes.data.heartRateStatus,
              dailyHealthPercent: smokingLogRes.data.dailyHealthPercent,
              note: smokingLogRes.data.note,
              daysCompleted: smokingLogRes.data.daysCompleted,
              totalPlanDays: smokingLogRes.data.totalPlanDays,
              targetAchieved: smokingLogRes.data.targetAchieved,
              // Assuming cigarettesAvoided and cravingIntensity are also present in the API response
              cigarettesAvoided: smokingLogRes.data.cigarettesAvoided,
              moneySaved: smokingLogRes.data.moneySavedToday, // Mapping to moneySavedToday from Swagger
              cravingIntensity: smokingLogRes.data.cravingIntensity,
            };
          } catch (smokingLogErr) {
            console.warn(
              `Failed to fetch smoking log for client ${userInfo.customerId} on ${today}:`,
              smokingLogErr.response?.data || smokingLogErr.message
            );
            // Set default/empty progress for ALL fields if smoking log fails or not found
            clientData.progress = {
              cigarettesToday: 0,
              targetCigarettes: 0,
              nicotineEstimate: 0,
              coStatus: "N/A",
              moneySavedToday: 0,
              lungStatus: "N/A",
              tasteStatus: "N/A",
              bloodPressureStatus: "N/A",
              bloodPressure: "N/A",
              circulationStatus: "N/A",
              skinStatus: "N/A",
              heartRate: "N/A",
              heartRateStatus: "N/A",
              dailyHealthPercent: 0,
              note: "N/A",
              daysCompleted: 0,
              totalPlanDays: 0,
              targetAchieved: false,
              cigarettesAvoided: 0,
              moneySaved: 0, // Default for moneySaved
              cravingIntensity: 0,
            };
          } finally {
            setSmokingLogLoadingMap((prev) => ({
              ...prev,
              [userInfo.customerId]: false,
            }));
          }
          return clientData; // Return client data for Promise.all
        }
        return null; // Return null for duplicate bookings or invalid user info
      });

      // Wait for all client data and smoking logs to be fetched
      const resolvedClients = (await Promise.all(clientPromises)).filter(
        Boolean
      );
      setClients(resolvedClients);

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
    console.log("Đang xử lý gửi thông báo...");
    console.log("Giá trị form:", values);

    if (!currentTargetClient || !currentUser?.id) {
      // Thay thế message.error bằng toast.error
      toast.error("Không tìm thấy thông tin người gửi hoặc người nhận.");
      console.error("Lỗi: currentUser hoặc currentTargetClient thiếu.");
      return;
    }

    console.log("Người nhận mục tiêu:", currentTargetClient);
    console.log("ID người gửi (currentUser.id):", currentUser.id);

    setIsSending(true);
    try {
      const payload = {
        recipientIds: [currentTargetClient.id], // Gửi ID cụ thể của khách hàng
        senderId: currentUser.id,
        title: values.title,
        message: values.description, // Sử dụng 'description' từ form làm 'message'
        type: values.type,
      };
      console.log("Payload cuối cùng gửi đến API:", payload);

      await api.post("/notifications", payload);
      console.log("API POST /notifications đã hoàn thành thành công."); // Log khi API call thành công
      // Thay thế message.success bằng toast.success
      toast.success(
        `Đã gửi thông báo thành công đến ${currentTargetClient.fullName}`
      );
      closeNotificationModal();
    } catch (err) {
      console.error(
        "Lỗi khi gửi thông báo:",
        err.response?.data || err.message,
        err.response // Log toàn bộ response để debug chi tiết từ backend
      );
      // Thay thế message.error bằng toast.error
      toast.error("Không thể gửi thông báo. Vui lòng thử lại.");
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
      // Thay thế message.success bằng toast.success
      toast.success(`Đã cập nhật trạng thái thành ${newStatus}`);
      fetchCoachData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating booking status:", error);
      // Thay thế message.error bằng toast.error
      toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
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
    return (
      <div className="p-8 text-center">
        <Spin size="large" />
        <p className="mt-2">Đang tải dashboard...</p>
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!clients.length && !bookings.length && !isLoading) {
    return (
      <div className="p-8 text-center">
        <Empty description="Không có dữ liệu để hiển thị." />
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back ! Here's an overview of your clients.
          </p>
        </header>

        <div className="flex gap-4 mb-6">
          <Link
            to="/"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Về Homepage
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onSendMessage={showNotificationModal}
                isLoadingSmokingLog={smokingLogLoadingMap[client.id]}
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
