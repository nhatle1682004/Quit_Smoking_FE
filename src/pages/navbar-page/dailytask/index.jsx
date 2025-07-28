import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../../../configs/axios"; // Adjust path as per your project structure
import {
  Table,
  Spin,
  Empty,
  Typography,
  Card,
  message,
  Tag,
  Breadcrumb,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs"; // For date formatting

const { Title } = Typography;

function DailyTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userBlockMessage, setUserBlockMessage] = useState(null); // Message for package check
  const currentUser = useSelector((state) => state.user); // Get current user from Redux

  // Function to fetch daily tasks for the current user
  const fetchTasks = useCallback(async () => {
    if (!currentUser?.id) {
      setIsLoading(false);
      setUserBlockMessage("Vui lòng đăng nhập để đặt lịch hẹn.");
      return;
    }
    setIsLoading(true);
    const apiConfig = {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    };

    try {
      const planRes = await api.get("/purchased-plan/my", apiConfig);
      const activePlan = planRes.data.find((plan) => plan.status === "ACTIVE");

      if (!activePlan || activePlan.packageInfo.code != 4) {
        setUserBlockMessage(
          'Bạn cần đăng ký gói "Cao Cấp" để sử dụng tính năng này.'
        );
        setIsLoading(false);
        return;
      }

      // If user has the premium package, fetch their daily tasks history
      // UPDATED: Use the /api/daily-task/history endpoint
      const response = await api.get(`/daily-task/history`, apiConfig);
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch daily tasks:", err);
      // Handle specific error messages from backend if available
      const errorMessage =
        err.response?.data?.message ||
        "Không thể tải danh sách nhiệm vụ. Vui lòng thử lại.";
      setError(errorMessage);
      setTasks([]); // Clear tasks on error
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]); // Re-run if currentUser changes

  // Effect to fetch tasks on component mount or when currentUser changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "N/A"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(), // Sort by date
    },
    {
      title: "Mục tiêu (Số điếu bạn nên hút trong ngày)",
      dataIndex: "targetSmokePerDay",
      key: "targetSmokePerDay",
      align: "center",
      sorter: (a, b) => a.targetSmokePerDay - b.targetSmokePerDay,
    },
    {
      title: "Ghi chú từ Coach",
      dataIndex: "note",
      key: "note",
      render: (text) => text || "Không có ghi chú", // Display a default if note is empty
    },
  ];

  // Conditional rendering for the package check message
  if (userBlockMessage) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md w-full">
          <ExclamationCircleOutlined className="text-yellow-500 text-5xl mx-auto mb-4" />
          <Title level={3} className="text-xl font-bold mb-2">
            Thông báo
          </Title>
          <p className="text-gray-700 mb-4">{userBlockMessage}</p>
          <Link
            to="/package"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xem các gói dịch vụ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined /> Trang chủ
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <UserOutlined /> Nhiệm vụ hàng ngày
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} className="mb-6 text-gray-800">
          Nhiệm vụ hàng ngày của bạn
        </Title>

        <Card title="Danh sách nhiệm vụ" className="shadow-md rounded-lg">
          {isLoading ? (
            <div className="text-center p-8">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Đang tải nhiệm vụ...</p>
            </div>
          ) : error ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className="text-red-500">{error}</span>}
              s
            />
          ) : tasks.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Bạn chưa có nhiệm vụ nào được giao."
            />
          ) : (
            <Table
              columns={columns}
              dataSource={tasks}
              rowKey={(record) => record.id || record.date} // Use a unique ID or date as key
              pagination={{ pageSize: 10 }} // Paginate with 10 items per page
              scroll={{ x: "max-content" }} // Enable horizontal scroll for smaller screens
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default DailyTaskPage;
