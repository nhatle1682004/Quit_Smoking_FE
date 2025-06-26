import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, List, Divider, Alert, Button } from 'antd';

const { Title, Text } = Typography;

// Mảng PLANS giống như ở PremiumPlansSection
const PLANS = [
  {
    id: 'premium-1m',
    name: 'Premium 1 tháng',
    price: 99000,
    duration: '30 ngày',
    benefits: [
      'Kế hoạch cai thuốc được cá nhân hóa theo độ nghiện và mục tiêu cá nhân.',
      'Nhiệm vụ mỗi ngày, bài tập ứng phó cơn thèm thuốc, hướng dẫn thiền và kiểm soát cảm xúc.',
      'Ghi nhật ký + nhận phản hồi từ chuyên gia huấn luyện.',
      'Thống kê chi tiết quá trình phục hồi: số ngày bỏ thuốc, số điếu tránh được, số tiền tiết kiệm, v.v.',
      'Ưu tiên hỗ trợ kỹ thuật và giải đáp.',
      '💬 4 buổi tư vấn 1:1 trong tháng (30–45 phút/buổi, đặt lịch linh hoạt, online Google Meet).'
    ],
  },
  {
    id: 'premium-3m',
    name: 'Premium 3 tháng',
    price: 199000,
    duration: '90 ngày',
    benefits: [
      'Mọi tính năng như gói 1 tháng nhưng duy trì lâu dài hơn để ngăn tái nghiện.',
      'Điều chỉnh kế hoạch theo tiến độ và thay đổi cảm xúc theo từng tháng.',
      '💬 8 buổi tư vấn 1:1 trong vòng 3 tháng (2–3 tuần/lần, ưu tiên phản hồi trong 24h khi gửi nhật ký hoặc câu hỏi).'
    ],
  },
  {
    id: 'premium-6m',
    name: 'Premium 6 tháng',
    price: 299000,
    duration: '180 ngày',
    benefits: [
      'Kế hoạch được chia thành 3 giai đoạn: khởi động – thích nghi – duy trì.',
      'Theo dõi hồi phục sức khỏe nâng cao và động lực dài hạn.',
      'Ghi nhận biến động tâm lý, giấc ngủ, cân nặng.',
      'Có thể thay đổi lộ trình theo phản hồi từ chuyên gia.',
      '💬 16 buổi tư vấn 1:1 trong vòng 6 tháng (2–3 buổi/tháng, dày đặc ở tháng đầu và giãn dần về sau).'
    ],
  },
];

function randomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const Payment = () => {
  const { planId } = useParams();
  const plan = PLANS.find(p => p.id === planId);
  const paymentCode = React.useMemo(() => randomCode(6), [planId]);
  const navigate = useNavigate();

  if (!plan) {
    return <Alert message="Không tìm thấy gói dịch vụ!" type="error" showIcon />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-lg w-full shadow-xl rounded-xl border-t-8 border-blue-500">
        <Title level={3} className="text-center mb-4">Thanh toán gói: {plan.name}</Title>
        <Divider />
        <div className="mb-4">
          <Text strong>Giá:</Text> <Text type="danger" strong>{plan.price.toLocaleString('vi-VN')} đ</Text>
        </div>
        <div className="mb-4">
          <Text strong>Thời hạn:</Text> <Text>{plan.duration}</Text>
        </div>
        <div className="mb-4">
          <Text strong>Quyền lợi:</Text>
          <List
            size="small"
            dataSource={plan.benefits}
            renderItem={item => <List.Item>- {item}</List.Item>}
          />
        </div>
        <Divider />
        <div className="mb-6 text-center">
          <Text strong>Mã thanh toán của bạn:</Text>
          <div className="text-2xl font-mono bg-gray-100 rounded-lg p-3 mt-2 mb-2 select-all border border-blue-300 inline-block">
            {paymentCode}
          </div>
          <div className="text-gray-500 text-sm">Vui lòng sử dụng mã này khi chuyển khoản hoặc xác nhận thanh toán.</div>
        </div>
        {/* Nút Hủy */}
        <Button
          type="default"
          block
          onClick={() => navigate(-1)}          // quay lại trang trước
        >
          Huỷ
        </Button>
        
      </Card>
    </div>
  );
};

export default Payment; 