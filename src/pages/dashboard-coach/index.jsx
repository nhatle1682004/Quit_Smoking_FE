import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../configs/axios";

// --- START: NEW IMPORTS FROM ANT DESIGN ---
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
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  DownOutlined,
  SyncOutlined,
} from "@ant-design/icons";
// --- END: NEW IMPORTS FROM ANT DESIGN ---

import { HiOutlineChatAlt2, HiChevronDown } from "react-icons/hi";

// Component Card cho mỗi chỉ số (Không thay đổi)
const StatCard = ({ title, value, colorClass }) => (
  <div className={`rounded-lg p-4 ${colorClass}`}>
    <p className="text-sm text-gray-700">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

// Component Card cho mỗi Client (Không thay đổi)
const ClientCard = ({ client }) => {
  const { progress } = client;
  const cravingColor =
    progress.cravingIntensity > 75
      ? "bg-red-500"
      : progress.cravingIntensity > 50
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
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
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          View Details
        </button>
        <button className="p-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          <HiOutlineChatAlt2 size={20} />
        </button>
      </div>
    </div>
  );
};

// --- START: NEW CONSTANTS FOR BOOKING MANAGEMENT ---
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const STATUS_COLORS = {
  PENDING: "orange",
  CONFIRMED: "green",
  CANCELED: "red",
  COMPLETED: "blue",
};

const AVAILABLE_STATUSES = ["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"];
// --- END: NEW CONSTANTS ---

function CoachDashboard() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.user);

  // --- START: NEW STATE FOR BOOKING MANAGEMENT ---
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]); // Store all fetched bookings
  const [viewingBooking, setViewingBooking] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState({ keyword: "", status: null });
  // --- END: NEW STATE ---

  const fetchCoachData = useCallback(async () => {
    if (!currentUser?.id) {
      setIsLoading(false);
      setError("Please log in to view the dashboard.");
      return;
    }

    setIsLoading(true);
    try {
      const apiConfig = {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      };
      const response = await api.get(
        `/bookings/coach/${currentUser.id}`,
        apiConfig
      );
      const coachBookings = response.data;

      // 1. Process unique clients (same as before)
      const clientMap = new Map();
      coachBookings.forEach((booking) => {
        const userInfo = booking.user;
        if (userInfo && !clientMap.has(userInfo.customerId)) {
          clientMap.set(userInfo.customerId, {
            id: userInfo.customerId,
            fullName: userInfo.fullName,
            email: userInfo.email,
            avatarUrl: userInfo.avatarUrl,
            joinedDate: userInfo.joinedDate || null,
            plan: userInfo.plan || "Basic",
            progress: {
              smokeFreeDays: 15,
              cigarettesAvoided: 300,
              moneySaved: 200,
              cravingIntensity: 76,
            }, // Dummy data
          });
        }
      });
      setClients(Array.from(clientMap.values()));

      // 2. Format and store all bookings for filtering
      const formattedBookings = coachBookings.map((booking) => ({
        ...booking,
        key: booking.bookingId, // Ant Design table needs a unique 'key' prop
        customerName: booking.user.fullName,
        status: booking.status.toUpperCase(), // Standardize status to uppercase
      }));
      setAllBookings(formattedBookings); // Store the original list
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Initial data fetch
  useEffect(() => {
    fetchCoachData();
  }, [fetchCoachData]);

  // --- START: NEW EFFECT FOR FILTERING ---
  // This effect runs whenever filters or the source of bookings change
  useEffect(() => {
    let filteredData = [...allBookings];

    // Apply keyword filter
    if (filters.keyword) {
      const keywordLower = filters.keyword.toLowerCase();
      filteredData = filteredData.filter(
        (b) =>
          b.customerName.toLowerCase().includes(keywordLower) ||
          b.bookingId.toString().includes(keywordLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredData = filteredData.filter((b) => b.status === filters.status);
    }

    setBookings(filteredData);
    setPagination((p) => ({ ...p, total: filteredData.length, current: 1 }));
  }, [filters, allBookings]);
  // --- END: NEW EFFECT FOR FILTERING ---

  // --- START: NEW HANDLER FUNCTIONS ---
  const handleTableChange = (pagination) => setPagination(pagination);
  const handleSearch = (value) => setFilters({ ...filters, keyword: value });
  const handleStatusFilterChange = (value) =>
    setFilters({ ...filters, status: value });
  const viewBookingDetails = (booking) => setViewingBooking(booking);
  const closeBookingDetails = () => setViewingBooking(null);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(
        `/bookings/${bookingId}`,
        { status: newStatus.toLowerCase() },
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      message.success(`Đã cập nhật trạng thái thành ${newStatus}`);
      fetchCoachData(); // Refresh all data to get the latest status
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };
  // --- END: NEW HANDLER FUNCTIONS ---

  // --- START: NEW TABLE COLUMNS DEFINITION ---
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
        const menu = (
          <Menu
            onClick={({ key }) => handleUpdateStatus(record.bookingId, key)}
            items={AVAILABLE_STATUSES.map((status) => ({
              key: status,
              label: `Chuyển thành ${status}`,
              disabled: record.status === status,
            }))}
          />
        );
        return (
          <Space size="small">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => viewBookingDetails(record)}
            >
              View
            </Button>
            <Dropdown overlay={menu}>
              <Button type="primary">
                Approve <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];
  // --- END: NEW TABLE COLUMNS DEFINITION ---

  if (isLoading && !clients.length) {
    // Adjusted loading condition
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

        {/* Client Cards List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))
          ) : (
            <p className="lg:col-span-2 text-center text-gray-500">
              No clients to display.
            </p>
          )}
        </div>

        {/* --- START: UPDATED APPOINTMENTS SECTION --- */}
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
        {/* --- END: UPDATED APPOINTMENTS SECTION --- */}
      </div>

      {/* --- START: NEW MODAL FOR VIEWING DETAILS --- */}
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
      {/* --- END: NEW MODAL --- */}
    </div>
  );
}

export default CoachDashboard;
