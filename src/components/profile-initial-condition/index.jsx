import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

function ProfileInitialCondition() {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [hasActivePackage, setHasActivePackage] = useState(false);

  const fetchInitialCondition = async () => {
    try {
      const response = await api.get("/initial-condition/active");
      form.setFieldsValue(response.data);
      console.log(response.data);
      toast.success("Lấy dữ liệu thành công");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi lấy dữ liệu");
    }
  };

  useEffect(() => {
    // Kiểm tra gói active
    const checkActivePackage = async () => {
      try {
        const res = await api.get('/purchased-plan/active');
        if (res.data && res.data.status === "ACTIVE") {
          setHasActivePackage(true);
        } else {
          setHasActivePackage(false);
        }
      } catch {
        setHasActivePackage(false);
      }
    };
    checkActivePackage();
    fetchInitialCondition();
  }, []);
  const handleEdit = () => {
    setEditing(true);
  };
  const handleCancel = () => {
    setEditing(false);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await api.put("/initial-condition", values);
      console.log(response.data);
      form.setFieldsValue(response.data);
      toast.success("Cập nhật dữ liệu thành công");
      setEditing(false);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi cập nhật dữ liệu");
    }
  };

  const addictionLevelMap = {
    LIGHT: "Nhẹ",
    MODERATE: "Trung bình",
    SEVERE: "Nặng",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-xl border-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <Form.Item
              name="cigarettesPerDay"
              label="Số lượng điếu thuốc lá hút mỗi ngày"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng điếu thuốc lá hút mỗi ngày" },
                {
                  type: "number",
                  min: 0,
                  max: 50,
                  message: "Số điếu mỗi ngày phải từ 0 đến 50, không được phép là số âm",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Ví dụ: 10" disabled={!editing || hasActivePackage} />
            </Form.Item>

            <Form.Item
              name="firstSmokeTime"
              label="Thời điểm hút điếu thuốc lá đầu tiên trong ngày"
              rules={[{ required: true, message: "Vui lòng chọn thời điểm" }]}
            >
              <Select placeholder="-- Chọn thời gian --" disabled={!editing}>
                <Option value="morning">Sáng sớm (5h-8h)</Option>
                <Option value="breakfast">Sau bữa sáng</Option>
                <Option value="mid_morning">Giữa buổi sáng</Option>
                <Option value="lunch">Sau bữa trưa</Option>
                <Option value="afternoon">Buổi chiều</Option>
                <Option value="dinner">Sau bữa tối</Option>
                <Option value="evening">Buổi tối</Option>
                <Option value="late_night">Đêm khuya</Option>
                <Option value="stress">Khi căng thẳng</Option>
                <Option value="social">Gặp bạn bè</Option>
                <Option value="coffee">Uống cà phê</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="quitReason"
              label="Lý do muốn bỏ thuốc lá"
              rules={[
                { required: true, message: "Vui lòng nhập lý do" },
                { min: 5, message: "Tối thiểu 5 ký tự" },
                { max: 300, message: "Vui lòng giới hạn dưới 300 ký tự." },
                {
                  pattern: /^(?!\s).+/, message: "Không được bắt đầu bằng khoảng trắng!",
                },
                {
                  pattern: /.*[a-zA-ZÀ-Ỹà-ỹ].*[a-zA-ZÀ-Ỹà-ỹ].*[a-zA-ZÀ-Ỹà-ỹ].*[a-zA-ZÀ-Ỹà-ỹ].*[a-zA-ZÀ-Ỹà-ỹ].*/,
                  message: "Lý do phải chứa ít nhất 5 chữ cái",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Ví dụ: Giảm căng thẳng, bảo vệ sức khỏe, vì con cái..."
                autoSize={{ minRows: 2, maxRows: 6 }}
                showCount
                maxLength={300}
                disabled={!editing}
              />
            </Form.Item>

            <Form.Item
              name="emotion"
              label="Cảm xúc khi hút thuốc lá"
              rules={[
                { required: true, message: "Vui lòng nhập cảm xúc" },
                { min: 5, message: "Tối thiểu 5 ký tự" },
                {
                  pattern: /^(?!\s).+/, message: "Không được bắt đầu bằng khoảng trắng!",
                },
                {
                  pattern: /.*[a-zA-ZÀ-Ỹà-ỹ].*[a-zA-ZÀ-Ỹà-ỹ].*[a-zA-ZÀ-Ỹà-ỹ].*[a-zA-ZÀ-Ỹà-ỹ].*[a-zA-ZÀ-Ỹà-ỹ].*/,
                  message: "Lý do phải chứa ít nhất 5 chữ cái",
                },
              ]}
            >
              <Input
                className="w-full"
                placeholder="Ví dụ: Thư giãn, căng thẳng, lo lắng, tự tin..."
                disabled={!editing}
              />
            </Form.Item>

            <Divider />

            <Form.Item
              name="pricePerCigarette"
              label="Giá mỗi điếu thuốc lá (VNĐ)"
              rules={[
                { required: true, message: "Vui lòng nhập giá" },
                {
                  type: "number",
                  min: 2000,
                  max: 50000,
                  message: "Giá mỗi điếu thuốc lá phải từ 2000 đến 50.000 VNĐ",
                },
                {
                  pattern: /^\d+$/,
                  message:
                    "Chỉ được nhập số, không được chứa chữ cái hoặc ký tự đặc biệt!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Ví dụ: 2000"
                formatter={(v) => v && Number(v).toLocaleString("vi-VN")}
                parser={(v) => v.replace(/\D/g, "")}
                disabled={!editing || hasActivePackage}
              />
            </Form.Item>

            <Form.Item
              name="hasTriedToQuit"
              label="Bạn đã từng cố bỏ thuốc lá chưa?"
              rules={[{ required: true, message: "Vui lòng chọn" }]}
            >
              <Radio.Group disabled={!editing}>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="hasHealthIssues"
              label="Bạn có vấn đề sức khỏe liên quan?"
              rules={[{ required: true, message: "Vui lòng chọn" }]}
            >
              <Radio.Group disabled={!editing}>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Mức độ nghiện">
              <Input
                disabled
                value={
                  addictionLevelMap[form.getFieldValue("addictionLevel")] ||
                  "Đang tải..."
                }
              />
            </Form.Item>
            <div className="text-center">
              {editing ? (
                <>
                  <Button type="primary" onClick={() => form.submit()}>
                    Lưu
                  </Button>
                  <Button htmlType="button" onClick={handleCancel} className="ml-2">
                    Hủy
                  </Button>
                </>
              ) : (
                <Button icon={<EditOutlined />} htmlType="button" onClick={handleEdit}>
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default ProfileInitialCondition;
