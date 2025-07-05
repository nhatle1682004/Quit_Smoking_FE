import React, { useEffect, useState } from 'react'
import api from '../../configs/axios';
import { toast } from 'react-toastify';
import { Button, Card, DatePicker, Divider, Form, Input, InputNumber, Radio, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/skeleton/Title';
import dayjs from 'dayjs';

function ProfileInitialCondition() {
  const [initialCondition, setInitialCondition] = useState({});
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  const fetchInitialCondition = async () => {
    try {
      const response = await api.get("/initial-condition/active");
      const data = {
        ...response.data,
        desiredQuitDate: response.data.desiredQuitDate ? dayjs(response.data.desiredQuitDate) : null,
        intentionSince: response.data.intentionSince ? dayjs(response.data.intentionSince) : null,
      };
      setInitialCondition(data);
      form.setFieldsValue(data);
      toast.success("Lấy dữ liệu thành công");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi lấy dữ liệu");
    }
  }

  useEffect(() => {
    fetchInitialCondition();
  }, [])

  const handleSubmit = async (values) => {
    try {
      const response = await api.put("/initial-condition", values);
      const data = {
        ...response.data,
        desiredQuitDate: response.data.desiredQuitDate ? dayjs(response.data.desiredQuitDate) : null,
        intentionSince: response.data.intentionSince ? dayjs(response.data.intentionSince) : null,
      };
      setInitialCondition(data);
      form.setFieldsValue(data);
      toast.success("Cập nhật dữ liệu thành công");
      setEditing(false);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi cập nhật dữ liệu");
    }
  }

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
              label="Số lượng thuốc lá hút mỗi ngày *"
              rules={[{ required: true, message: 'Vui lòng nhập số điếu mỗi ngày' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="Ví dụ: 10" disabled={!editing} />
            </Form.Item>
            <Form.Item
              name="startSmokingAge"
              label="Tuổi bắt đầu hút thuốc *"
              rules={[{ required: true, message: 'Vui lòng nhập tuổi bắt đầu hút thuốc' }]}
            >
              <InputNumber style={{ width: '100%' }} min={10} max={80} placeholder="Ví dụ: 18" disabled={!editing} />
            </Form.Item>
            <Form.Item
              name="firstSmokeTime"
              label="Thời điểm hút điếu đầu tiên *"
              rules={[{ required: true, message: 'Vui lòng chọn thời điểm' }]}
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
              name="reasonForStarting"
              label="Lý do bắt đầu hút thuốc *"
              rules={[
                { required: true, message: 'Vui lòng nhập lý do' },
                { min: 5, message: 'Tối thiểu 5 ký tự' },
              ]}
            >
              <TextArea rows={2} placeholder="Ví dụ: Do áp lực công việc, bạn bè rủ rê, tò mò..." disabled={!editing} />
            </Form.Item>
            <Form.Item
              name="quitReason"
              label="Lý do muốn bỏ thuốc *"
              rules={[
                { required: true, message: 'Vui lòng nhập lý do' },
                { min: 5, message: 'Tối thiểu 5 ký tự' },
              ]}
            >
              <TextArea rows={2} placeholder="Ví dụ: Bảo vệ sức khỏe, tiết kiệm tiền, gia đình..." disabled={!editing} />
            </Form.Item>
            <Form.Item
              name="intentionSince"
              label="Bạn có ý định bỏ thuốc từ khi nào? *"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="Chọn ngày" disabled={!editing} />
            </Form.Item>
            <Form.Item
              name="readinessScale"
              label="Mức độ sẵn sàng bỏ thuốc (1-10) *"
              rules={[{ required: true, message: 'Vui lòng nhập mức độ từ 1 đến 10' }]}
            >
              <InputNumber className="w-full" min={1} max={10} placeholder="Ví dụ: 7" disabled={!editing} />
            </Form.Item>
            <Form.Item
              name="emotion"
              label="Cảm xúc khi hút thuốc *"
              rules={[{ required: true, message: 'Vui lòng nhập cảm xúc' }]}
            >
              <Input className='w-full' placeholder="Ví dụ: Thư giãn, căng thẳng, lo lắng, tự tin..." disabled={!editing} />
            </Form.Item>
            <Divider />
            <Form.Item
              name="pricePerCigarette"
              label="Giá mỗi điếu thuốc (VNĐ) *"
              rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={100}
                max={200000}
                placeholder="Ví dụ: 2000"
                formatter={(v) => v && Number(v).toLocaleString('vi-VN')}
                parser={(v) => v.replace(/\D/g, '')}
                disabled={!editing}
              />
            </Form.Item>
            <Form.Item
              name="cigarettesPerPack"
              label="Số điếu trong một bao *"
              rules={[{ required: true, message: 'Vui lòng nhập số điếu' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} max={100} placeholder="Thường là 20" disabled={!editing} />
            </Form.Item>
            <Form.Item
              name="weightKg"
              label="Cân nặng hiện tại (kg) *"
              rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
            >
              <InputNumber style={{ width: '100%' }} step={0.1} min={1} max={300} placeholder="Ví dụ: 65.5" disabled={!editing} />
            </Form.Item>
            <Form.Item
              name="addictionLevel"
              label="Mức độ nghiện *"
              rules={[{ required: true, message: 'Vui lòng chọn mức độ nghiện' }]}
            >
              <Input disabled />
            </Form.Item>
            <Divider />
            <Form.Item
              name="hasTriedToQuit"
              label="Bạn đã từng cố bỏ thuốc? *"
              rules={[{ required: true, message: 'Vui lòng chọn' }]}
            >
              <Radio.Group disabled={!editing}>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="hasHealthIssues"
              label="Bạn có vấn đề sức khỏe liên quan? *"
              rules={[{ required: true, message: 'Vui lòng chọn' }]}
            >
              <Radio.Group disabled={!editing}>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="desiredQuitDate"
              label="Ngày mong muốn bắt đầu cai thuốc *"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày' },
                {
                  validator: (_, value) =>
                    value && value.isBefore(dayjs(), 'day')
                      ? Promise.reject('Không chọn ngày trong quá khứ')
                      : Promise.resolve(),
                },
              ]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="Chọn ngày bắt đầu" disabled={!editing} />
            </Form.Item>
            <div>
              {editing ? (
                <>
                  <Button type="primary" onClick={() => form.submit()} htmlType="submit">Lưu</Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      form.setFieldsValue(initialCondition);
                      setEditing(false);
                    }}
                  >
                    Hủy
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={() => setEditing(true)}>
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