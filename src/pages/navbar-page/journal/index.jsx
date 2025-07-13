import React, { useState, useEffect } from 'react';
import api from '../../../configs/axios';
import { toast } from 'react-toastify';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Spin,
  Divider,
} from 'antd';
import {
  FireOutlined,
  TrophyOutlined,
  DollarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  CalendarOutlined,
  UserOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import DatePickerSmokingLog from './DatePickerSmokingLog';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;

function LogSmoking() {
  const [form] = Form.useForm();
  const [logData, setLogData] = useState({
    cigarettesToday: 0,
    targetCigarettes: 1,
    nicotineEstimate: 0,
    coStatus: "Ít thay đổi",
    moneySavedToday: 0,
    lungStatus: "Ổn định",
    tasteStatus: "Bình thường",
    bloodPressureStatus: "Chưa ổn định",
    circulationStatus: "Chưa ổn định",
    skinStatus: "Ổn định",
    heartRate: "72 bpm",
    heartRateStatus: "Chưa ổn định",
    dailyHealthPercent: 0,
    targetAchieved: false
  });
  const [loading, setLoading] = useState(false);
  const [stats,setStatsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

    const fetchStats = async () => {
      try {
        const res = await api.get("/smoking-log/stats");
        setStatsData(res.data);
      } catch (error) {
        toast.error('Không thể tải thống kê!');
        console.error(error);
      }
    };

  const fetchSmokingLogByDay = async (date) => {
    try {
      const res = await api.get('/smoking-log/day', { params: { date } });
      if (!res.data || Object.keys(res.data).length === 0) {
        toast.error('Bạn chưa khai báo nhật ký cho ngày này.');
        setLogData(null);
      } else {
        setLogData(res.data);
      }
    } catch {
      toast.error('Bạn chưa khai báo nhật ký cho ngày này.');
      setLogData(null);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchSmokingLogByDay(selectedDate);
  }, [selectedDate]);


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/smoking-log", values);
      setLogData(res.data);
      toast.success("Cập nhật nhật ký hút thuốc thành công!");
      form.resetFields();
      setLogData(res.data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      toast.error("Không thể cập nhật nhật ký hút thuốc! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusTag = (status) => {
    const colorMap = {
      'Ổn định': 'green',
      'Bình thường': 'blue',
      'Chưa ổn định': 'orange',
      'Ít thay đổi': 'yellow',
      'Tốt': 'green',
      'Cần cải thiện': 'red',
      'Cải thiện': 'green',
      'Cải thiện rõ': 'green',
      'Giảm mạnh': 'green',
      'Cải thiện mạnh': 'green',
    };

    return (
      <Tag color={colorMap[status] || 'default'} style={{ fontSize: '14px', padding: '4px 8px' }}>
        {status}
      </Tag>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 my-10 px-4">
      <div className="max-w-7xl  mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full my-6">
            <HeartOutlined className="text-white text-3xl" />
          </div>
          <Title level={1} className="text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Nhật Ký Hút Thuốc
          </Title>
          <Text className="text-gray-600 text-lg">
            Theo dõi tiến trình cai thuốc và sức khỏe của bạn
          </Text>
        </div>

        {/* Date Picker + Tổng quan thống kê */}
        <Row gutter={[24, 24]} className="mb-12" justify="center" align="stretch">
          <Col xs={24} md={12} lg={8} style={{ height: '100%' }}>
            <Card
              className="shadow-lg border-0 bg-gradient-to-br from-blue-100 to-green-100"
              style={{ borderRadius: '16px', height: '100%' }}
            >
              <div className="text-center mb-4">
                <CalendarOutlined className="text-blue-500 text-2xl mb-2" />
                <Title level={3} className="text-blue-700 my-4">Chọn ngày xem nhật ký</Title>
                <Text className="text-gray-600">Bạn có thể xem lại nhật ký hút thuốc của bất kỳ ngày nào</Text>
              </div>
              <DatePickerSmokingLog
                onDateChange={(date) => {
                  if (date) setSelectedDate(date.format('YYYY-MM-DD'));
                }}
                defaultValue={dayjs(selectedDate)}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8} style={{ height: '100%' }}>
            {stats && (
              <Card
                className="shadow-lg border-0 bg-gradient-to-br from-blue-100 to-green-100"
                style={{ borderRadius: '16px', height: '100%' }}
              >
                <Title level={3} className="text-center text-blue-700 my-4">
                  📊 Thống kê tổng quan
                </Title>
                <Row gutter={16} className="text-center">
                  <Col xs={24} sm={12}>
                    <Statistic
                      title="Tổng số ngày ghi nhận"
                      value={stats.totalDays}
                      valueStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Statistic
                      title="Tổng số điếu thuốc"
                      value={stats.totalCigarettes}
                      valueStyle={{ color: '#dc2626', fontWeight: 'bold' }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Statistic
                      title="Tổng tiền tiết kiệm (VNĐ)"
                      value={stats.totalMoneySaved}
                      valueStyle={{ color: '#059669', fontWeight: 'bold' }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Statistic
                      title="Số ngày đạt mục tiêu"
                      value={stats.daysAchievedTarget}
                      valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                  </Col>
                </Row>
              </Card>
            )}
          </Col>
        </Row>

        {/* Form Section */}
        <Card
          className="my-10 mb-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm"
          style={{ borderRadius: '20px', padding: '3px', marginBottom: 40 }}
        >
          <div className="text-center my-6">
            <Title level={3} className="text-gray-700 mb-2">
              📝 Ghi nhận hôm nay
            </Title>
            <Text className="text-gray-500">
              Hãy chia sẻ thông tin về việc hút thuốc của bạn
            </Text>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="max-w-2xl mx-auto"
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">
                      <FireOutlined className="mr-2 text-red-500" />
                      Số điếu thuốc hôm nay
                    </span>
                  }
                  name="cigarettesToday"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điếu thuốc!." },
                    { type: "number", min: 0, message: "Số điếu phải không được là số âm!." },
                  ]}
                >
                  <InputNumber            
                    style={{ width: "100%" }} 
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">
                      <CalendarOutlined className="mr-2 text-blue-500" />
                      Ngày hôm nay
                    </span>
                  }
                >
                  <Input 
                    value={new Date().toLocaleDateString('vi-VN')}
                    disabled
                    size="large"
                    className="rounded-lg bg-gray-50"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  <UserOutlined className="mr-2 text-green-500" />
                  Ghi chú cá nhân
                </span>
              }
              name="note"
              rules={[
                { required: true, message: "Vui lòng nhập ghi chú." },
                { max: 255, message: "Ghi chú không quá 255 ký tự." },
              ]}
            >
              <TextArea 
                rows={4} 
                placeholder="Chia sẻ cảm nhận, khó khăn hoặc thành tựu của bạn hôm nay..."
                className="rounded-lg"
                style={{ resize: 'none' }}
              />
            </Form.Item>

            <div className="text-center">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                className="px-12 py-3 my-3 h-auto rounded-full bg-gradient-to-r from-blue-500 to-green-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ fontSize: '16px', fontWeight: '600' }}
              >
                {loading ? (
                  <>
                    <LoadingOutlined className="mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <SmileOutlined className="mr-2" />
                    Gửi nhật ký
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card>

        {/* Update Loading State */}
        {loading && (
          <div className="text-center py-8 my-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full my-4">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: 'white' }} spin />} />
            </div>
            <Text className="block text-gray-600">Đang cập nhật dữ liệu...</Text>
          </div>
        )}

        {/* Results Section */}
        {logData && (
          <div className="space-y-8">
            {/* Main Statistics */}
            <Row gutter={[24, 24]}>
                              <Col xs={24} sm={12} lg={6}>
                  <Card 
                    className="text-center my-10 shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300"
                    style={{ borderRadius: '16px' }}
                  >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-3">
                      <FireOutlined className="text-white text-2xl" />
                    </div>
                  </div>
                  <Statistic
                    title={<span className="text-gray-700 font-medium">Thuốc lá hôm nay</span>}
                    value={logData.cigarettesToday}
                    valueStyle={{ 
                      color: logData.cigarettesToday > 0 ? '#dc2626' : '#059669',
                      fontSize: '28px',
                      fontWeight: 'bold'
                    }}
                  />
                </Card>
              </Col>
                              <Col xs={24} sm={12} lg={6}>
                  <Card 
                    className="text-center my-10 shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300"
                    style={{ borderRadius: '16px' }}
                  >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-3">
                      <TrophyOutlined className="text-white text-2xl" />
                    </div>
                  </div>
                  <Statistic
                    title={<span className="text-gray-700 font-medium">Mục tiêu</span>}
                    value={logData.targetCigarettes}
                    valueStyle={{ 
                      color: '#059669',
                      fontSize: '28px',
                      fontWeight: 'bold'
                    }}
                  />
                </Card>
              </Col>
                              <Col xs={24} sm={12} lg={6}>
                  <Card 
                    className="text-center my-10 shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300"
                    style={{ borderRadius: '16px' }}
                  >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-3">
                      <FireOutlined className="text-white text-2xl" />
                    </div>
                  </div>
                  <Statistic
                    title={<span className="text-gray-700 font-medium">Nicotine (mg)</span>}
                    value={logData.nicotineEstimate}
                    valueStyle={{ 
                      color: logData.nicotineEstimate > 0 ? '#ea580c' : '#059669',
                      fontSize: '28px',
                      fontWeight: 'bold'
                    }}
                    precision={1}
                  />
                </Card>
              </Col>
                              <Col xs={24} sm={12} lg={6}>
                  <Card 
                    className="text-center my-10 shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300"
                    style={{ borderRadius: '16px' }}
                  >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-3">
                      <DollarOutlined className="text-white text-2xl" />
                    </div>
                  </div>
                  <Statistic
                    title={<span className="text-gray-700 font-medium">Tiết kiệm hôm nay</span>}
                    value={logData.moneySavedToday}
                    valueStyle={{ 
                      color: '#059669',
                      fontSize: '28px',
                      fontWeight: 'bold'
                    }}
                    suffix=" VNĐ"
                  />
                </Card>
              </Col>
            </Row>

            {/* Health Progress */}
            <Card 
              className="my-10 shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50"
              style={{ borderRadius: '20px' }}
            >
              <div className="text-center my-6">
                <Title level={3} className="text-gray-800 mb-2">
                  📊 Tiến độ sức khỏe hôm nay
                </Title>
                <Text className="text-gray-600">
                  Đánh giá tổng quan về tình trạng sức khỏe của bạn
                </Text>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <Text strong className="text-lg">Hoàn thành mục tiêu:</Text>
                  {logData.targetAchieved ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircleOutlined className="text-2xl mr-2" />
                      <span className="font-medium">Đạt được</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <CloseCircleOutlined className="text-2xl mr-2" />
                      <span className="font-medium">Chưa đạt</span>
                    </div>
                  )}
                </div>
                <Progress
                  percent={logData.dailyHealthPercent}
                  status={logData.dailyHealthPercent >= 80 ? 'success' : 'active'}
                  strokeColor={{
                    '0%': '#3b82f6',
                    '100%': '#10b981',
                  }}
                  strokeWidth={12}
                  className="mb-6"
                />
                <div className="text-center">
                  <Text className="text-gray-600">
                    Sức khỏe của bạn đang ở mức {logData.dailyHealthPercent}%
                  </Text>
                </div>
              </div>
            </Card>

            {/* Health Status Details */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <span className="text-gray-800 font-semibold">
                      ❤️ Tình trạng tim mạch
                    </span>
                  } 
                  className="h-full my-10 shadow-lg border-0 bg-gradient-to-br from-red-50 to-pink-50"
                  style={{ borderRadius: '16px' }}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <Text className="text-gray-700 font-medium">Nhịp tim:</Text>
                      <Text strong className="text-lg">{logData.heartRate}</Text>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <Text className="text-gray-700 font-medium">Trạng thái nhịp tim:</Text>
                      {renderStatusTag(logData.heartRateStatus)}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <Text className="text-gray-700 font-medium">Huyết áp:</Text>
                      {renderStatusTag(logData.bloodPressureStatus)}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <Text className="text-gray-700 font-medium">Tuần hoàn:</Text>
                      {renderStatusTag(logData.circulationStatus)}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <span className="text-gray-800 font-semibold">
                      🌟 Tình trạng khác
                    </span>
                  } 
                  className="h-full my-10 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50"
                  style={{ borderRadius: '16px' }}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <Text className="text-gray-700 font-medium">Phổi:</Text>
                      {renderStatusTag(logData.lungStatus)}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <Text className="text-gray-700 font-medium">Vị giác:</Text>
                      {renderStatusTag(logData.tasteStatus)}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <Text className="text-gray-700 font-medium">Da:</Text>
                      {renderStatusTag(logData.skinStatus)}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <Text className="text-gray-700 font-medium">CO:</Text>
                      {renderStatusTag(logData.coStatus)}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Motivational Message */}
            <Card 
              className="my-10 shadow-xl border-0 text-center"
              style={{ 
                borderRadius: '20px',
                background: logData.targetAchieved 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              }}
            >
              <div className="py-8">
                <HeartOutlined className="text-white text-4xl mb-4" />
                <Text className="text-white text-lg font-medium block">
                  {logData.targetAchieved
                    ? "🎉 Chúc mừng! Bạn đã đạt được mục tiêu hôm nay và sức khỏe đang cải thiện rất tốt!"
                    : "💪 Hãy cố gắng hơn để đạt được mục tiêu của bạn! Mỗi ngày là một bước tiến mới!"}
                </Text>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogSmoking;
