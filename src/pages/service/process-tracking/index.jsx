import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../configs/axios';
import { Button, Form, Progress, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'; // Import dayjs để tính toán ngày tháng
import { HomeOutlined } from '@ant-design/icons';


function ProcessTracking() {
  const [planData, setPlanData] = useState(null); // Khởi tạo với null cho rõ ràng, thay vì []
  const [progress, setProgress] = useState(0); // Trạng thái cho phần trăm tiến trình
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchFreePlan = async () => {
    try {
      const response = await api.get('/free-plan/active');
      setPlanData(response.data);
      calculateProgress(response.data); // Tính toán tiến trình sau khi lấy dữ liệu
      toast.success('Dữ liệu kế hoạch được tải thành công!');
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu kế hoạch!');
      console.error('Lỗi khi lấy kế hoạch miễn phí:', error);
      setPlanData(null); // Đảm bảo planData là null khi có lỗi
    }
  };

  useEffect(() => {
    fetchFreePlan();
  }, []);

  // Hàm tính toán tiến trình
  const calculateProgress = (plan) => {
    if (!plan || !plan.startDate || !plan.endDate) {
      setProgress(0);
      return;
    }

    const startDate = dayjs(plan.startDate);
    const endDate = dayjs(plan.endDate);
    const now = dayjs();

    // Nếu ngày hiện tại trước ngày bắt đầu, tiến trình là 0
    if (now.isBefore(startDate)) {
      setProgress(0);
      return;
    }

    // Nếu ngày hiện tại sau ngày kết thúc, tiến trình là 100
    if (now.isAfter(endDate)) {
      setProgress(100);
      return;
    }

    const totalDuration = endDate.diff(startDate, 'day'); // Tổng số ngày của kế hoạch
    const elapsedDuration = now.diff(startDate, 'day'); // Số ngày đã trôi qua

    if (totalDuration > 0) {
      const calculatedProgress = (elapsedDuration / totalDuration) * 100;
      // Đảm bảo tiến trình nằm trong khoảng 0 đến 100
      setProgress(Math.min(100, Math.max(0, parseFloat(calculatedProgress.toFixed(2)))));
    } else {
      setProgress(0); // Xử lý trường hợp ngày bắt đầu và kết thúc giống nhau
    }
  };

  const handleCancel = async () => {
    try {
      await api.put('/free-plan/cancel');
      toast.success('Kế hoạch đã được hủy thành công!');
      // Sau khi hủy thành công, bạn có thể xóa planData và cập nhật tiến trình
      setPlanData(null);
      setProgress(0);
      navigate('/service/quit-plan-free');
    } catch (err) {
      toast.error('Lỗi khi hủy kế hoạch!');
      console.error('Lỗi khi hủy kế hoạch:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8 drop-shadow-md">
        🚭 Hành Trình Cai Thuốc - Khởi Đầu Cuộc Sống Mới
      </h1>


      {planData ? (
        <Card className="w-full max-w-2xl p-6 shadow-xl rounded-lg bg-white transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Thông Tin Kế Hoạch Hiện Tại</h2>
          <div className="space-y-3 text-gray-600 mb-6">
            <p>
              <strong>Ngày Bắt Đầu:</strong> {dayjs(planData.startDate).format('DD/MM/YYYY')}
            </p>
            <p>
              <strong>Ngày Kết Thúc:</strong> {dayjs(planData.endDate).format('DD/MM/YYYY')}
            </p>
            <p>
              <strong>Mục Tiêu:</strong> {planData.goal}
            </p>
            <p>
              <strong>Lý Do Thúc Đẩy:</strong> {planData.motivationReason}
            </p>
            <p>
              <strong>Ghi Chú:</strong> {planData.note || 'Không có ghi chú.'}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Tiến Trình Hoàn Thành</h3>
            <Progress percent={progress} status={progress === 100 ? 'success' : 'active'} strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }} />
            <p className="text-sm text-gray-500 mt-2">
              {progress === 100
                ? 'Chúc mừng! Bạn đã hoàn thành kế hoạch!'
                : `Còn lại ${dayjs(planData.endDate).diff(dayjs(), 'day')} ngày để đạt được mục tiêu.`}
            </p>
          </div>

          <Form layout="vertical" form={form} onFinish={handleCancel}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                danger
                className="w-full h-10 text-lg rounded-md hover:bg-red-600 transition-colors"
              >
                Hủy Kế Hoạch Cai Thuốc
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <div className="text-center text-gray-600 text-lg mt-10 p-4 bg-white rounded-lg shadow-md">
          <p>Hiện tại không có kế hoạch cai thuốc nào đang hoạt động.</p>
          <Button
            type="primary"
            className="mt-4 bg-blue-500 hover:bg-blue-600 rounded-md"
            onClick={() => navigate('/service/quit-plan-free')} // Ví dụ: điều hướng đến trang tạo kế hoạch
            
          >
            Tạo Kế Hoạch Mới
            
          </Button>
          <Button
            icon={<HomeOutlined />}
            className="mb-4"
            onClick={() => navigate('/')} // Navigate to home page
          >

            Quay Lại Trang Chủ
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProcessTracking;