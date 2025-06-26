import React, { useState } from 'react';
import { Card, Button, Tabs, Tag, Row, Col } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

// Modal chi tiết gói (tích hợp lại logic PremiumDetailsModal)
import { Modal, Typography, List, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title, Text, Paragraph } = Typography;

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
    description: 'Phù hợp cho người mới bắt đầu cai thuốc, cần định hướng và được theo sát trong giai đoạn đầu. Những người có động lực tự thân mạnh, nhưng vẫn cần được khích lệ và điều chỉnh kế hoạch khi gặp cản trở.',
    color: 'blue',
    borderColor: 'border-blue-500',
    buttonClass: 'bg-blue-500 hover:bg-blue-600',
    ctaText: 'Xem chi tiết',
    disabled: false,
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
    description: 'Phù hợp cho người muốn duy trì động lực lâu dài, cần điều chỉnh kế hoạch theo từng giai đoạn và nhận hỗ trợ chuyên sâu hơn.',
    color: 'purple',
    borderColor: 'border-purple-500',
    buttonClass: 'bg-purple-500 hover:bg-purple-600',
    ctaText: 'Xem chi tiết',
    disabled: false,
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
    description: 'Phù hợp cho người muốn xây dựng thói quen không hút thuốc bền vững, cần theo dõi sát sao và hỗ trợ lâu dài từ chuyên gia.',
    color: 'red',
    borderColor: 'border-red-500',
    buttonClass: 'bg-red-500 hover:bg-red-600',
    ctaText: 'Xem chi tiết',
    disabled: false,
  },
];

const formatCurrency = (number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

const PremiumDetailsModal = ({ plan, open, onClose }) => {
  const navigate = useNavigate();
  if (!plan) return null;
  const handleBuy = () => {
    onClose();
    navigate(`/payment/${plan.id}`);  
  };
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={<Title level={4} className="!mb-0">Chi tiết gói: {plan.name}</Title>}
    >
      <div className="space-y-2">
        <Text strong>Giá:</Text> <Text type="danger" strong>{plan.priceDisplay}</Text>
        <br />
        <Text strong>Thời hạn:</Text> <Text>{plan.duration}</Text>
        <Divider />
        <Text strong>Quyền lợi:</Text>
        <List
          size="small"
          dataSource={plan.benefits || []}
          renderItem={item => <List.Item>- {item}</List.Item>}
        />
        <Divider />
        <Text strong>Mô tả:</Text>
        <Paragraph>{plan.description}</Paragraph>
        <div className="flex justify-end mt-4">
          <Button type="primary" size="large" onClick={handleBuy}>
            Mua ngay
            
          </Button>
          
        </div>
      </div>
    </Modal>
  );
};

const PremiumPlansSection = () => {
  const [billingCycle, setBillingCycle] = useState('1'); // '1', '3', '6'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tính giá giảm cho các gói trả phí
  const getPlanPrice = (plan, cycle) => {
    if (plan.id === 'free') return 0;
    const base = plan.price;
    let months = parseInt(cycle, 10);
    let total = base * months;
    if (months === 6) total *= 0.7;
    else if (months === 3) total *= 0.85;
    return Math.round(total);
  };

  // Hiển thị giá đã giảm và label giảm giá
  const getPriceDisplay = (plan, cycle) => {
    if (plan.id === 'free') return '0đ';
    const months = parseInt(cycle, 10);
    const total = getPlanPrice(plan, cycle);
    const perMonth = Math.round(total / months);
    let label = formatCurrency(perMonth) + ' / tháng';
    if (months === 3) label += ' (giảm 15%)';
    if (months === 6) label += ' (giảm 30%)';
    return label;
  };

  const tabItems = [
    {
      key: '1',
      label: `Thanh toán theo tháng`,
    },
    {
      key: '3',
      label: (
        <span>
          Trả trước 3 tháng <Tag color="orange">Tiết kiệm 15%</Tag>
        </span>
      ),
    },
    {
      key: '6',
      label: (
        <span>
          Trả trước 6 tháng <Tag color="success">Tiết kiệm 30%</Tag>
        </span>
      ),
    },
  ];

  const handleOpenDetails = (plan) => {
    setSelectedPlan({ ...plan, priceDisplay: getPriceDisplay(plan, billingCycle) });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <Tabs defaultActiveKey="1" items={tabItems} onChange={setBillingCycle} centered size="large" />
      </div>
      <Row gutter={[24, 24]} justify="center">
        {PLANS.map((plan) => (
          <Col xs={24} sm={12} md={12} lg={6} key={plan.id}>
            <Card
              className={`transform transition-transform hover:scale-105 shadow-lg rounded-xl border-t-8 ${plan.borderColor}`}
            >
              <div className="p-4 text-center">
                <h3 className={`text-2xl font-bold mb-4 text-${plan.color}-600`}>{plan.name}</h3>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {plan.id === 'free'
                      ? '0đ'
                      : getPriceDisplay(plan, billingCycle)
                    }
                  </span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  {plan.benefits.slice(0, 2).map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircleFilled className={`text-${plan.color}-500 mr-3 mt-1`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  type="primary"
                  size="large"
                  block
                  className={`font-bold text-white ${plan.buttonClass}`}
                  disabled={plan.disabled}
                  onClick={() => !plan.disabled && handleOpenDetails(plan)}
                >
                  {plan.ctaText}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <PremiumDetailsModal plan={selectedPlan} open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default PremiumPlansSection; 