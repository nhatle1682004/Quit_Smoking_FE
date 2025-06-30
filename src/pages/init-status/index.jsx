import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import { Form, Input, Select, Radio, DatePicker, Button, InputNumber, Typography } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text } = Typography;

const INITIAL_FORM_STATE = {
  cigarettesPerDay: null,
  firstSmokeTime: '',
  reasonForStarting: '',
  quitReason: '',
  intentionSince: null,
  readinessScale: null,
  emotion: '',
  startSmokingAge: null,
  pricePerCigarette: null,
  cigarettesPerPack: null,
  hasTriedToQuit: null,
  hasHealthIssues: null,
  weightKg: null,
  desiredQuitDate: null,
};

function InitialStatus() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addictionInfo, setAddictionInfo] = useState(null); // NEW: để hiển thị addictionLevel nếu cần

  const normalizeSmokingData = (data) => {
    return {
      ...data,
      cigarettesPerDay: Math.min(data.cigarettesPerDay ?? 0, 100),
      readinessScale: Math.min(data.readinessScale ?? 0, 10),
      startSmokingAge: Math.min(data.startSmokingAge ?? 0, 100),
      pricePerCigarette: Math.min(data.pricePerCigarette ?? 0, 200000),
      cigarettesPerPack: Math.min(data.cigarettesPerPack ?? 0, 100),
      desiredQuitDate: data.desiredQuitDate ? dayjs(data.desiredQuitDate) : null,
      intentionSince: data.intentionSince ? dayjs(data.intentionSince) : null,
    };
  };

  useEffect(() => {
    const checkInitStatus = async () => {
      try {
        const res = await api.get('/initial-condition/active');
        if (res.data) {
          const data = normalizeSmokingData(res.data);
          form.setFieldsValue(data);
          setAddictionInfo({
            addictionLevel: res.data.addictionLevel,
            createdAt: res.data.createdAt,
          });
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error checking init status:', error);
        }
      }
    };
    checkInitStatus();
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        desiredQuitDate: values.desiredQuitDate?.format('YYYY-MM-DD') || '',
        intentionSince: values.intentionSince?.format('YYYY-MM-DD') || '',
      };
      await api.post('initial-condition', submitData);
      toast.success('Khai báo thành công!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Khai báo thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-xl">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-blue-200">
          <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6 tracking-tight">
            Khai báo tình trạng hút thuốc ban đầu
          </h1>

          {addictionInfo && (
            <div className="mb-6 text-center">
              <Text type="secondary">
                <strong>Cấp độ nghiện:</strong> {addictionInfo.addictionLevel} <br />
                <strong>Ngày khai báo:</strong>{' '}
                {dayjs(addictionInfo.createdAt).format('DD/MM/YYYY')}
              </Text>
            </div>
          )}

          <Form
            form={form}
            layout="vertical"
            initialValues={INITIAL_FORM_STATE}
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <Form.Item
              label="Tuổi bắt đầu hút thuốc *"
              name="startSmokingAge"
              rules={[
                { required: true },
                { type: 'number', min: 10, max: 200 },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Lý do bắt đầu hút thuốc *"
              name="reasonForStarting"
              rules={[{ required: true }, { min: 5 }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điếu mỗi ngày *"
              name="cigarettesPerDay"
              rules={[{ required: true }, { type: 'number', min: 0, max: 100 }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Mốc thời gian hút điếu đầu tiên *"
              name="firstSmokeTime"
              rules={[{ required: true }]}
            >
              <Select placeholder="-- Chọn thời gian --">
                <Option value="morning">Sáng sớm</Option>
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
              label="Giá mỗi điếu thuốc (VNĐ) *"
              name="pricePerCigarette"
              rules={[{ required: true }, { type: 'number', min: 500, max: 200000 }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(v) => v && Number(v).toLocaleString('vi-VN')}
                parser={(v) => v.replace(/\D/g, '')}
              />
            </Form.Item>

            <Form.Item
              label="Số điếu trong 1 bao *"
              name="cigarettesPerPack"
              rules={[{ required: true }, { type: 'number', min: 1, max: 100 }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Đã từng cố bỏ thuốc? *"
              name="hasTriedToQuit"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Có vấn đề sức khỏe liên quan? *"
              name="hasHealthIssues"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Lý do muốn bỏ thuốc *"
              name="quitReason"
              rules={[{ required: true }, { min: 5 }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            {/* ✅ Sửa: chuyển intentionSince sang DatePicker vì backend trả dạng ngày */}
            <Form.Item
              label="Bạn đã có ý định bỏ thuốc từ khi nào?"
              name="intentionSince"
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Mức độ sẵn sàng bỏ thuốc (1-10)"
              name="readinessScale"
              rules={[{ type: 'number', min: 1, max: 10 }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Cảm xúc hiện tại" name="emotion">
              <Input />
            </Form.Item>

            <Form.Item
              label="Cân nặng (kg) *"
              name="weightKg"
              rules={[{ required: true }, { type: 'number', min: 1, max: 300 }]}
            >
              <InputNumber style={{ width: '100%' }} step={0.1} />
            </Form.Item>

            <Form.Item
              label="Ngày mong muốn bắt đầu cai thuốc *"
              name="desiredQuitDate"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    const today = dayjs().startOf('day');
                    if (!value) return Promise.reject('Bắt buộc');
                    if (value.isBefore(today))
                      return Promise.reject('Không được chọn ngày trong quá khứ');
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-md bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Gửi khai báo
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default InitialStatus;
