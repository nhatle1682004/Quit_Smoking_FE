import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Progress, Typography, Button, Space, Divider, Tag } from 'antd';
import { 
  CalendarOutlined, 
  TrophyOutlined, 
  FireOutlined, 
  HeartOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

function ProcessTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate] = useState(dayjs());
  
  // Get plan data from navigation state or use default values
  const planData = location.state || {
    startDate: '2025-07-01',
    targetDate: '2025-08-15',
    notes: ''
  };

  const startDate = dayjs(planData.startDate);
  const targetDate = dayjs(planData.targetDate);
  
  // Calculate journey progress
  const totalDays = targetDate.diff(startDate, 'day');
  const daysElapsedRaw = currentDate.diff(startDate, 'day');
  const daysRemainingRaw = targetDate.diff(currentDate, 'day');
  const daysElapsed = Math.max(0, daysElapsedRaw);
  const daysRemaining = Math.max(0, daysRemainingRaw);
  const progressPercentage = Math.min((daysElapsed / totalDays) * 100, 100);

  // Determine current phase and message
  const getCurrentPhase = () => {
    if (daysElapsedRaw < 0) return { phase: 'preparation', message: 'Chuẩn bị bắt đầu hành trình cai thuốc!' };
    if (daysElapsedRaw === 0) return { phase: 'start', message: 'Hôm nay là ngày đầu tiên! Bạn đã sẵn sàng chưa?' };
    if (daysRemainingRaw === 0) return { phase: 'target', message: 'Chúc mừng! Hôm nay là ngày bạn chạm tới mục tiêu cai thuốc!' };
    if (daysRemainingRaw < 0) return { phase: 'completed', message: 'Tuyệt vời! Bạn đã vượt qua mục tiêu!' };
    return { phase: 'ongoing', message: `Tiếp tục kiên trì! Bạn đang làm rất tốt!` };
  };

  const { phase, message } = getCurrentPhase();

  const getMotivationalMessage = () => {
    const messages = {
      preparation: 'Hãy chuẩn bị tinh thần và sẵn sàng cho hành trình mới!',
      start: 'Bước đầu tiên luôn là bước quan trọng nhất. Hãy tin vào bản thân!',
      ongoing: [
        'Mỗi ngày không hút thuốc là một chiến thắng nhỏ!',
        'Sức khỏe của bạn đang được cải thiện từng ngày!',
        'Bạn đang tiết kiệm tiền và bảo vệ sức khỏe!',
        'Gia đình và bạn bè sẽ tự hào về bạn!',
        'Hơi thở của bạn đang trở nên trong lành hơn!'
      ],
      target: 'Bạn đã đạt được mục tiêu! Đây là thành tựu tuyệt vời!',
      completed: 'Bạn là tấm gương sáng cho những người khác!'
    };

    if (phase === 'ongoing') {
      const randomIndex = Math.floor(Math.random() * messages.ongoing.length);
      return messages.ongoing[randomIndex];
    }
    return messages[phase];
  };

  const getPhaseColor = () => {
    const colors = {
      preparation: 'blue',
      start: 'green',
      ongoing: 'orange',
      target: 'gold',
      completed: 'purple'
    };
    return colors[phase];
  };

  const getPhaseIcon = () => {
    const icons = {
      preparation: <ClockCircleOutlined />,
      start: <FireOutlined />,
      ongoing: <HeartOutlined />,
      target: <TrophyOutlined />,
      completed: <CheckCircleOutlined />
    };
    return icons[phase];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/service/quit-plan-free')}
            className="mb-4"
          >
            Quay lại
          </Button>
          <Title level={1} className="text-center text-green-600 mb-2">
            🚀 HÀNH TRÌNH BỎ THUỐC CỦA BẠN
          </Title>
        </div>

        {/* Main Journey Card */}
        <Card className="shadow-lg border-0 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              {getPhaseIcon()}
            </div>
            <Title level={2} className={`text-${getPhaseColor()}-600 mb-2`}>
              {message}
            </Title>
            <Paragraph className="text-lg text-gray-600">
              {getMotivationalMessage()}
            </Paragraph>
          </div>

          <Divider />

          {/* Progress Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <CalendarOutlined className="text-blue-500 text-2xl mb-2" />
                <Text strong className="block text-gray-700">Ngày bắt đầu</Text>
                <Text className="text-lg text-blue-600">
                  {startDate.format('DD/MM/YYYY')}
                </Text>
              </div>
              <div className="text-center">
                <TrophyOutlined className="text-green-500 text-2xl mb-2" />
                <Text strong className="block text-gray-700">Ngày mục tiêu</Text>
                <Text className="text-lg text-green-600">
                  {targetDate.format('DD/MM/YYYY')}
                </Text>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                  <Text strong className="block text-gray-700 mb-1">🗓️ Hôm nay là</Text>
                  <Text className="text-xl font-bold text-blue-600">
                    Ngày thứ {Math.max(0, daysElapsed)} / {totalDays}
                  </Text>
                </div>
                <div>
                  <Text strong className="block text-gray-700 mb-1">⏳ Còn lại</Text>
                  <Text className="text-xl font-bold text-green-600">
                    {Math.max(0, daysRemaining)} ngày nữa đến mục tiêu
                  </Text>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Text strong>Tiến độ hành trình</Text>
                <Text className="text-green-600 font-bold">
                  {Math.round(progressPercentage)}%
                </Text>
              </div>
              <Progress 
                percent={progressPercentage} 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size="large"
              />
            </div>
          </div>

          {/* Phase Tag */}
          <div className="text-center mb-6">
            <Tag color={getPhaseColor()} size="large" className="text-lg px-4 py-2">
              {phase === 'preparation' && '🔄 Chuẩn bị'}
              {phase === 'start' && '🚀 Bắt đầu'}
              {phase === 'ongoing' && '🔥 Đang thực hiện'}
              {phase === 'target' && '🎯 Đạt mục tiêu'}
              {phase === 'completed' && '🏆 Hoàn thành'}
            </Tag>
          </div>

          {/* Notes Section */}
          {planData.notes && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <Text strong className="block text-yellow-700 mb-2">
                📝 Ghi chú của bạn:
              </Text>
              <Text className="text-gray-700">{planData.notes}</Text>
            </div>
          )}
        </Card>

        {/* Daily Tips Card */}
        <Card className="shadow-lg border-0">
          <Title level={3} className="text-center text-purple-600 mb-4">
            💡 Lời khuyên hôm nay
          </Title>
          <div className="bg-purple-50 p-6 rounded-lg">
            <Paragraph className="text-lg text-gray-700 text-center">
              {daysElapsed < 3 && 'Những ngày đầu tiên có thể khó khăn, nhưng hãy nhớ lý do bạn bắt đầu!'}
              {daysElapsed >= 3 && daysElapsed < 7 && 'Tuần đầu tiên đã qua! Cơ thể bạn đang thích nghi với việc không có nicotine.'}
              {daysElapsed >= 7 && daysElapsed < 14 && 'Một tuần rồi! Khứu giác và vị giác của bạn đang dần hồi phục.'}
              {daysElapsed >= 14 && daysElapsed < 30 && 'Hai tuần! Nguy cơ tái phát đã giảm đáng kể. Tiếp tục kiên trì!'}
              {daysElapsed >= 30 && daysElapsed < 90 && 'Một tháng! Bạn đã vượt qua giai đoạn khó khăn nhất.'}
              {daysElapsed >= 90 && 'Ba tháng! Bạn đã thành công thay đổi thói quen. Hãy duy trì!'}
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ProcessTracking;