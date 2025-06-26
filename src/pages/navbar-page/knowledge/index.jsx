import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, TimePicker, Radio, message, Card } from 'antd';
import { CalendarOutlined, UserOutlined, FieldTimeOutlined, CommentOutlined, VideoCameraOutlined, HomeOutlined } from '@ant-design/icons';

function BookingConsultPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Giả lập gửi dữ liệu, thực tế sẽ gọi API
    setTimeout(() => {
      setLoading(false);
      message.success('Đặt lịch tư vấn thành công! Chuyên gia sẽ liên hệ với bạn sớm.');
      form.resetFields();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-10 px-2">
      <Card className="w-full max-w-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-blue-700 text-center">Đặt lịch tư vấn chuyên gia</h1>
        <p className="text-gray-600 mb-8 text-center">
          Hãy chọn thời gian phù hợp để được kết nối với chuyên gia cai nghiện thuốc lá. Chúng tôi sẽ xác nhận lịch hẹn qua email hoặc điện thoại của bạn.
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên của bạn" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Chọn ngày tư vấn"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" prefix={<CalendarOutlined />} />
          </Form.Item>

          <Form.Item
            name="time"
            label="Chọn giờ tư vấn"
            rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
          >
            <TimePicker className="w-full" format="HH:mm" minuteStep={15} prefix={<FieldTimeOutlined />} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Hình thức tư vấn"
            initialValue="online"
            rules={[{ required: true, message: 'Vui lòng chọn hình thức tư vấn!' }]}
          >
            <Radio.Group className="w-full flex">
              <Radio.Button value="online" className="flex-1 text-center"><VideoCameraOutlined /> Online</Radio.Button>
              <Radio.Button value="offline" className="flex-1 text-center"><HomeOutlined /> Trực tiếp</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú cho chuyên gia (tuỳ chọn)"
          >
            <Input.TextArea rows={3} placeholder="Bạn muốn chuyên gia lưu ý điều gì?" prefix={<CommentOutlined />} />
          </Form.Item>

          <Form.Item className="text-center mt-6">
            <Button type="primary" htmlType="submit" loading={loading} size="large" className="px-10">
              Đặt lịch tư vấn
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default BookingConsultPage;
