import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import api from '../../../configs/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { oldPassword, password, repeatPassword } = values;

    if (password !== repeatPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (oldPassword === password) {
      toast.error('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    setLoading(true);
    try {
      await api.put('/user/me/password', {
        oldPassword,
        password,
        repeatPassword,
      });
      toast.success('Mật khẩu đã được thay đổi thành công');
      form.resetFields();
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi thay đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>Đổi mật khẩu</h1>

        <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-6">
          <Form.Item
            label={<span className="font-medium text-gray-700">Mật khẩu hiện tại</span>}
            name="oldPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            hasFeedback
          >
            <Input.Password
              placeholder="Nhập mật khẩu hiện tại của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Mật khẩu mới</span>}
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Xác nhận mật khẩu mới</span>}
            name="repeatPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu mới của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
