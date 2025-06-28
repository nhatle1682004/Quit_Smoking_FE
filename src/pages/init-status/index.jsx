import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import { Form, Input, Select, Radio, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const INITIAL_FORM_STATE = {
  cigarettesPerDay: '',
  firstSmokeTime: '',
  reasonForStarting: '',
  quitReason: '',
  intentionSince: '',
  readinessScale: '',
  emotion: '',
  startSmokingAge: '',
  pricePerCigarette: '',
  cigarettesPerPack: '',
  hasTriedToQuit: null,
  hasHealthIssues: null,
  weightKg: '',
  desiredQuitDate: '',
};

function InitialStatus() {
  const [form] = Form.useForm();
  const [displayPrice, setDisplayPrice] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkInitStatus = async () => {
      try {
        const response = await api.get('/initial-condition/active');
        if (response.data) {
          navigate('/'); // Nếu có dữ liệu, chuyển hướng về trang chủ
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          // Chỉ log lỗi nếu không phải là 404
          console.error('Error checking init status:', error);
        }
        // Nếu là 404, không làm gì cả, để form hiển thị
      }
    };
    checkInitStatus();
  }, [navigate]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Loại bỏ mọi ký tự không phải số
    const numeric = value.replace(/\D/g, '');
    // Format lại với dấu chấm ngăn cách hàng nghìn
    setDisplayPrice(numeric ? Number(numeric).toLocaleString('vi-VN') : '');
    form.setFieldValue('pricePerCigarette', numeric);
  };

  const handlePriceBlur = () => {
    const price = form.getFieldValue('pricePerCigarette');
    if (!price) {
      setDisplayPrice('');
      return;
    }
    const numPrice = Number(price);
    if (!isNaN(numPrice) && numPrice > 0) {
      setDisplayPrice(numPrice.toLocaleString('vi-VN'));
    }
  };

  const handlePriceFocus = () => {
    // Khi focus, bỏ format để dễ sửa
    const price = form.getFieldValue('pricePerCigarette');
    setDisplayPrice(price || '');
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        desiredQuitDate: values.desiredQuitDate ? values.desiredQuitDate.format('YYYY-MM-DD') : '',
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
          <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8 tracking-tight">
            Khai báo tình trạng hút thuốc ban đầu
          </h1>

          <Form
            form={form}
            layout="vertical"
            initialValues={INITIAL_FORM_STATE}
            onFinish={handleSubmit}
            className="space-y-6"
          >
            {/* Các trường nhập liệu luôn hiển thị */}
            <Form.Item
              label={<span className="font-semibold">Tuổi bắt đầu hút thuốc <span className="text-red-500">*</span></span>}
              name="startSmokingAge"
              rules={[
                { required: true, message: 'Bắt buộc' },
                { validator: (_, value) => {
                  const num = Number(value);
                  if (isNaN(num)) return Promise.reject('Tuổi phải là số');
                  if (num < 0) return Promise.reject('Tuổi không được nhỏ hơn 0');
                  if (num > 300) return Promise.reject('Tuổi bắt đầu hút thuốc không hợp lệ');
                  return Promise.resolve();
                }}
              ]}
            >
              <Input type="number" placeholder="Ví dụ: 18" min={0} />
            </Form.Item>
            <Form.Item
              label={<span className="font-semibold">Lý do bắt đầu hút thuốc <span className="text-red-500">*</span></span>}
              name="reasonForStarting"
              rules={[
                { required: true, message: 'Bắt buộc' },
                { min: 5, message: 'Phải nhập ít nhất 5 ký tự' }
              ]}
            >
              <Input placeholder="Ví dụ: tò mò, bạn bè, áp lực..." />
            </Form.Item>
            <Form.Item
              label={<span className="font-semibold">Số điếu mỗi ngày <span className="text-red-500">*</span></span>}
              name="cigarettesPerDay"
              rules={[
                { required: true, message: 'Bắt buộc' },
                { validator: (_, value) => {
                  const num = Number(value);
                  if (isNaN(num)) return Promise.reject('Số điếu phải là số');
                  if (num < 0) return Promise.reject('Số điếu không được nhỏ hơn 0');
                  if (num > 100) return Promise.reject('Số điếu không được vượt quá 100 điếu/ngày');
                  return Promise.resolve();
                }}
              ]}
            >
              <Input type="number" placeholder="Ví dụ: 10" min={0} />
            </Form.Item>
            <Form.Item
              label={<span className="font-semibold">Mốc thời gian hút điếu đầu tiên trong ngày <span className="text-red-500">*</span></span>}
              name="firstSmokeTime"
              rules={[{ required: true, message: 'Bắt buộc chọn' }]}
            >
              <Select placeholder="-- Chọn thời gian --">
                <Option value="morning">Sáng sớm (5h-8h)</Option>
                <Option value="breakfast">Sau bữa sáng</Option>
                <Option value="mid_morning">Giữa buổi sáng (9h-11h)</Option>
                <Option value="lunch">Sau bữa trưa</Option>
                <Option value="afternoon">Buổi chiều (13h-17h)</Option>
                <Option value="dinner">Sau bữa tối</Option>
                <Option value="evening">Buổi tối (19h-22h)</Option>
                <Option value="late_night">Đêm khuya (22h-5h)</Option>
                <Option value="stress">Khi căng thẳng/áp lực</Option>
                <Option value="social">Khi gặp gỡ bạn bè</Option>
                <Option value="coffee">Khi uống cà phê</Option>
                <Option value="other">Thời gian khác</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={<span className="font-semibold">Giá mỗi điếu thuốc (VNĐ) <span className="text-red-500">*</span></span>}
              name="pricePerCigarette"
              rules={[
                { required: true, message: 'Vui lòng nhập giá mỗi điếu' },
                { validator: (_, value) => {
                  const num = Number(value);
                  if (isNaN(num)) return Promise.reject('Giá phải là số');
                  if (num < 0) return Promise.reject('Giá không được nhỏ hơn 0');
                  if (num < 500) return Promise.reject('Giá mỗi điếu thường từ 500 VNĐ trở lên');
                  if (num > 200000) return Promise.reject('Giá mỗi điếu không hợp lệ');
                  return Promise.resolve();
                }}
              ]}
            >
              <Input
                placeholder="Ví dụ: 10.000"
                value={displayPrice}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                onFocus={handlePriceFocus}
                min={0}
              />
            </Form.Item>
            <Form.Item
              label={<span className="font-semibold">Số điếu trong 1 hộp <span className="text-red-500">*</span></span>}
              name="cigarettesPerPack"
              rules={[
                { required: true, message: 'Bắt buộc' },
                { validator: (_, value) => {
                  const num = Number(value);
                  if (isNaN(num)) return Promise.reject('Số điếu phải là số');
                  if (num < 0) return Promise.reject('Số điếu không được nhỏ hơn 0');
                  if (num < 1) return Promise.reject('Số điếu mỗi bao phải từ 1 trở lên');
                  if (num > 100) return Promise.reject('Số điếu mỗi bao không hợp lệ');
                  return Promise.resolve();
                }}
              ]}
            >
              <Input type="number" placeholder="Ví dụ: 20" min={0} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Đã từng cố bỏ thuốc? <span className="text-red-500">*</span></span>}
              name="hasTriedToQuit"
              rules={[{ required: true, message: 'Bắt buộc chọn' }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Có vấn đề sức khỏe liên quan? <span className="text-red-500">*</span></span>}
              name="hasHealthIssues"
              rules={[{ required: true, message: 'Bắt buộc chọn' }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Lý do muốn bỏ thuốc <span className="text-red-500">*</span></span>}
              name="quitReason"
              rules={[
                { required: true, message: 'Bắt buộc' },
                { min: 5, message: 'Phải nhập ít nhất 5 ký tự' }
              ]}
            >
              <Input.TextArea rows={3} placeholder="Vì sức khỏe, gia đình, tài chính..." />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Bạn đã có ý định bỏ thuốc từ khi nào?</span>}
              name="intentionSince"
              rules={[]}
            >
              <Input placeholder="Ví dụ: 1 tháng trước, 1 năm trước..." />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Mức độ sẵn sàng bỏ thuốc (1-10)</span>}
              name="readinessScale"
              rules={[]}
            >
              <Input type="number" min={1} max={10} placeholder="Ví dụ: 7" />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Cảm xúc hiện tại khi nghĩ đến việc bỏ thuốc</span>}
              name="emotion"
              rules={[]}
            >
              <Input placeholder="Ví dụ: lo lắng, tự tin, sợ hãi..." />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Cân nặng (kg) <span className="text-red-500">*</span></span>}
              name="weightKg"
              rules={[
                { required: true, message: 'Bắt buộc nhập cân nặng' },
                { validator: (_, value) => {
                  const num = Number(value);
                  if (isNaN(num)) return Promise.reject('Cân nặng phải là số');
                  if (num < 0.1) return Promise.reject('Cân nặng phải lớn hơn 0kg');
                  if (num >= 300) return Promise.reject('Cân nặng phải nhỏ hơn 300kg');
                  return Promise.resolve();
                }}
              ]}
            >
              <Input type="number" placeholder="Ví dụ: 65" min={0.1} />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Ngày mong muốn bắt đầu cai thuốc <span className="text-red-500">*</span></span>}
              name="desiredQuitDate"
              rules={[
                { required: true, message: 'Bắt buộc' },
                { validator: (_, value) => {
                  if (!value) return Promise.reject('Bắt buộc');
                  const today = dayjs().startOf('day');
                  if (value && value.isBefore(today)) return Promise.reject('Ngày không được ở trong quá khứ');
                  return Promise.resolve();
                }}
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

