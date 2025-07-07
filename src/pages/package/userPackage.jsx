import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../configs/axios';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from 'antd';
import { GiftOutlined, CheckCircleOutlined } from '@ant-design/icons';

function UserPackage() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách gói đã mua
  const fetchUserPackage = async () => {
    try {
      const response = await api.get('/purchased-plan/my');
      setPackages(response.data);
      toast.success('Lấy dữ liệu gói của bạn thành công');
    } catch {
      toast.error('Không lấy được gói của bạn');
    }
  };

  useEffect(() => {
    fetchUserPackage();
  }, []);

  // Gọi API kích hoạt gói
  const handleActivatePackage = async (planId) => {
    try {
      const response = await api.post(`/purchased-plan/${planId}/activate`);
      toast.success('Kích hoạt gói thành công');
      fetchUserPackage(); // reload lại danh sách
    } catch (err) {
      console.error(err);
      toast.error('Không thể kích hoạt gói');
    }
  };

  // Badge trạng thái gói
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge status="success" text="Đang hoạt động" />;
      case 'INACTIVE':
        return <Badge status="default" text="Chưa kích hoạt" />;
      case 'EXPIRED':
        return <Badge status="error" text="Hết hạn" />;
      default:
        return <Badge status="warning" text={status} />;
    }
  };

  // Badge trạng thái thanh toán
  const renderPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PAID':
        return <Badge color="green" text="Đã thanh toán" />;
      case 'PENDING':
        return <Badge color="orange" text="Chờ thanh toán" />;
      case 'FAILED':
        return <Badge color="red" text="Thất bại" />;
      default:
        return <Badge color="blue" text={paymentStatus} />;
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">Gói của tôi</h2>

        {packages.length === 0 ? (
          <div className="text-center">
            <GiftOutlined style={{ fontSize: 48, color: '#bdbdbd', marginBottom: 16 }} />
            <p className="text-lg text-gray-600 mb-4">Bạn chưa có gói nào.</p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/package')}
              className="rounded-lg"
            >
              Mua gói ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border-2 border-[#2563eb] rounded-2xl shadow-lg p-6 flex flex-col h-full hover:shadow-2xl transition-shadow duration-200"
                style={{ minHeight: 320 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <GiftOutlined style={{ fontSize: 32, color: '#2563eb' }} />
                  <h4 className="text-xl font-bold text-black">{pkg.packageInfo.name}</h4>
                </div>

                <div className="mb-2 flex items-center gap-2 text-black">
                  <Badge color="blue" />
                  <span className="font-semibold">Giá:</span>
                  <span className="font-bold text-lg">
                    {pkg.packageInfo.price.toLocaleString()} VNĐ
                  </span>
                </div>

                <div className="mb-2">{renderStatusBadge(pkg.status)}</div>
                <div className="mb-2">{renderPaymentBadge(pkg.paymentStatus)}</div>

                <div className="mb-2 text-black">
                  <span className="font-medium">Ngày mua: </span>
                  <span>{new Date(pkg.purchasedAt).toLocaleDateString()}</span>
                </div>

                <div className="mb-4 text-black">
                  <span className="font-medium">Ngày kích hoạt: </span>
                  <span>
                    {pkg.activationDate
                      ? new Date(pkg.activationDate).toLocaleDateString()
                      : <span className="text-gray-400">Chưa kích hoạt</span>}
                  </span>
                </div>

                {/* Nút kích hoạt nếu gói chưa ACTIVE */}
                {pkg.status !== 'ACTIVE' && (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleActivatePackage(pkg.id)}
                    className="mt-auto"
                  >
                    Kích hoạt ngay
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPackage;
