import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../configs/axios';
import { Button, Badge, Divider } from 'antd';
import { GiftOutlined, CheckCircleOutlined } from '@ant-design/icons';

function PackagePage() {
  const [initialPackages, setInitialPackages] = useState([]);

  // Lấy danh sách package public
  const fetchPackages = async () => {
    try {
      const response = await api.get('/package');
      setInitialPackages(response.data);
    } catch {
      toast.error("Lấy dữ liệu gói thất bại");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBuyPackage = async (packageCode) => {
    try {
      const response = await api.post('/purchased-plan/buy', {
        packageCode: String(packageCode)
      });

      const { paymentUrl } = response.data;
      window.open(paymentUrl, '_blank'); // Mở trang thanh toán ở tab mới
    } catch (error) {
      console.log(error);
      toast.error("Mua gói thất bại");
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDuration = (days) => `${days} ngày`;

  return (
    <div className="min-h-screen bg-white py-6 px-2 sm:py-10 sm:px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-10 text-black">
          🎁 Danh sách gói hỗ trợ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {initialPackages.map((pkg) => {
            const code = pkg.code || pkg.packageCode;
            return (
              <div
                key={code}
                className="flex flex-col h-full rounded-2xl shadow-xl border-2 border-[#2563eb] bg-white p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <GiftOutlined style={{ fontSize: 28, color: '#2563eb' }} />
                  <span className="text-lg sm:text-xl font-bold text-black">{pkg.name}</span>
                </div>
                <div className="flex-1" style={{ minHeight: 40, marginBottom: 4 }}>
                  {pkg.description && pkg.description.split('\n').map((line, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 mb-2 text-black text-sm sm:text-base"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      <CheckCircleOutlined style={{ fontSize: 18, color: '#22c55e', marginTop: 3 }} />
                      <span className="text-black">{line}</span>
                    </div>
                  ))}
                </div>
                <Divider dashed style={{ margin: '8px 0' }} />
                <div className="mb-2 flex items-center gap-2 text-black text-sm sm:text-base">
                  <Badge color="blue" />
                  <span className="font-semibold text-black">Giá:</span>
                  <span className="font-bold text-black text-lg">{formatPrice(pkg.price)}</span>
                </div>
                <div className="mb-2 flex items-center gap-2 text-black text-sm sm:text-base">
                  <Badge color="purple" />
                  <span className="font-semibold text-black">Thời hạn:</span>
                  <span className="font-bold text-black">{formatDuration(pkg.duration)}</span>
                </div>
                <Button
                  type="primary"
                  size="large"
                  className="w-full mt-auto rounded-lg font-bold text-base sm:text-lg py-2 sm:py-3"
                  style={{
                    background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleBuyPackage(code)}
                >
                  Mua ngay
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PackagePage;
