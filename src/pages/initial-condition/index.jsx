import React from "react";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Button,
  Card,
  Typography,
  Divider,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

function InitialCondition() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await api.post("/initial-condition", values);
      toast.success("Khai báo thành công!");
      navigate("/");
    } catch (err) {
      console.log(err.response.data);
      toast.error("Lỗi khi khai báo thông tin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-xl border-0">
          <div className="text-center mb-8">
            <Title level={1} className="text-blue-600 mb-4">
              📋 Khai báo tình trạng hút thuốc ban đầu
            </Title>
            <Text className="text-lg text-gray-600">
              Hãy cung cấp thông tin chính xác để chúng tôi có thể hỗ trợ bạn
              tốt nhất
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <Form.Item
              name="cigarettesPerDay"
              label="Số lượng thuốc lá hút mỗi ngày"
              rules={[
                { required: true, message: "Vui lòng nhập số điếu mỗi ngày" },
                {
                  pattern: /^\d+$/,
                  message:
                    "Chỉ được nhập số, không được chứa chữ cái hoặc ký tự đặc biệt!",
                },
                {
                  type: "number",
                  min: 0,
                  max: 50,
                  message: "Số điếu mỗi ngày phải từ 0 đến 100, không được phép là số âm",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Ví dụ: 10" />
            </Form.Item>

            <Form.Item
              name="firstSmokeTime"
              label="Thời điểm hút điếu đầu tiên"
              rules={[{ required: true, message: "Vui lòng chọn thời điểm" }]}
            >
              <Select placeholder="-- Chọn thời gian --">
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
              name="reasonForStarting"
              label="Lý do bắt đầu hút thuốc"
              rules={[
                { required: true, message: "Vui lòng nhập lý do" },
                { min: 5, message: "Tối thiểu 5 ký tự" },
                {
                  pattern: /^(?!\s)/,
                  message: "Không được bắt đầu bằng khoảng trắng!",
                },
                {
                  max: 300,
                  message: "Lý do quá dài, vui lòng rút gọn dưới 300 ký tự!",
                },
               
              ]}
            >
              <TextArea
                autoSize={{ minRows: 3, maxRows: 6 }}
                placeholder="Ví dụ: Do áp lực công việc, bạn bè rủ rê, tò mò..."
              />
            </Form.Item>

            <Form.Item
              name="quitReason"
              label="Lý do muốn bỏ thuốc"
              rules={[
                { required: true, message: "Vui lòng nhập lý do" },
                { min: 5, message: "Tối thiểu 5 ký tự" },
                { max: 300, message: "Vui lòng giới hạn dưới 300 ký tự." },
                {
                  pattern: /^(?!\s).+/,
                  message: "Không được bắt đầu bằng khoảng trắng!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Bạn thường hút thuốc khi nào? "
                autoSize={{ minRows: 3, maxRows: 6 }}
                showCount
                maxLength={300}
              />
            </Form.Item>

            <Form.Item
              name="readinessScale"
              label="Mức độ sẵn sàng bỏ thuốc (1-10)"
              rules={[
                { required: true, message: "Vui lòng nhập mức độ từ 1 đến 10" },
                {
                  type: "number",
                  min: 1,
                  max: 10,
                  message: "Mức độ phải từ 1 đến 10",
                },
              ]}
            >
              <InputNumber className="w-full" placeholder="Ví dụ: 7" />
            </Form.Item>

            <Form.Item
              name="emotion"
              label="Cảm xúc khi hút thuốc"
              rules={[
                { required: true, message: "Vui lòng nhập cảm xúc" },
                { min: 5, message: "Tối thiểu 5 ký tự" },
                                {
                  pattern: /^(?!\s).+/,
                  message: "Không được bắt đầu bằng khoảng trắng!",
                },
                
              ]}
            >
              <Input
                className="w-full"
                placeholder="Ví dụ: Thư giãn, căng thẳng, lo lắng, tự tin..."
              />
            </Form.Item>

            <Divider />

            <Form.Item
              name="pricePerCigarette"
              label="Giá mỗi điếu thuốc (VNĐ)"
              rules={[
                { required: true, message: "Vui lòng nhập giá" },
                {
                  type: "number",
                  min: 2000,
                  max: 200000,
                  message: "Giá mỗi điếu phải từ 2000 đến 200.000 VNĐ",
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
              />
            </Form.Item>

            <Form.Item
              name="cigarettesPerPack"
              label="Số điếu trong một bao"
              rules={[
                { required: true, message: "Vui lòng nhập số điếu" },
                {
                  type: "number",
                  min: 1,
                  max: 50,
                  message: "Số điếu/bao phải từ 1 đến 100, không được phép là số âm",
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
                placeholder="Thường là 20"
              />
            </Form.Item>

            <Form.Item
              name="weightKg"
              label="Cân nặng hiện tại (kg)"
              rules={[
                { required: true, message: "Vui lòng nhập cân nặng" },
                {
                  type: "number",
                  min: 1,
                  max: 300,
                  message: "Cân nặng phải từ 1 đến 300 kg, không được phép là số âm",
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
                step={0.1}
                placeholder="Ví dụ: 65.5"
              />
            </Form.Item>

            <Divider />

            <Form.Item
              name="hasTriedToQuit"
              label="Bạn đã từng cố bỏ thuốc?"
              rules={[{ required: true, message: "Vui lòng chọn" }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="hasHealthIssues"
              label="Bạn có vấn đề sức khỏe liên quan?"
              rules={[{ required: true, message: "Vui lòng chọn" }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
            <div className="text-center">
              <Button type="primary" htmlType="submit" size="large">
                Gửi khai báo
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default InitialCondition;
