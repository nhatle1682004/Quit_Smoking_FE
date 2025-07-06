import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../configs/axios"; // Import api instance
import { Table, Tag, Space, Button, message, Popconfirm, Avatar } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CheckSquareOutlined,
  UserOutlined,
} from "@ant-design/icons";

const MOCK_API = "https://68512c568612b47a2c08e9af.mockapi.io/appointments";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng

  // Hàm tìm thông tin người dùng bằng ID
  const getUserDetails = (userId) => {
    return users.find((user) => user.id === userId);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Tải đồng thời danh sách lịch hẹn và người dùng
      const [bookingsRes, usersRes] = await Promise.all([
        axios.get(MOCK_API),
        api.get("/user"), // Lấy user từ API thật
      ]);

      setBookings(
        bookingsRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      setUsers(usersRes.data); // Lưu danh sách người dùng vào state
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu");
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${MOCK_API}/${id}`, { status: newStatus });
      message.success("Cập nhật trạng thái thành công!");
      // Tải lại chỉ danh sách booking sau khi cập nhật
      const res = await axios.get(MOCK_API);
      setBookings(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch {
      message.error("Cập nhật trạng thái thất bại.");
    }
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customerId", // Dùng customerId để tra cứu
      key: "customer",
      render: (customerId) => {
        const customer = getUserDetails(customerId);
        return (
          <Space>
            <Avatar src={customer?.avatarUrl} icon={<UserOutlined />} />
            <div>
              <strong>{customer?.fullName || "N/A"}</strong>
              <div style={{ color: "gray" }}>
                @{customer?.username || "N/A"}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Coach",
      dataIndex: "coachId", // Dùng coachId để tra cứu
      key: "coach",
      render: (coachId) => {
        const coach = getUserDetails(coachId);
        return (
          <Space>
            <Avatar src={coach?.avatarUrl} icon={<UserOutlined />} />
            <div>
              <strong>{coach?.fullName || "N/A"}</strong>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Ngày hẹn",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Giờ hẹn",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color, icon, text;
        switch (status) {
          case "BOOKED":
            color = "purple";
            icon = <SyncOutlined spin />;
            text = "Mới đặt";
            break;
          case "ACCEPTED":
            color = "green";
            icon = <CheckCircleOutlined />;
            text = "Đã duyệt";
            break;
          case "DENIED":
            color = "red";
            icon = <CloseCircleOutlined />;
            text = "Đã từ chối";
            break;
          case "COMPLETED":
            color = "blue";
            icon = <CheckSquareOutlined />;
            text = "Đã hoàn thành";
            break;
          default:
            color = "default";
            text = status || "Không xác định";
        }
        return (
          <Tag icon={icon} color={color}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: "Mới đặt", value: "BOOKED" },
        { text: "Đã duyệt", value: "ACCEPTED" },
        { text: "Đã từ chối", value: "DENIED" },
        { text: "Đã hoàn thành", value: "COMPLETED" },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleUpdateStatus(record.id, "ACCEPTED")}
            disabled={record.status !== "BOOKED"}
          >
            Duyệt
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn từ chối?"
            onConfirm={() => handleUpdateStatus(record.id, "DENIED")}
            okText="Chắc chắn"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<CloseCircleOutlined />}
              disabled={record.status !== "BOOKED"}
            >
              Từ chối
            </Button>
          </Popconfirm>
          <Button
            onClick={() => handleUpdateStatus(record.id, "COMPLETED")}
            disabled={record.status !== "ACCEPTED"}
            icon={<CheckSquareOutlined />}
          >
            Hoàn tất
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Quản lý Lịch hẹn Tư vấn
        </h2>
        <Button
          onClick={fetchAllData}
          loading={loading}
          icon={<SyncOutlined />}
        >
          Làm mới
        </Button>
      </div>
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: true }}
        scroll={{ x: "max-content" }}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
}

export default BookingManagement;
