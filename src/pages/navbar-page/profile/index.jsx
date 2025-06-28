import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  DatePicker,
  Card,
  Typography,
  Divider,
  Space,
  message,
  Tabs, // Import Tabs component
} from "antd";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs; // Destructure TabPane from Tabs

const UserProfile = () => {
  const [profile, setProfile] = useState([]);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingSmoking, setEditingSmoking] = useState(false);
  const [activeTab, setActiveTab] = useState("personal"); // State to manage active tab

  const [personalForm] = Form.useForm();
  const [smokingForm] = Form.useForm();

  // Fetch account information
  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/me");
      console.log(response.data);
      setProfile(response.data);
      personalForm.setFieldsValue(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Không thể tải thông tin tài khoản");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch smoking information
  const fetchInitStatus = async () => {
    try {
      const response = await api.get("/initial-condition/active");
      console.log(response.data);
      // Convert date string to dayjs object for DatePicker
      const data = { ...response.data };
      if (data.desiredQuitDate) {
        data.desiredQuitDate = dayjs(data.desiredQuitDate);
      }
      smokingForm.setFieldsValue(data);
    } catch {
      toast.error("Không thể tải thông tin hút thuốc");
    }
  };

  useEffect(() => {
    fetchInitStatus();
  }, []);

  /* ---------------------- Submit handlers ---------------------- */
  const handleSubmitProfile = async () => {
    try {
      const values = await personalForm.validateFields();
      const { data } = await api.put("/user/me", values);
      setProfile(data);
      personalForm.setFieldsValue(data);
      message.success("Cập nhật thông tin cá nhân thành công!");
      setEditingPersonal(false);
    } catch (err) {
      if (err?.errorFields) return; // validation error
      message.error("Cập nhật thông tin cá nhân không thành công");
    }
  };

  const handleSaveSmoking = async () => {
    try {
      const values = await smokingForm.validateFields();
      const body = {
        ...values,
        desiredQuitDate: values.desiredQuitDate
          ? values.desiredQuitDate.format("YYYY-MM-DD")
          : "",
      };
      await api.put("/initial-condition", body);
      message.success("Cập nhật thông tin hút thuốc thành công!");
      setEditingSmoking(false);
    } catch (err) {
      if (err?.errorFields) return;
      message.error("Cập nhật thông tin hút thuốc không thành công");
    }
  };

  const formatCurrency = (v) =>
    v ? `${Number(v).toLocaleString("vi-VN")} ₫` : "";

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <Title level={2} className="text-center">
            Thông tin tài khoản
          </Title>

          <Tabs defaultActiveKey="personal" activeKey={activeTab} onChange={setActiveTab}>
            {/* ------------------ Thông tin cá nhân ------------------ */}
            <TabPane tab={<Title level={4}>Thông tin cá nhân</Title>} key="personal">
              <Card bordered={false}>
                <Form form={personalForm} layout="vertical" disabled={!editingPersonal}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="fullName"
                      label="Họ và tên"
                      rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                    >
                      <Input placeholder="Nhập họ tên" />
                    </Form.Item>

                    <Form.Item
                      name="gender"
                      label="Giới tính"
                      rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                    >
                      <Select placeholder="Chọn giới tính">
                        <Option value="MALE">Nam</Option>
                        <Option value="FEMALE">Nữ</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                      <Input disabled />
                    </Form.Item>

                    <Form.Item name="username" label="Tên đăng nhập">
                      <Input disabled />
                    </Form.Item>
                  </div>

                  {profile?.premium !== undefined && (
                    <>
                      <Divider />
                      <Text strong>Trạng thái tài khoản: </Text>
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          profile.premium
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {profile.premium ? "Premium" : "Miễn phí"}
                      </span>
                    </>
                  )}
                </Form>

                <Divider />
                <Space>
                  {editingPersonal ? (
                    <>
                      <Button type="primary" onClick={handleSubmitProfile}>
                        Lưu
                      </Button>
                      <Button
                        onClick={() => {
                          personalForm.setFieldsValue(profile);
                          setEditingPersonal(false);
                        }}
                      >
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button type="primary" onClick={() => setEditingPersonal(true)}>
                      Chỉnh sửa
                    </Button>
                  )}
                </Space>
              </Card>
            </TabPane>

            {/* ------------------ Thông tin hút thuốc ------------------ */}
            <TabPane tab={<Title level={4}>Thông tin hút thuốc</Title>} key="smoking">
              <Card bordered={false}>
                <Form form={smokingForm} layout="vertical" disabled={!editingSmoking}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cơ bản */}
                    <div>
                      <Title level={5}>Thông tin cơ bản</Title>
                      <Form.Item
                        name="startSmokingAge"
                        label="Tuổi bắt đầu hút thuốc"
                        rules={[{ required: true, type: "number", min: 10, max: 80 }]}
                      >
                        <InputNumber min={10} max={80} style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        name="reasonForStarting"
                        label="Lý do bắt đầu hút thuốc"
                        rules={[{ required: true, min: 5 }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="weightKg"
                        label="Cân nặng (kg)"
                        rules={[{ required: true, type: "number", min: 0.1, max: 300 }]}
                      >
                        <InputNumber min={0.1} max={300} style={{ width: "100%" }} />
                      </Form.Item>
                    </div>

                    {/* Hút thuốc hiện tại */}
                    <div>
                      <Title level={5}>Thông tin hút thuốc</Title>
                      <Form.Item
                        name="cigarettesPerDay"
                        label="Số điếu mỗi ngày"
                        rules={[{ required: true, type: "number", min: 0, max: 100 }]}
                      >
                        <InputNumber min={0} max={100} style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        name="firstSmokeTime"
                        label="Mốc thời gian hút điếu đầu tiên"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Chọn thời gian">
                          {[
                            "morning",
                            "breakfast",
                            "mid_morning",
                            "lunch",
                            "afternoon",
                            "dinner",
                            "evening",
                            "late_night",
                            "stress",
                            "social",
                            "coffee",
                            "other",
                          ].map((k) => (
                            <Option key={k} value={k}>
                              {k}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="pricePerCigarette"
                        label="Giá mỗi điếu (VNĐ)"
                        formatter={formatCurrency}
                        parser={(v) => v.replace(/\D+/g, "")}
                        rules={[{ required: true, type: "number", min: 500, max: 200000 }]}
                      >
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        name="cigarettesPerPack"
                        label="Số điếu mỗi bao"
                        rules={[{ required: true, type: "number", min: 1, max: 100 }]}
                      >
                        <InputNumber min={1} max={100} style={{ width: "100%" }} />
                      </Form.Item>
                    </div>

                    {/* Bổ sung */}
                    <div>
                      <Title level={5}>Thông tin bổ sung</Title>
                      <Form.Item
                        name="hasTriedToQuit"
                        label="Đã từng cố bỏ thuốc?"
                        rules={[{ required: true }]}
                      >
                        <Radio.Group>
                          <Radio value={true}>Có</Radio>
                          <Radio value={false}>Không</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="hasHealthIssues"
                        label="Có vấn đề sức khỏe liên quan?"
                        rules={[{ required: true }]}
                      >
                        <Radio.Group>
                          <Radio value={true}>Có</Radio>
                          <Radio value={false}>Không</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="quitReason"
                        label="Lý do muốn bỏ thuốc"
                        rules={[{ required: true, min: 5 }]}
                      >
                        <TextArea rows={3} />
                      </Form.Item>
                      <Form.Item
                        name="intentionSince"
                        label="Bạn đã có ý định bỏ thuốc từ khi nào?"
                      >
                        <Input placeholder="Ví dụ: 1 tháng trước, 1 năm trước..." />
                      </Form.Item>
                      <Form.Item
                        name="readinessScale"
                        label="Mức độ sẵn sàng bỏ thuốc (1-10)"
                      >
                        <InputNumber min={1} max={10} style={{ width: "100%" }} placeholder="Ví dụ: 7" />
                      </Form.Item>
                      <Form.Item
                        name="emotion"
                        label="Cảm xúc hiện tại khi nghĩ đến việc bỏ thuốc"
                      >
                        <Input placeholder="Ví dụ: lo lắng, tự tin, sợ hãi..." />
                      </Form.Item>
                      <Form.Item
                        name="desiredQuitDate"
                        label="Ngày mong muốn bắt đầu cai thuốc"
                      >
                        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled />
                      </Form.Item>
                    </div>
                  </div>
                </Form>

                <Divider />
                <Space>
                  {editingSmoking ? (
                    <>
                      <Button type="primary" onClick={handleSaveSmoking}>
                        Lưu
                      </Button>
                      <Button
                        onClick={async () => {
                          await fetchInitStatus();
                          setEditingSmoking(false);
                        }}
                      >
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button type="primary" onClick={() => setEditingSmoking(true)}>
                      Chỉnh sửa
                    </Button>
                  )}
                </Space>
              </Card>
            </TabPane>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;