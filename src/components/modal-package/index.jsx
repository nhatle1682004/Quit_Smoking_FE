import React, { useState } from 'react';
import { Card, Button, Tabs, Tag, Row, Col } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Modal chi tiết gói (tích hợp lại logic PremiumDetailsModal)
import { Modal, Typography, List, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
const { Title, Text, Paragraph } = Typography;

const PLANS = [
  {
    id: 'free',
    name: 'Gói Miễn Phí',
    price: 0,
    duration: 'Không giới hạn',
    shortDescription: 'Trải nghiệm các tính năng cơ bản',
    keyFeatures: [
      'Bạn sẽ nhận được file hướng dẫn chi tiết',
      'Tự theo dõi kế hoạch bỏ thuốc tại nhà',
      'Hệ thống sẽ nhắc nhở bạn mỗi ngày để tiếp thêm động lực',
    ],
    benefits: [
      'Truy cập các tính năng nền tảng để bắt đầu hành trình bỏ thuốc.',
      'Kế hoạch đơn giản, không cá nhân hoá nâng cao.',
      'Có thể nâng cấp Premium bất cứ lúc nào để nhận hỗ trợ chuyên sâu.',
    ],
    description:
      'Phù hợp cho người muốn thử trải nghiệm trước khi quyết định nâng cấp lên Premium.',
    color: 'gray',
    borderColor: 'border-gray-400',
    buttonClass: 'bg-gray-500 hover:bg-gray-600',
    ctaText: 'Bắt đầu',
    disabled: false,
    popular: false,
  },
  {
    id: 'premium-1m',
    name: 'Premium 1 tháng',
    price: 99000,
    duration: '30 ngày',
    shortDescription: 'Phù hợp cho người mới bắt đầu',
    keyFeatures: [
      'Kế hoạch cai thuốc cá nhân hóa',
      'Nhiệm vụ và bài tập hàng ngày',
      'Ghi nhật ký + phản hồi chuyên gia',
      'Thống kê chi tiết quá trình phục hồi',
      '4 buổi tư vấn 1:1 trong tháng',
    ],
    benefits: [
      'Kế hoạch cai thuốc được cá nhân hóa theo độ nghiện và mục tiêu cá nhân.',
      'Nhiệm vụ mỗi ngày, bài tập ứng phó cơn thèm thuốc, hướng dẫn kiểm soát cảm xúc.',
      'Ghi nhật ký + nhận phản hồi từ chuyên gia huấn luyện.',
      'Thống kê chi tiết quá trình phục hồi: số ngày bỏ thuốc, số điếu tránh được, số tiền tiết kiệm, v.v.',
      'Ưu tiên hỗ trợ kỹ thuật và giải đáp.',
      '💬 4 buổi tư vấn 1:1 trong tháng (30–45 phút/buổi, đặt lịch linh hoạt, online Google Meet).',
    ],
    description:
      'Phù hợp cho người mới bắt đầu cai thuốc, cần định hướng và được theo sát trong giai đoạn đầu. Những người có động lực tự thân mạnh, nhưng vẫn cần được khích lệ và điều chỉnh kế hoạch khi gặp cản trở.',
    color: 'blue',
    borderColor: 'border-blue-500',
    buttonClass: 'bg-blue-500 hover:bg-blue-600',
    ctaText: 'Xem chi tiết',
    disabled: false,
    popular: false,
  },
  {
    id: 'premium-3m',
    name: 'Premium 3 tháng',
    price: 199000,
    duration: '90 ngày',
    shortDescription: 'Duy trì động lực lâu dài',
    keyFeatures: [
      'Mọi tính năng gói 1 tháng',
      'Điều chỉnh kế hoạch theo tiến độ',
      'Ưu tiên phản hồi trong 24h',
      'Theo dõi biến động cảm xúc',
      '8 buổi tư vấn 1:1 trong 3 tháng',
    ],
    benefits: [
      'Mọi tính năng như gói 1 tháng nhưng duy trì lâu dài hơn để ngăn tái nghiện.',
      'Điều chỉnh kế hoạch theo tiến độ và thay đổi cảm xúc theo từng tháng.',
      '💬 8 buổi tư vấn 1:1 trong vòng 3 tháng (2–3 tuần/lần, ưu tiên phản hồi trong 24h khi gửi nhật ký hoặc câu hỏi).',
    ],
    description:
      'Phù hợp cho người muốn duy trì động lực lâu dài, cần điều chỉnh kế hoạch theo từng giai đoạn và nhận hỗ trợ chuyên sâu hơn.',
    color: 'purple',
    borderColor: 'border-purple-500',
    buttonClass: 'bg-purple-500 hover:bg-purple-600',
    ctaText: 'Xem chi tiết',
    disabled: false,
    popular: true,
  },
  {
    id: 'premium-6m',
    name: 'Premium 6 tháng',
    price: 299000,
    duration: '180 ngày',
    shortDescription: 'Xây dựng thói quen bền vững',
    keyFeatures: [
      'Kế hoạch 3 giai đoạn chuyên sâu',
      'Theo dõi sức khỏe nâng cao',
      'Ghi nhận biến động tâm lý, giấc ngủ',
      'Thay đổi lộ trình linh hoạt',
      '16 buổi tư vấn 1:1 trong 6 tháng',
    ],
    benefits: [
      'Kế hoạch được chia thành 3 giai đoạn: khởi động – thích nghi – duy trì.',
      'Theo dõi hồi phục sức khỏe nâng cao và động lực dài hạn.',
      'Ghi nhận biến động tâm lý, giấc ngủ, cân nặng.',
      'Có thể thay đổi lộ trình theo phản hồi từ chuyên gia.',
      '💬 16 buổi tư vấn 1:1 trong vòng 6 tháng (2–3 buổi/tháng, dày đặc ở tháng đầu và giãn dần về sau).',
    ],
    description:
      'Phù hợp cho người muốn xây dựng thói quen không hút thuốc bền vững, cần theo dõi sát sao và hỗ trợ lâu dài từ chuyên gia.',
    color: 'red',
    borderColor: 'border-red-500',
    buttonClass: 'bg-red-500 hover:bg-red-600',
    ctaText: 'Xem chi tiết',
    disabled: false,
    popular: false,
  },
];

const formatCurrency = (number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

const PremiumDetailsModal = ({ plan, open, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  if (!plan) return null;
  
  const handleBuy = async () => {
    if (plan.id === 'free') {
      setLoading(true);
      try {
        // Kiểm tra xem người dùng đã khai báo dữ liệu chưa
        const response = await api.get('/initial-condition/active');
        if (response.data) {
          // Đã khai báo rồi, chuyển thẳng đến trang quit-plan-free
          toast.success('Chuyển đến trang tạo kế hoạch cai thuốc!');
          setTimeout(() => {
            navigate('/service/quit-plan-free');
          }, 1000);
        } else {
          // Chưa khai báo, chuyển đến trang khai báo trước
          toast.info('Vui lòng khai báo thông tin hút thuốc trước!');
          setTimeout(() => {
            navigate('/init-status');
          }, 1000);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Chưa khai báo dữ liệu, chuyển đến trang khai báo
          toast.info('Vui lòng khai báo thông tin hút thuốc trước!');
          setTimeout(() => {
            navigate('/init-status');
          }, 1000);
        } else {
          // Có lỗi khác, hiển thị thông báo
          console.error('Error checking user data:', error);
          toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
      } finally {
        setLoading(false);
        onClose();
      }
    } else {
      onClose();
      navigate(`/payment/${plan.id}`);
    }
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
        <Text strong>Giá:</Text>{' '}
        <Text type={plan.id === 'free' ? 'secondary' : 'danger'} strong>
          {plan.priceDisplay}
        </Text>
        <br />
        <Text strong>Thời hạn:</Text> <Text>{plan.duration}</Text>
        <Divider />
        <Text strong>Quyền lợi:</Text>
        <List size="small" dataSource={plan.benefits || []} renderItem={(item) => <List.Item>- {item}</List.Item>} />
        <Divider />
        <Text strong>Mô tả:</Text>
        <Paragraph>{plan.description}</Paragraph>
        <div className="flex justify-end mt-4">
          <Button 
            type="primary" 
            size="large" 
            onClick={handleBuy}
            loading={loading}
          >
            {plan.id === 'free' ? 'Bắt đầu ngay' : 'Mua ngay'}
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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-center mb-8">
        <Tabs defaultActiveKey="1" items={tabItems} onChange={setBillingCycle} centered size="large" />
      </div>
      <Row gutter={[16, 24]} justify="center">
        {PLANS.map((plan) => (
          <Col xs={24} sm={12} lg={6} xl={6} key={plan.id}>
            <Card
              className={`h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg rounded-xl border-t-8 ${plan.borderColor} relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Tag color="gold" className="px-4 py-1 text-sm font-bold">
                    PHỔ BIẾN NHẤT
                  </Tag>
                </div>
              )}

              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 text-${plan.color}-600`}>
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-xs mb-4">{plan.shortDescription}</p>
                  <div className="mb-4">
                    <span className="text-2xl font-extrabold text-gray-900">
                      {getPriceDisplay(plan, billingCycle)}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-grow mb-6">
                  <ul className="space-y-2">
                    {plan.keyFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start text-xs">
                        <CheckCircleFilled
                          className={`text-${plan.color}-500 mr-2 mt-0.5 flex-shrink-0`}
                        />
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Button
                    type="primary"
                    size="large"
                    block
                    className={`font-bold text-white ${plan.buttonClass} h-10`}
                    disabled={plan.disabled}
                    onClick={() => !plan.disabled && handleOpenDetails(plan)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
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