import { Button, Form } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';

function ForgotPassword() {

    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
      console.log("Email cần đặt lại mật khẩu:", values.email);
      // Gọi API gửi email khôi phục mật khẩu ở đây
    };
    return (
        <div>
            <div className="header">
                <div className="lock-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,1A3,3 0 0,1 15,4V7H19A2,2 0 0,1 21,9V21A2,2 0 0,1 19,23H5A2,2 0 0,1 3,21V9A2,2 0 0,1 5,7H9V4A3,3 0 0,1 12,1M12,3A1,1 0 0,0 11,4V7H13V4A1,1 0 0,0 12,3M12,11A2,2 0 0,1 14,13A2,2 0 0,1 12,15A2,2 0 0,1 10,13A2,2 0 0,1 12,11Z" />
                    </svg>
                </div>
                <h1>Quên Mật Khẩu?</h1>
                <p class="subtitle">Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>
            </div>
            <div>
                <Form>
                <Form.Item>
                    name="email"
                    <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item label={null}>
                    <Button type='primary' htmlType='submit' >
                        Gửi liên kết đặt lại
                    </Button>
                </Form.Item>

                <Link to="/login">Quay lại đăng nhập</Link>
                </Form>
            </div>
        </div>
    )
}

export default ForgotPassword;