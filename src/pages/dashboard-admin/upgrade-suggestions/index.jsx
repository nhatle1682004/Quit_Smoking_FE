import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  DatePicker,
  Modal,
  Form,
  Select,
  Tag,
  Card,
  Typography,
  Spin,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [form] = Form.useForm();

  // Status options for bookings
  const statusOptions = [
    { value: "pending", label: "Chờ xử lý", color: "gold" },
    { value: "confirmed", label: "Đã xác nhận", color: "green" },
    { value: "cancelled", label: "Đã hủy", color: "red" },
    { value: "completed", label: "Hoàn thành", color: "blue" },
  ];

  // Fetch bookings data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("/api/bookings");

        // Ensure we're setting an array to the state
        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          // Handle common API response structure { data: [...] }
          setBookings(response.data.data);
        } else {
          console.error("API response is not an array:", response.data);
          setBookings([]);
          message.error("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
        message.error("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete booking confirmation
  const showDeleteConfirm = (bookingId) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa lịch hẹn này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDelete(bookingId);
      },
    });
  };

  // Handle delete booking
  const handleDelete = async (bookingId) => {
    try {
      // Replace with your actual API endpoint
      await axios.delete(`/api/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      message.success("Xóa lịch hẹn thành công");
    } catch (error) {
      console.error("Error deleting booking:", error);
      message.error("Xóa lịch hẹn thất bại");
    }
  };

  // Edit booking
  const handleEdit = (record) => {
    setCurrentBooking(record);
    form.setFieldsValue({
      patientName: record.patientName,
      doctorName: record.doctorName,
      date: record.date,
      time: record.time,
      status: record.status,
      notes: record.notes,
    });
    setEditModalVisible(true);
  };

  // Save edited booking
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // Replace with your actual API endpoint
      await axios.put(`/api/bookings/${currentBooking.id}`, values);

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking.id === currentBooking.id ? { ...booking, ...values } : booking
        )
      );

      setEditModalVisible(false);
      message.success("Cập nhật lịch hẹn thành công");
    } catch (error) {
      console.error("Error updating booking:", error);
      message.error("Cập nhật lịch hẹn thất bại");
    }
  };

  // Filter bookings based on search text - Safely handle the filter operation
  const filteredBookings = Array.isArray(bookings)
    ? bookings.filter(
        (booking) =>
          booking.patientName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          booking.doctorName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          booking.id?.toString().includes(searchText)
      )
    : [];

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusItem = statusOptions.find((item) => item.value === status);
        return (
          <Tag color={statusItem?.color || "default"}>
            {statusItem?.label || status}
          </Tag>
        );
      },
      filters: statusOptions.map((option) => ({
        text: option.label,
        value: option.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="booking-management">
      <Card>
        <Title level={2}>Quản lý lịch hẹn</Title>

        <div
          className="booking-controls"
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Input
            placeholder="Tìm kiếm theo tên, bác sĩ, ID..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Space>
            <RangePicker placeholder={["Từ ngày", "Đến ngày"]} />
            <Button type="primary">Lọc</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Edit Booking Modal */}
      <Modal
        title="Chỉnh sửa lịch hẹn"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="patientName"
            label="Tên bệnh nhân"
            rules={[{ required: true, message: "Vui lòng nhập tên bệnh nhân" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="doctorName"
            label="Bác sĩ"
            rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="time"
            label="Giờ"
            rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BookingManagement;
