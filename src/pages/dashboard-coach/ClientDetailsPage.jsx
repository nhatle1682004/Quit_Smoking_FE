import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../../configs/axios";
import {
  Form,
  Input,
  Button,
  Table,
  Typography,
  message,
  Card,
  Spin,
  Empty,
  Breadcrumb,
  InputNumber, // Import InputNumber
  Tag, // Import Tag
} from "antd";
import { SendOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

function ClientDetailsPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const { clientId } = useParams(); // Lấy ID khách hàng từ URL
  const location = useLocation(); // Lấy state được truyền từ Link
  const clientName = location.state?.clientName || "Client";

  // Hàm để lấy danh sách các nhiệm vụ đã giao
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Giả định {purchasedPlanId} có thể được thay thế bằng ID của khách hàng
      const response = await api.get(
        `/api/coach/client/${clientId}/daily-tasks`
      );
      // Giả định response trả về một mảng các nhiệm vụ
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(
        "Không thể tải danh sách nhiệm vụ của khách hàng. Vui lòng thử lại."
      );
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      fetchTasks();
    }
  }, [clientId, fetchTasks]);

  // Hàm để xử lý việc giao nhiệm vụ mới
  const handleAssignTask = async (values) => {
    setIsSubmitting(true);
    try {
      // Tính toán ngày mai theo định dạng YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
      const day = String(tomorrow.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      // Xây dựng payload dựa trên định dạng request body mới
      const payload = {
        purchasedPlanId: parseInt(clientId, 10), // Giả định clientId là purchasedPlanId
        date: formattedDate,
        targetSmokePerDay: values.targetSmokePerDay,
        note: values.note,
      };

      // Sử dụng API POST để giao nhiệm vụ mới
      // Giả định {clientUsername} trong endpoint có thể được thay thế bằng clientId
      await api.post(`/api/coach/client/${clientId}/daily-task`, payload);

      message.success(
        `Đã giao nhiệm vụ cho ngày ${formattedDate} thành công đến ${clientName}!`
      );
      form.resetFields();
      fetchTasks(); // Tải lại danh sách nhiệm vụ để hiển thị nhiệm vụ mới
    } catch (err) {
      console.error("Failed to assign task:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Giao nhiệm vụ thất bại. Vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cập nhật các cột để khớp với cấu trúc dữ liệu nhiệm vụ mới
  const columns = [
    {
      title: "Ngày thực hiện",
      dataIndex: "date",
      key: "date",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Mục tiêu (điếu)",
      dataIndex: "targetSmokePerDay",
      key: "targetSmokePerDay",
      align: "center",
    },
    {
      title: "Ghi chú từ Coach",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "COMPLETED" ? "green" : "blue";
        return <Tag color={color}>{status || "PENDING"}</Tag>;
      },
    },
  ];

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/dashboard-coach">
              <UserOutlined /> <span>Quản lý khách hàng</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{clientName}</Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} className="mb-6">
          Nhiệm vụ hàng ngày cho {clientName}
        </Title>

        {/* Form đã được cập nhật để giao nhiệm vụ */}
        <Card title="Giao nhiệm vụ mới cho ngày mai" className="mb-8 shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAssignTask}
            initialValues={{ targetSmokePerDay: 5, note: "uống nhiều nước !" }}
          >
            <Form.Item
              name="targetSmokePerDay"
              label="Số điếu thuốc mục tiêu cho ngày mai"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điếu thuốc mục tiêu!",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Ví dụ: 5"
              />
            </Form.Item>
            <Form.Item
              name="note"
              label="Ghi chú cho khách hàng"
              rules={[{ required: true, message: "Vui lòng nhập ghi chú!" }]}
            >
              <TextArea rows={4} placeholder="Ví dụ: 'Nhớ uống nhiều nước!'" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                icon={<SendOutlined />}
              >
                Giao nhiệm vụ
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Lịch sử nhiệm vụ đã giao" className="shadow-md">
          {isLoading ? (
            <div className="text-center p-8">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Empty description={error} />
          ) : (
            <Table
              columns={columns}
              dataSource={tasks}
              rowKey={(record) => record.id || record.date} // Sử dụng key duy nhất, fallback về date
              pagination={{ pageSize: 5 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default ClientDetailsPage;
