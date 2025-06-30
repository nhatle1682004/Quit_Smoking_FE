import React, { useState, useEffect } from 'react';
import { DatePicker, Button, Input, message, Card, Steps, Typography, Space, Divider, Form, Modal } from 'antd';
import { DownloadOutlined, CalendarOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../../configs/axios';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;


function QuitPlanFree() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [hasExistingPlan, setHasExistingPlan] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Fetch initial condition data and check existing plan
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get('/initial-condition/active');
        if (response.data) {
          setInitialData(response.data);
          // Set form values from initial condition
          if (response.data.desiredQuitDate) {
            form.setFieldsValue({
              startDate: dayjs(response.data.desiredQuitDate),
              targetDate: null,
              notes: ''
            });
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          message.warning('Bạn chưa khai báo tình trạng ban đầu. Vui lòng khai báo trước khi tạo kế hoạch.');
          setTimeout(() => {
            navigate('/init-status');
          }, 2000);
        } else {
          console.error('Error fetching initial data:', error);
          message.error('Không thể tải dữ liệu ban đầu.');
        }
      } finally {
        setFetchingData(false);
      }
    };

    const checkExistingPlan = async () => {
      try {
        // Giả sử API endpoint để kiểm tra kế hoạch hiện tại
        const response = await api.get('/quit-plan/current');
        if (response.data) {
          setHasExistingPlan(true);
        }
      } catch {
        // Nếu không có kế hoạch hoặc lỗi, coi như không có
        setHasExistingPlan(false);
      }
    };

    fetchInitialData();
    checkExistingPlan();
  }, [navigate, form]);

  const handleDownloadPDF = () => {
    // Open PDF in new tab
    message.success('Đang mở mẫu kế hoạch...');
    window.open('/QuitSmoking_KeHoachCaiThuoc.pdf', '_blank');
  };

  const handleStartPlan = async (values) => {
    const { startDate, targetDate } = values;
    
    if (!startDate || !targetDate) {
      message.error('Vui lòng chọn đầy đủ ngày bắt đầu và ngày mục tiêu!');
      return;
    }

    if (startDate.isAfter(targetDate)) {
      message.error('Ngày bắt đầu không thể sau ngày mục tiêu!');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(1);
      setHasExistingPlan(true); // Set to true after creating new plan
      message.success('Kế hoạch cai thuốc đã được tạo thành công!');
    }, 1500);
  };

  const calculateDays = () => {
    const startDate = form.getFieldValue('startDate');
    const targetDate = form.getFieldValue('targetDate');
    if (startDate && targetDate) {
      return targetDate.diff(startDate, 'day');
    }
    return 0;
  };

  const handleViewJourney = () => {
    const values = form.getFieldsValue();
    // Navigate to process tracking page with plan data
    navigate('/service/process-tracking', {
      state: {
        startDate: values.startDate?.format('YYYY-MM-DD'),
        targetDate: values.targetDate?.format('YYYY-MM-DD'),
        notes: values.notes
      }
    });
  };

  const handleCreateNewPlan = () => {
    if (hasExistingPlan) {
      setShowConfirmModal(true);
    } else {
      setCurrentStep(0);
      form.resetFields();
      // Reset form with initial data
      if (initialData?.desiredQuitDate) {
        form.setFieldsValue({
          startDate: dayjs(initialData.desiredQuitDate),
          targetDate: null,
          notes: ''
        });
      }
    }
  };

  const handleConfirmNewPlan = () => {
    setShowConfirmModal(false);
    setCurrentStep(0);
    form.resetFields();
    // Reset form with initial data
    if (initialData?.desiredQuitDate) {
      form.setFieldsValue({
        startDate: dayjs(initialData.desiredQuitDate),
        targetDate: null,
        notes: ''
      });
    }
    message.info('Kế hoạch cũ đã được thay thế. Vui lòng tạo kế hoạch mới.');
  };

  const handleShowPackages = () => {
    setShowConfirmModal(false);
    navigate('/package'); // Navigate directly to package page
  };

  const handleNavigateToPackages = () => {
    setShowPackageModal(false);
    navigate('/package'); // Navigate to package page
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy dữ liệu khai báo ban đầu</p>
          <Button type="primary" onClick={() => navigate('/init-status')}>
            Khai báo ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg border-0">
          <div className="text-center mb-8">
            <Title level={1} className="text-blue-600 mb-4">
              🧠 XÂY DỰNG KẾ HOẠCH CAI THUỐC LÁ CHO BẠN
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Bạn đã sẵn sàng chưa? Đây là bước quan trọng nhất để bắt đầu hành trình cai thuốc.
            </Paragraph>
          </div>

          <Steps current={currentStep} className="mb-8">
            <Step title="Tải mẫu kế hoạch" icon={<DownloadOutlined />} />
            <Step title="Nhập thông tin" icon={<FileTextOutlined />} />
            <Step title="Hoàn thành" icon={<CheckCircleOutlined />} />
          </Steps>

          {currentStep === 0 && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <Title level={3} className="text-green-700 mb-4">
                  ✅ Vui lòng thực hiện các bước sau:
                </Title>
                
                <Divider />

                <div className="space-y-6">
                  {/* Bước 1 */}
                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <DownloadOutlined className="text-blue-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <Title level={4} className="text-blue-600 mb-2">
                          📥 Bước 1: Tải mẫu kế hoạch hướng dẫn (PDF)
                        </Title>
                        <Paragraph className="text-gray-600 mb-4">
                          Đây là mẫu giúp bạn tư duy, ghi rõ lý do, hành vi thay thế và sự chuẩn bị của chính bạn.
                        </Paragraph>
                        <Button 
                          type="primary" 
                          size="large"
                          icon={<DownloadOutlined />}
                          onClick={handleDownloadPDF}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Xem mẫu kế hoạch
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Bước 2 */}
                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <FileTextOutlined className="text-green-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <Title level={4} className="text-green-600 mb-4">
                          📝 Bước 2: Nhập thông tin kế hoạch
                        </Title>
                        
                        <Form
                          form={form}
                          layout="vertical"
                          onFinish={handleStartPlan}
                          className="space-y-4"
                        >
                          <div>
                            <Text strong className="block mb-2">
                              📅 Ngày bạn bắt đầu bỏ thuốc (từ khai báo ban đầu):
                            </Text>
                            <Form.Item name="startDate" noStyle>
                              <div className="bg-gray-50 p-3 rounded-lg border">
                                <Text className="text-gray-700 font-medium">
                                  {form.getFieldValue('startDate') ? form.getFieldValue('startDate').format('DD/MM/YYYY') : 'Chưa có dữ liệu'}
                                </Text>
                              </div>
                            </Form.Item>
                            <Text className="text-sm text-gray-500 mt-1">
                              Ngày này được lấy từ khai báo ban đầu của bạn và không thể thay đổi
                            </Text>
                          </div>

                          <Form.Item
                            name="targetDate"
                            label={
                              <Text strong>
                                🎯 Ngày bạn muốn hoàn thành mục tiêu bỏ thuốc:
                              </Text>
                            }
                            rules={[
                              { required: true, message: 'Vui lòng chọn ngày mục tiêu!' },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const startDate = getFieldValue('startDate');
                                  if (!value || !startDate) {
                                    return Promise.resolve();
                                  }
                                  if (value.isSame(startDate, 'day')) {
                                    return Promise.reject('Ngày mục tiêu không thể trùng với ngày bắt đầu!');
                                  }
                                  if (value.isBefore(startDate)) {
                                    return Promise.reject('Ngày mục tiêu không thể trước ngày bắt đầu!');
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <DatePicker
                              size="large"
                              placeholder="Chọn ngày mục tiêu"
                              className="w-full"
                              disabledDate={(current) => {
                                const today = dayjs().startOf('day');
                                const startDate = form.getFieldValue('startDate')?.startOf('day');
                                // Chỉ disable ngày trong quá khứ hoặc <= ngày bắt đầu
                                return (
                                  current && (
                                    current.isBefore(today, 'day') ||
                                    (startDate && (current.isSame(startDate, 'day') || current.isBefore(startDate, 'day')))
                                  )
                                );
                              }}
                            />
                          </Form.Item>

                          {form.getFieldValue('startDate') && form.getFieldValue('targetDate') && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <Text strong className="text-blue-600">
                                📊 Kế hoạch của bạn: {calculateDays()} ngày
                              </Text>
                            </div>
                          )}

                          <Form.Item
                            name="notes"
                            label={
                              <Text strong>
                                ✍️ Bạn có thể ghi chú thêm (tùy chọn):
                              </Text>
                            }
                          >
                            <TextArea
                              rows={3}
                              placeholder="Ghi chú về mục tiêu, động lực, hoặc kế hoạch cụ thể..."
                            />
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircleOutlined />}
                    onClick={() => form.submit()}
                    loading={loading}
                    className="bg-green-600 hover:bg-green-700 h-12 px-8 text-lg"
                  >
                    ✔️ BẮT ĐẦU KẾ HOẠCH NGAY
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <Title level={4} className="text-yellow-700 mb-3">
                  📌 Sau khi bạn bấm "Bắt đầu kế hoạch":
                </Title>
                <ul className="space-y-2 text-gray-700">
                  <li>• Chúng tôi sẽ hiển thị tiến trình mỗi ngày</li>
                  <li>• Nhắc nhở bạn mỗi sáng về trạng thái hôm nay</li>
                  <li>• Nhưng toàn bộ nội dung kế hoạch là của <strong>chính bạn tạo ra và in ra từ PDF</strong></li>
                </ul>
              </div>
            </>
          )}

          {currentStep === 1 && (
            <div className="text-center py-12">
              <CheckCircleOutlined className="text-green-500 text-6xl mb-6" />
              <Title level={2} className="text-green-600 mb-4">
                🎉 Kế hoạch cai thuốc đã được tạo thành công!
              </Title>
              <Paragraph className="text-lg text-gray-600 mb-6">
                Chúng tôi sẽ theo dõi tiến trình của bạn và gửi nhắc nhở hàng ngày.
              </Paragraph>
              <Space>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleViewJourney}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Xem tiến trình theo dõi
                </Button>
                <Button 
                  size="large"
                  onClick={handleCreateNewPlan}
                >
                  Tạo kế hoạch mới
                </Button>
              </Space>
            </div>
          )}
        </Card>
      </div>

      {/* Modal xác nhận tạo kế hoạch mới */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-yellow-500 text-xl mr-2" />
            <span>Xác nhận tạo kế hoạch mới</span>
          </div>
        }
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowConfirmModal(false)}>
            Huỷ
          </Button>,
          <Button key="packages" type="default" onClick={handleShowPackages}>
            Xem gói Premium
          </Button>,
          <Button key="confirm" type="primary" danger onClick={handleConfirmNewPlan}>
            Tạo kế hoạch mới
          </Button>,
        ]}
        centered
      >
        <div className="py-4">
          <p className="text-lg mb-4">
            ⚠️ Bạn đã có một kế hoạch đang thực hiện.
          </p>
          <p className="text-gray-600 mb-4">
            Việc tạo kế hoạch mới sẽ thay thế kế hoạch hiện tại. Bạn có chắc chắn không?
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700 text-sm">
              💡 <strong>Gợi ý:</strong> Nếu bạn muốn hỗ trợ chuyên sâu hơn, hãy xem các gói Premium với tư vấn 1:1 từ chuyên gia.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal gợi ý gói Premium */}
      <Modal
        title="🎯 Nâng cấp lên Premium để có kết quả tốt hơn"
        open={showPackageModal}
        onCancel={() => setShowPackageModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowPackageModal(false)}>
            Tiếp tục với gói miễn phí
          </Button>,
          <Button key="navigate" type="primary" onClick={handleNavigateToPackages}>
            Xem các gói Premium
          </Button>,
        ]}
        centered
        width={600}
      >
        <div className="py-4">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">🌟 Tại sao nên nâng cấp?</h4>
              <ul className="space-y-2 text-sm">
                <li>• ✅ Kế hoạch cá nhân hóa theo tình trạng của bạn</li>
                <li>• ✅ Tư vấn 1:1 với chuyên gia hàng tuần</li>
                <li>• ✅ Theo dõi sức khỏe chi tiết và điều chỉnh kế hoạch</li>
                <li>• ✅ Hỗ trợ 24/7 khi gặp khó khăn</li>
                <li>• ✅ Tỷ lệ thành công cao hơn 80%</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-700 text-sm">
                💡 <strong>Lưu ý:</strong> Gói miễn phí vẫn hiệu quả, nhưng Premium sẽ giúp bạn đạt mục tiêu nhanh hơn và bền vững hơn.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuitPlanFree;

/* CSS để đảm bảo ngày tương lai hiển thị màu đen */
<style jsx global>{`
  .ant-picker-cell:not(.ant-picker-cell-disabled) {
    color: #000000 !important;
  }
  
  .ant-picker-cell:not(.ant-picker-cell-disabled):hover {
    color: #000000 !important;
  }
  
  .ant-picker-cell-in-view:not(.ant-picker-cell-disabled) {
    color: #000000 !important;
  }
  
  .ant-picker-cell-in-view:not(.ant-picker-cell-disabled):hover {
    color: #000000 !important;
  }
`}</style>