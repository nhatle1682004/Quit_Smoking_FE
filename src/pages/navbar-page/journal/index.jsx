import React, { useState } from 'react';
import { Card, Button, Input, InputNumber, DatePicker, Form, List, Typography, Select, Row, Col, Statistic } from 'antd';
import dayjs from 'dayjs';
import { HeartOutlined, SmileOutlined, CloudOutlined, SkinOutlined, FundOutlined, DashboardOutlined, FireOutlined, DollarOutlined, RadarChartOutlined } from '@ant-design/icons';

function LogSmoking() {
  const [form] = Form.useForm();
  const [logs, setLogs] = useState([]);

  const handleAddLog = (values) => {
    setLogs([
      {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        key: Date.now(),
      },
      ...logs,
    ]);
    form.resetFields();
    form.setFieldValue('date', dayjs());
  };

  const healthIndicators = [
    {
      title: 'Nicotin',
      value: '0 ng/ml',
      icon: <FireOutlined className="text-orange-500 text-2xl" />, // Nicotin
      desc: 'Đã loại bỏ khỏi máu',
    },
    {
      title: 'Huyết áp',
      value: '120/80 mmHg',
      icon: <HeartOutlined className="text-red-500 text-2xl" />, // Huyết áp
      desc: 'Ổn định',
    },
    {
      title: 'Chức năng phổi',
      value: '95% (tốt)',
      icon: <CloudOutlined className="text-blue-500 text-2xl" />, // Phổi
      desc: 'Thở dễ dàng',
    },
    {
      title: 'Cảm nhận vị & mùi',
      value: 'Bình thường',
      icon: <SmileOutlined className="text-yellow-500 text-2xl" />, // Vị & mùi
      desc: 'Cải thiện rõ rệt',
    },
    {
      title: 'Tuần hoàn máu',
      value: 'Ổn định',
      icon: <FundOutlined className="text-green-500 text-2xl" />, // Tuần hoàn
      desc: 'Nuôi dưỡng tốt',
    },
    {
      title: 'Da & nếp nhăn',
      value: 'Cải thiện',
      icon: <SkinOutlined className="text-pink-500 text-2xl" />, // Da
      desc: 'Sáng và mịn hơn',
    },
    {
      title: 'CO trong máu',
      value: 'Giảm mạnh',
      icon: <DashboardOutlined className="text-gray-500 text-2xl" />, // CO
      desc: 'Máu sạch hơn',
    },
    {
      title: 'Nhịp tim',
      value: '72 bpm',
      icon: <RadarChartOutlined className="text-purple-500 text-2xl" />, // Nhịp tim
      desc: 'Ổn định',
    },
    {
      title: 'Tiết kiệm',
      value: logs.reduce((sum, l) => sum + (Number(l.price) || 0), 0).toLocaleString('vi-VN') + ' VNĐ',
      icon: <DollarOutlined className="text-green-600 text-2xl" />, // Tiết kiệm
      desc: 'Tổng số tiền đã tiết kiệm',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-screen px-0 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full md:h-[700px]">
          <div className="md:col-span-4 h-full flex flex-col">
            <Card title="Ghi nhận hút thuốc" className="flex-1 h-full" bodyStyle={{ height: '100%' }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleAddLog}
                initialValues={{ date: dayjs() }}
              >
                <Form.Item
                  label="Số điếu hút"
                  name="cigarettes"
                  rules={[{ required: true, message: 'Vui lòng nhập số điếu!' }]}
                >
                  <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="Nhập số điếu" />
                </Form.Item>
                <Form.Item
                  label="Giá tiền (VNĐ)"
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập giá tiền" />
                </Form.Item>
                <Form.Item
                  label="Thời gian"
                  name="date"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Cảm xúc hôm nay"
                  name="emotion"
                  rules={[{ required: true, message: 'Vui lòng chọn cảm xúc!' }]}
                >
                  <Select style={{ width: '100%' }} placeholder="Chọn cảm xúc">
                    <Select.Option value="vui_ve">Vui vẻ</Select.Option>
                    <Select.Option value="binh_thuong">Bình thường</Select.Option>
                    <Select.Option value="met_moi">Mệt mỏi</Select.Option>
                    <Select.Option value="buon">Buồn</Select.Option>
                    <Select.Option value="cang_thang">Căng thẳng</Select.Option>
                    <Select.Option value="khac">Khác</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Sức khỏe hôm nay"
                  name="health"
                  rules={[{ required: true, message: 'Vui lòng chọn tình trạng sức khỏe!' }]}
                >
                  <Select style={{ width: '100%' }} placeholder="Chọn tình trạng sức khỏe">
                    <Select.Option value="tot">Tốt</Select.Option>
                    <Select.Option value="binh_thuong">Bình thường</Select.Option>
                    <Select.Option value="met_moi">Mệt mỏi</Select.Option>
                    <Select.Option value="om">Ốm</Select.Option>
                    <Select.Option value="khac">Khác</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Mức độ thèm thuốc"
                  name="craving"
                  rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
                >
                  <Select style={{ width: '100%' }} placeholder="Chọn mức độ thèm thuốc">
                    <Select.Option value="khong">Không</Select.Option>
                    <Select.Option value="nhe">Nhẹ</Select.Option>
                    <Select.Option value="trung_binh">Trung bình</Select.Option>
                    <Select.Option value="manh">Mạnh</Select.Option>
                    <Select.Option value="rat_manh">Rất mạnh</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Hoạt động hỗ trợ cai thuốc hôm nay" name="supportActivity">
                  <Input.TextArea rows={2} placeholder="Bạn đã làm gì để hỗ trợ bản thân hôm nay?" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Ghi chú" name="note">
                  <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Loại thuốc lá"
                  name="cigaretteType"
                  rules={[{ required: true, message: 'Vui lòng chọn loại thuốc!' }]}
                >
                  <Select style={{ width: '100%' }} placeholder="Chọn loại thuốc">
                    <Select.Option value="dieu">Thuốc lá điếu</Select.Option>
                    <Select.Option value="xi_ga">Xì gà</Select.Option>
                    <Select.Option value="thuoc_lao">Thuốc lào</Select.Option>
                    <Select.Option value="vape">Vape/thuốc lá điện tử</Select.Option>
                    <Select.Option value="khac">Khác</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Thời điểm hút đầu tiên trong ngày"
                  name="firstTime"
                  rules={[{ required: true, message: 'Vui lòng chọn thời điểm!' }]}
                >
                  <Select style={{ width: '100%' }} placeholder="Chọn thời điểm">
                    <Select.Option value="sang">Sáng</Select.Option>
                    <Select.Option value="trua">Trưa</Select.Option>
                    <Select.Option value="chieu">Chiều</Select.Option>
                    <Select.Option value="toi">Tối</Select.Option>
                    <Select.Option value="dem">Đêm</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Loại thuốc hỗ trợ cai (nếu có)"
                  name="supportMedicine"
                >
                  <Input style={{ width: '100%' }} placeholder="Nhập tên thuốc hỗ trợ (nếu có)" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Ghi nhận
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
          <div className="md:col-span-8 h-full flex flex-col">
            <Card title="Lịch sử ghi nhận" style={{ minHeight: 600, height: '100%', padding: 24 }} headStyle={{ fontSize: '1.25rem' }} bodyStyle={{ fontSize: '1.1rem', height: '100%' }} className="flex-1 h-full">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-blue-700">Chỉ số sức khỏe sau khi cai thuốc</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {healthIndicators.map((item, idx) => (
                    <Card key={idx} bordered className="text-center shadow-sm hover:shadow-md transition">
                      <div className="flex flex-col items-center justify-center">
                        {item.icon}
                        <div className="font-semibold mt-2 text-gray-700">{item.title}</div>
                        <div className="text-lg font-bold text-blue-700 mt-1">{item.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <Row gutter={[16, 16]}>
                {logs.length === 0 ? (
                  <Col span={24}><Typography.Text type="secondary">Chưa có ghi nhận nào.</Typography.Text></Col>
                ) : (
                  logs.map(item => (
                    <Col xs={24} md={12} key={item.key}>
                      <Card size="small" bordered hoverable style={{ minHeight: 180, fontSize: '1.1rem', padding: 16 }}>
                        <Typography.Text strong>{item.date}</Typography.Text>
                        <div>Số điếu: <b>{item.cigarettes}</b></div>
                        <div>Giá tiền: <b>{Number(item.price).toLocaleString('vi-VN')} VNĐ</b></div>
                        {item.emotion && <div>Cảm xúc: {item.emotion}</div>}
                        {item.health && <div>Sức khỏe: {item.health}</div>}
                        {item.craving && <div>Mức độ thèm thuốc: {item.craving}</div>}
                        {item.supportActivity && <div>Hoạt động hỗ trợ: {item.supportActivity}</div>}
                        {item.note && <div>Ghi chú: {item.note}</div>}
                        {item.cigaretteType && <div>Loại thuốc: {item.cigaretteType}</div>}
                        {item.firstTime && <div>Hút đầu tiên: {item.firstTime}</div>}
                        {item.smokeTimes && <div>Số lần hút: {item.smokeTimes}</div>}
                        {item.supportMedicine && <div>Thuốc hỗ trợ cai: {item.supportMedicine}</div>}
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogSmoking;