import { Button, Card, Col, Row, Divider, Badge } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../configs/axios';
import { GiftOutlined, CheckCircleOutlined } from '@ant-design/icons';

function PackagePage() {
  const [initialPackages, setInitialPackages] = useState([]);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      const response = await api.get('/package');
      setInitialPackages(response.data);
      toast.success("Lấy dữ liệu thành công");
    } catch {
      toast.error("Lấy dữ liệu thất bại");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (days) => {
    return `${days} ngày`;
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-black">
          🎁 Danh sách gói hỗ trợ
        </h2>
        <Row gutter={[32, 32]} justify="center">
          {initialPackages.map((pkg) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={pkg.id}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Card
                className="rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-shadow duration-200 h-full flex flex-col"
                style={{
                  minHeight: 420,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'stretch',
                  background: 'white',
                  border: '2px solid #2563eb',
                  flex: 1
                }}
                bodyStyle={{
                  padding: 24,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}
                hoverable
                title={
                  <div className="flex items-center gap-2 text-black">
                    <GiftOutlined style={{ fontSize: 28, color: '#2563eb' }} />
                    <span className="text-xl font-bold text-black">{pkg.name}</span>
                  </div>
                }
              >
                <div style={{ minHeight: 40, marginBottom: 4, flex: 1 }}>
                  {pkg.description.split('\n').map((line, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 mb-2 text-black"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      <CheckCircleOutlined style={{ fontSize: 18, color: '#22c55e', marginTop: 3 }} />
                      <span className="text-black">{line}</span>
                    </div>
                  ))}
                </div>
                <Divider dashed style={{ margin: '8px 0' }} />
                <div className="mb-2 flex items-center gap-2 text-black">
                  <Badge color="blue" />
                  <span className="font-semibold text-black">Giá:</span>
                  <span className="font-bold text-black text-lg">{formatPrice(pkg.price)}</span>
                </div>
                <div className="mb-2 flex items-center gap-2 text-black">
                  <Badge color="purple" />
                  <span className="font-semibold text-black">Thời hạn:</span>
                  <span className="font-bold text-black">{formatDuration(pkg.duration)}</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <Button
                    type="primary"
                    size="large"
                    className="w-full mt-4 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 border-0 font-bold"
                    style={{
                      background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                      color: '#fff'
                    }}
                    onClick={() => navigate('/payment-result')}
                  >
                    Mua ngay
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default PackagePage;
