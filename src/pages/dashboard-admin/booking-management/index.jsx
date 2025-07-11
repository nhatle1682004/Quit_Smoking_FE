import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Tooltip,
  Card,
  Typography,
  message,
  Tag,
  Select,
  Dropdown,
  Menu,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  DownOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios"; // FIXED: Reverted to use your original API configuration.

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Define status colors for visual representation (using uppercase keys for consistency)
const STATUS_COLORS = {
  PENDING: "orange",
  CONFIRMED: "green",
  CANCELED: "red",
  COMPLETED: "blue",
};

// Define available statuses for filtering and updating (always uppercase)
const AVAILABLE_STATUSES = ["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"];

function BookingManagement() {
  // State variables for bookings, loading, pagination, filters, and modals
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    keyword: "",
    status: null, // New filter for booking status
  });
  const [viewingBooking, setViewingBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      // API endpoint to get all bookings
      const response = await api.get("/bookings");
      let data = response.data;

      // Filter data based on current status and keyword filters
      const filteredData = data.filter((booking) => {
        const keywordLower = filters.keyword.toLowerCase();
        const matchKeyword =
          !filters.keyword ||
          booking.id.toString().toLowerCase().includes(keywordLower) ||
          booking.userName?.toLowerCase().includes(keywordLower) ||
          booking.coachName?.toLowerCase().includes(keywordLower);

        // UPDATED: Consistently check status in uppercase
        const matchStatus =
          !filters.status ||
          (booking.status && booking.status.toUpperCase() === filters.status);

        return matchKeyword && matchStatus;
      });

      setBookings(filteredData);
      setPagination((p) => ({
        ...p,
        total: filteredData.length,
      }));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  }, [filters.keyword, filters.status]);

  // Effect hook to fetch bookings when filters or pagination change
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle table pagination and sorting changes
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Handle search input change
  const handleSearch = (value) => {
    setFilters({ ...filters, keyword: value });
    setPagination({ ...pagination, current: 1 });
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setFilters({ ...filters, status: value });
    setPagination({ ...pagination, current: 1 });
  };

  // Set selected booking for detailed view
  const viewBookingDetails = (booking) => {
    setViewingBooking(booking);
  };

  // Close the booking details modal
  const closeBookingDetails = () => {
    setViewingBooking(null);
  };

  // Handle status update for a booking
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      // Convert the status to lowercase to match backend expectations.
      await api.put(`/bookings/${bookingId}`, {
        status: newStatus.toLowerCase(),
      });
      message.success(`Đã cập nhật trạng thái lịch hẹn thành ${newStatus}`);
      fetchBookings(); // Refresh data after update
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  // Table columns definition - UPDATED to match new response body
  const columns = [
    {
      title: "ID Lịch hẹn",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Tên Khách hàng",
      dataIndex: "userName",
      key: "userName",
      responsive: ["md"],
    },
    {
      title: "Tên Coach",
      dataIndex: "coachName",
      key: "coachName",
      responsive: ["md"],
    },
    {
      title: "Ngày hẹn",
      dataIndex: "date",
      key: "date",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Thời gian hẹn",
      key: "time",
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        // Safely convert status to uppercase for display
        const upperCaseStatus = status ? status.toUpperCase() : "UNKNOWN";
        return (
          <Tag color={STATUS_COLORS[upperCaseStatus] || "default"} key={status}>
            {upperCaseStatus}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 240,
      render: (_, record) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleUpdateStatus(record.id, key)}
            items={AVAILABLE_STATUSES.map((status) => ({
              key: status,
              label: `Chuyển thành ${status}`,
            }))}
          />
        );

        return (
          <Space size="small" className="flex flex-wrap gap-2">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => viewBookingDetails(record)}
            >
              Xem
            </Button>
            <Dropdown overlay={menu}>
              <Button type="primary">
                Duyệt <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-inter">
      <Card bordered={false} className="shadow-lg rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 border-gray-200">
          <div>
            <Title level={2} className="mb-1 text-gray-800">
              Quản lý Lịch hẹn
            </Title>
            <Text
              type="secondary"
              className="text-gray-500 text-sm sm:text-base"
            >
              Duyệt và quản lý các lịch hẹn trên hệ thống.
            </Text>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Space wrap>
            <Input.Search
              placeholder="Tìm theo ID, tên..."
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              className="w-full md:w-64"
            />
            <Select
              placeholder="Lọc theo trạng thái"
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
            onClick={fetchBookings}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          bordered={false}
          className="rounded-lg overflow-hidden shadow-md"
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title={
          <Title level={4} className="mb-0 text-gray-800">
            Chi tiết Lịch hẹn #{viewingBooking?.id}
          </Title>
        }
        open={viewingBooking !== null}
        onCancel={closeBookingDetails}
        footer={[
          <Button key="back" onClick={closeBookingDetails}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {viewingBooking && (
          <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
            <Paragraph>
              <Text strong>Tên Khách hàng:</Text> {viewingBooking.userName}
            </Paragraph>
            <Paragraph>
              <Text strong>Tên Coach:</Text> {viewingBooking.coachName}
            </Paragraph>
            <Paragraph>
              <Text strong>Ngày hẹn:</Text>{" "}
              {new Date(viewingBooking.date).toLocaleDateString("vi-VN")}
            </Paragraph>
            <Paragraph>
              <Text strong>Thời gian hẹn:</Text> {viewingBooking.startTime} -{" "}
              {viewingBooking.endTime}
            </Paragraph>
            <Paragraph>
              <Text strong>Trạng thái:</Text>{" "}
              <Tag
                color={
                  STATUS_COLORS[viewingBooking.status.toUpperCase()] ||
                  "default"
                }
              >
                {viewingBooking.status.toUpperCase()}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Ngày tạo:</Text>{" "}
              {new Date(viewingBooking.createdAt).toLocaleString("vi-VN")}
            </Paragraph>
            <Paragraph>
              <Text strong>Cập nhật lần cuối:</Text>{" "}
              {new Date(viewingBooking.updatedAt).toLocaleString("vi-VN")}
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default BookingManagement;
