import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Modal,
  Card,
  Typography,
  Form,
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../configs/axios"; // Adjust path as necessary

// Import Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import component NotificationStats
import NotificationStats from "./NotificationStats"; // Điều chỉnh đường dẫn này nếu NotificationStats.js ở thư mục khác

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Component này đóng vai trò là công cụ quản lý thông báo trung tâm cho Admin
function Notifications() {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [sendToAllCustomers, setSendToAllCustomers] = useState(true);
  const [customerList, setCustomerList] = useState([]); // State để lưu danh sách khách hàng
  const [fetchingCustomers, setFetchingCustomers] = useState(false); // State để quản lý loading của danh sách khách hàng

  // Hàm để fetch danh sách khách hàng (người dùng)
  const fetchCustomerList = async () => {
    setFetchingCustomers(true);
    try {
      // Gọi API GET /api/user để lấy danh sách người dùng
      const response = await api.get("/user"); //

      // Giả định API /api/user trả về một mảng các đối tượng người dùng
      // Mỗi đối tượng có ít nhất một trường 'id' và có thể là 'username' hoặc 'name'
      // Bạn cần điều chỉnh map này nếu cấu trúc dữ liệu trả về khác
      const formattedCustomers = response.data.map((user) => ({
        id: user.id, // Sử dụng user.id làm giá trị
        name: user.username || user.name || user.id, // Hiển thị username, hoặc name, hoặc id
      }));
      setCustomerList(formattedCustomers);
      // toast.info("Danh sách khách hàng đã được tải từ API."); // Thông báo đã tải dữ liệu thật
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
      toast.error(
        "Không thể tải danh sách khách hàng. Vui lòng kiểm tra API /api/user."
      ); //
    } finally {
      setFetchingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, []);

  const handleModalOpen = () => {
    form.resetFields();
    form.setFieldsValue({
      sendToAllCustomers: true,
      recipientIds: [],
    });
    setSendToAllCustomers(true);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      senderId: 0, // GÁN CỨNG senderId = 0 theo yêu cầu
      title: values.title,
      message: values.description,
      type: values.type,
      isSendToAllCustomers: values.sendToAllCustomers,
      recipientIds: values.recipientIds,
    };

    if (payload.isSendToAllCustomers) {
      payload.recipientIds = [];
    } else {
      if (
        !Array.isArray(payload.recipientIds) ||
        payload.recipientIds.length === 0
      ) {
        toast.error(
          "Vui lòng nhập ít nhất một ID người nhận hoặc chọn 'Gửi tới tất cả khách hàng'."
        );
        return;
      }
    }

    delete payload.sendToAllCustomers;
    delete payload.description;

    try {
      await api.post("/notifications/send-to-all-customers", payload); //
      toast.success("Thông báo đã được gửi thành công!");
      handleModalClose();
    } catch (error) {
      console.error(
        "Gửi thông báo thất bại:",
        error.response ? error.response.data : error.message
      );
      let errorMessage =
        "Gửi thông báo thất bại. Vui lòng kiểm tra API và payload.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Hiển thị component thống kê thông báo */}
      <NotificationStats />

      <Card className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={3}>Gửi Thông báo mới</Title>
            <Text type="secondary">
              Gửi thông báo hệ thống hoặc chương trình đến khách hàng.
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleModalOpen()}
          >
            Tạo & Gửi Thông báo
          </Button>
        </div>

        {/* Bảng danh sách thông báo đã bị loại bỏ vì không có API để lấy dữ liệu */}
        {/* <Card className="text-center p-10 text-gray-500">
          <Text strong>
            Không có API để hiển thị danh sách tất cả thông báo đã tạo.
          </Text>
          <br />
          <Text>
            Để có chức năng quản lý và xem danh sách thông báo, cần triển khai
            API GET /api/notifications/all.
          </Text>
        </Card> */}
      </Card>

      <Modal
        title="Tạo & Gửi Thông báo"
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Gửi
          </Button>,
        ]}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tiêu đề thông báo!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Nội dung"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập nội dung thông báo!",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại"
            rules={[
              { required: true, message: "Vui lòng chọn loại thông báo!" },
            ]}
          >
            <Select placeholder="Chọn loại thông báo">
              <Option value="system">System</Option>
              <Option value="program">Program</Option>
              <Option value="announcement">Announcement</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Gửi tới tất cả khách hàng"
            name="sendToAllCustomers"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="Tất cả khách hàng"
              unCheckedChildren="Khách hàng cụ thể"
              onChange={(checked) => setSendToAllCustomers(checked)}
            />
          </Form.Item>

          {!sendToAllCustomers && (
            <Form.Item
              name="recipientIds"
              label="ID người nhận"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ít nhất một ID người nhận!",
                },
              ]}
              tooltip="Nhập ID khách hàng cách nhau bằng dấu phẩy (ví dụ: ID1,ID2,ID3). Bạn có thể chọn từ danh sách hoặc tự nhập."
            >
              <Select
                mode="tags"
                placeholder={
                  fetchingCustomers
                    ? "Đang tải khách hàng..."
                    : "Chọn hoặc nhập ID khách hàng"
                }
                tokenSeparators={[",", " "]}
                disabled={fetchingCustomers}
                loading={fetchingCustomers}
              >
                {/* Render options từ danh sách khách hàng đã fetch */}
                {customerList.map((customer) => (
                  <Option key={customer.id} value={customer.id}>
                    {customer.name
                      ? `${customer.name} (${customer.id})`
                      : customer.id}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Notifications;
