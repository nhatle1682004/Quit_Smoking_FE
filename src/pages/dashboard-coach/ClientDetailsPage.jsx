import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../../configs/axios";
import {
  Form,
  Input,
  Button,
  Table,
  Typography,
  Card,
  Spin,
  Empty,
  Breadcrumb,
  InputNumber,
  Tag,
  DatePicker,
} from "antd";
import { SendOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer và toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify

const { Title } = Typography;
const { TextArea } = Input;

function ClientDetailsPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const { clientId } = useParams();
  const location = useLocation();
  const clientName = location.state?.clientName || "Client";

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/coach/client/${clientId}/daily-tasks`);
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

  const handleAssignTask = async (values) => {
    setIsSubmitting(true);
    try {
      const formattedDate = values.date.format("YYYY-MM-DD");

      const payload = {
        date: formattedDate,
        targetSmokePerDay: values.targetSmokePerDay,
        note: values.note,
      };

      await api.post(`/coach/client/${clientId}/daily-task`, payload);

      // THAY ĐỔI: Sử dụng toast.success để hiển thị thông báo
      toast.success(
        `Đã giao nhiệm vụ cho ${clientName} vào ngày ${formattedDate} thành công!`
      );
      form.resetFields();
      fetchTasks();
    } catch (err) {
      console.error("Failed to assign task:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Giao nhiệm vụ thất bại. Vui lòng thử lại.";
      // THAY ĐỔI: Sử dụng toast.error để hiển thị thông báo lỗi
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

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

        <Card title="Giao nhiệm vụ mới" className="mb-8 shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAssignTask}
            initialValues={{
              date: dayjs(),
              targetSmokePerDay: 5,
              note: "uống nhiều nước !",
            }}
          >
            <Form.Item
              name="date"
              label="Ngày giao nhiệm vụ"
              rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item
              name="targetSmokePerDay"
              label="Số điếu thuốc mục tiêu"
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
              rowKey={(record) => record.id || record.date}
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
            />
          )}
        </Card>
      </div>
      <ToastContainer />{" "}
      {/* THÊM: Component ToastContainer để hiển thị thông báo */}
    </div>
  );
}

export default ClientDetailsPage;
