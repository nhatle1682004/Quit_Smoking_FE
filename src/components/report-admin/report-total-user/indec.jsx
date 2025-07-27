import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Statistic, Spin, Avatar } from 'antd';
import {
  UserOutlined,
  EyeOutlined,
  CrownOutlined,
  DollarOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import api from '../../../configs/axios';

function ReportTotalUsers() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0); // Tổng doanh thu

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard/user-stats');
      setReport(response.data);
      // Gọi thêm API tổng doanh thu
      const totalRes = await api.get('/admin/dashboard/total-success-amount/all');
      setGrandTotal(totalRes.data.totalSuccessAmount || 0);
      toast.success("Lấy báo cáo thành công");
    } catch {
      (err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Format grandTotal to currency (Vietnamese Dong)
  const formattedGrandTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(grandTotal);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-40 ">
        <Spin size="large" />
        <span className="mt-4 text-indigo-500 font-semibold">Đang tải báo cáo...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
        <Avatar size={56} icon={<UserOutlined />} className="bg-gradient-to-br from-indigo-400 to-purple-400 shadow-2xl" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-1 drop-shadow">Báo cáo người dùng</h2>
          <div className="text-indigo-500 text-base md:text-lg">Thống kê tổng quan & doanh thu hệ thống</div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Tổng người dùng */}
        <div className="rounded-2xl shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100 p-5 flex items-center transition duration-300 hover:scale-105">
          <UserOutlined className="text-3xl text-blue-500 mr-4" />
          <div>
            <div className="flex items-center">
              <span className="text-base text-blue-800 font-semibold mr-2">Tổng người dùng</span>
            </div>
            <Statistic
              value={report?.totalUser || 0}
              valueStyle={{
                color: '#2563eb',
                fontWeight: 'bold',
                fontSize: 22, // nhỏ lại
                textShadow: '0 1px 2px #dbeafe',
                lineHeight: 1.1,
                maxWidth: '100%',
              }}
            />
            <div className="mt-1 text-gray-500 flex items-center gap-2 text-xs">
              <CalendarOutlined /> Cập nhật: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Đang hoạt động */}
        <div className="rounded-2xl shadow-lg bg-gradient-to-br from-green-100 to-green-50 p-5 flex items-center transition duration-300 hover:scale-105">
          <EyeOutlined className="text-3xl text-green-500 mr-4" />
          <div>
            <div className="flex items-center">
              <span className="text-base text-green-800 font-semibold mr-2">Đang hoạt động</span>
            </div>
            <Statistic
              value={report?.activeUser || 0}
              valueStyle={{
                color: '#16a34a',
                fontWeight: 'bold',
                fontSize: 22,
                textShadow: '0 1px 2px #dcfce7',
                lineHeight: 1.1,
                maxWidth: '100%',
              }}
            />
          </div>
        </div>

        {/* Đã mua gói */}
        <div className="rounded-2xl shadow-lg bg-gradient-to-br from-yellow-100 to-yellow-50 p-5 flex items-center transition duration-300 hover:scale-105">
          <CrownOutlined className="text-3xl text-yellow-500 mr-4" />
          <div>
            <div className="flex items-center">
              <span className="text-base text-yellow-800 font-semibold mr-2">Đã mua gói</span>
            </div>
            <Statistic
              value={report?.userHasPurchasedPlan || 0}
              valueStyle={{
                color: '#eab308',
                fontWeight: 'bold',
                fontSize: 22,
                textShadow: '0 1px 2px #fef9c3',
                lineHeight: 1.1,
                maxWidth: '100%',
              }}
            />
          </div>
        </div>

        {/* Tổng doanh thu */}
        <div className="rounded-2xl shadow-lg bg-gradient-to-br from-orange-100 to-red-50 p-5 flex items-center transition duration-300 hover:scale-105">
          <DollarOutlined className="text-3xl text-orange-500 mr-4" />
          <div>
            <div className="flex items-center">
              <span className="text-base text-orange-800 font-semibold mr-2">Tổng doanh thu</span>
            </div>
            <Statistic
              value={formattedGrandTotal}
              valueStyle={{
                color: '#ef4444',
                fontWeight: 'bold',
                fontSize: 22,
                textShadow: '0 1px 2px #fee2e2',
                lineHeight: 1.1,
                maxWidth: '100%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportTotalUsers;
