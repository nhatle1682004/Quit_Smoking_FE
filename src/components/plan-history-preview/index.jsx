import React, { useEffect, useState } from 'react';
import api from '../../configs/axios';
import { ClockCircleOutlined } from '@ant-design/icons';

function PlanHistoryPreview() {
  const [planHistory, setPlanHistory] = useState([]);

  const fetchPlanHistory = async () => {
    try {
      const response = await api.get('/quit-plan/history');
      setPlanHistory(response.data);
    } catch (error) {
      console.error("Error fetching plan history:", error);
    }
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlanHistoryPreview;
