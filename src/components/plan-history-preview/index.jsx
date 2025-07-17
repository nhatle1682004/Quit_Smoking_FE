import React, { useEffect, useState } from 'react';
import api from '../../configs/axios';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Modal, Button, Spin, Descriptions, message } from 'antd';

function PlanHistoryPreview() {
  const [planHistory, setPlanHistory] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [planDetail, setPlanDetail] = useState(null);

  const fetchPlanHistory = async () => {
    try {
      const response = await api.get('/quit-plan/history');
      setPlanHistory(response.data);
    } catch (error) {
      console.error("Error fetching plan history:", error);
    }
  };

  const handleViewDetail = async (planId) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const response = await api.get(`/quit-plan/detail/${planId}`);
      setPlanDetail(response.data);
    } catch (error) {
      message.error('Không thể lấy chi tiết kế hoạch.');
      setPlanDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setPlanDetail(null);
  };

  useEffect(() => {
    fetchPlanHistory();
  }, []);

  // Badge color mapping
  const statusStyle = {
    ACTIVE: 'bg-gradient-to-r from-green-400 to-green-600 shadow-green-200',
    INACTIVE: 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-gray-200',
    COMPLETED: 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-200',
    CANCELLED: 'bg-gradient-to-r from-red-400 to-red-600 shadow-red-200',
    default: 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-gray-200',
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-2xl my-12 max-w-2xl mx-auto relative overflow-hidden">
      {/* Decorative blurred icon background */}
      <div className="absolute -top-8 -right-8 opacity-10 text-[120px] pointer-events-none select-none">
        <ClockCircleOutlined />
      </div>
      <div className="flex items-center gap-4 mb-8 text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent border-b-2 border-blue-100 pb-4 relative z-10">
        <ClockCircleOutlined className="text-blue-500 text-4xl drop-shadow-lg" />
        <span>Lịch sử kế hoạch</span>
      </div>

      {planHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <ClockCircleOutlined className="text-6xl text-blue-300 mb-2 animate-pulse" />
          <p className="text-gray-400 text-lg font-semibold">Bạn chưa có lịch sử kế hoạch nào.</p>
        </div>
      ) : (
        <ul className="space-y-7">
          {planHistory.slice(0, 3).map((plan) => (
            <li
              key={plan.id}
              className="border border-blue-100 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-lg flex items-center gap-2 text-blue-700">
                  <span role="img" aria-label="note">📝</span>
                  {plan.packageInfo?.name || 'Gói không rõ'}
                </div>
                <span
                  className={`inline-block px-4 py-1 rounded-full text-xs font-bold text-white shadow-md uppercase tracking-wide ${
                    statusStyle[plan.status] || statusStyle.default
                  }`}
                >
                  {plan.status === 'ACTIVE' && 'Đang diễn ra'}
                  {plan.status === 'COMPLETED' && 'Hoàn thành'}
                  {plan.status === 'CANCELLED' && 'Đã hủy'}
                  {plan.status === 'INACTIVE' && 'Không hoạt động'}
                  {!['ACTIVE', 'COMPLETED', 'CANCELLED', 'INACTIVE'].includes(plan.status) && plan.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base text-gray-700 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Bắt đầu:</span>
                  <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Dự kiến bỏ thuốc:</span>
                  <span>{new Date(plan.targetQuitDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Thời hạn gói:</span>
                  <span>{plan.packageInfo?.duration} ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Hỗ trợ chuyên gia:</span>
                  {plan.packageInfo?.coachSupport ? (
                    <span className="text-green-600 font-semibold">Có</span>
                  ) : (
                    <span className="text-gray-400">Không</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="primary" onClick={() => handleViewDetail(plan.id)}>
                  Xem chi tiết
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal
        title={null}
        open={detailModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={650}
        bodyStyle={{ padding: 0 }}
      >
        {detailLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : planDetail ? (
          <div className="p-8">
            {/* Header: Tên gói, trạng thái, giá */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <ClockCircleOutlined className="text-3xl text-blue-500" />
                <span className="text-2xl font-bold text-blue-700">{planDetail.packageInfo?.name || 'Không rõ'}</span>
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  planDetail.status === 'ACTIVE' ? 'bg-green-500' :
                  planDetail.status === 'COMPLETED' ? 'bg-blue-500' :
                  planDetail.status === 'CANCELLED' ? 'bg-red-500' :
                  planDetail.status === 'INACTIVE' ? 'bg-gray-400' : 'bg-gray-300'
                }`}>
                  {planDetail.status === 'ACTIVE' && 'Đang diễn ra'}
                  {planDetail.status === 'COMPLETED' && 'Hoàn thành'}
                  {planDetail.status === 'CANCELLED' && 'Đã hủy'}
                  {planDetail.status === 'INACTIVE' && 'Không hoạt động'}
                  {!['ACTIVE', 'COMPLETED', 'CANCELLED', 'INACTIVE'].includes(planDetail.status) && planDetail.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-500">Giá gói:</span>
                <span className="text-lg font-bold text-green-600">{planDetail.packageInfo?.price ? planDetail.packageInfo.price + ' VNĐ' : 'Không rõ'}</span>
              </div>
            </div>
            {/* Thông tin chung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-medium">Mã gói:</span>
                <span>{planDetail.packageInfo?.code || 'Không rõ'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Thời hạn:</span>
                <span>{planDetail.packageInfo?.duration ? planDetail.packageInfo.duration + ' ngày' : 'Không rõ'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Bắt đầu:</span>
                <span>{planDetail.startDate ? new Date(planDetail.startDate).toLocaleDateString() : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Dự kiến bỏ thuốc:</span>
                <span>{planDetail.targetQuitDate ? new Date(planDetail.targetQuitDate).toLocaleDateString() : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Hỗ trợ chuyên gia:</span>
                <span className={planDetail.packageInfo?.coachSupport ? 'text-green-600 font-semibold' : 'text-gray-400'}>{planDetail.packageInfo?.coachSupport ? 'Có' : 'Không'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Phương pháp:</span>
                <span>{planDetail.method || 'Không rõ'}</span>
              </div>
            </div>
            {/* Block mô tả, lý do, chi tiết kế hoạch */}
            <div className="mb-4">
              <div className="font-semibold text-gray-600 mb-1">Mô tả gói:</div>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-line min-h-[40px]">{planDetail.packageInfo?.description || 'Không rõ'}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-gray-600 mb-1">Lý do bỏ thuốc:</div>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-line min-h-[40px]">{planDetail.motivationReason || 'Không rõ'}</div>
            </div>
            <div className="mb-2">
              <div className="font-semibold text-gray-600 mb-1">Chi tiết kế hoạch:</div>
              {(() => {
                let planDetailArr = [];
                try {
                  planDetailArr = JSON.parse(planDetail.planDetail);
                } catch {
                  planDetailArr = null;
                }
                if (Array.isArray(planDetailArr)) {
                  return (
                    <ul className="space-y-2">
                      {planDetailArr.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-blue-50 rounded-lg p-2">
                          <span className="font-bold text-blue-500">Ngày {item.day}:</span>
                          <span className="flex-1">{item.note}</span>
                          <span className="text-gray-500">({item.cigarettes} điếu)</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-line min-h-[40px]">{planDetail.planDetail || 'Không rõ'}</div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">Không có dữ liệu chi tiết.</div>
        )}
      </Modal>
    </div>
  );
}

export default PlanHistoryPreview;
