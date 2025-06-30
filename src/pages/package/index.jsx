import React from 'react';
import { Typography } from 'antd';
import PremiumPlansSection from '../../components/modal-package';

const { Title, Paragraph } = Typography;

const PackagePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-blue-600 mb-4">
            🎯 Chọn Gói Dịch Vụ Phù Hợp Với Bạn
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp nhiều gói dịch vụ khác nhau để hỗ trợ bạn trong hành trình cai thuốc. 
            Từ gói miễn phí cơ bản đến gói Premium với tư vấn chuyên sâu 1:1.
          </Paragraph>
        </div>

        {/* Component gói dịch vụ */}
        <PremiumPlansSection />

      </div>
    </div>
  );
};

export default PackagePage;