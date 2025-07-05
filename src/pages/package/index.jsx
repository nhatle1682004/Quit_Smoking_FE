import { Button, Card, Col, Row, Tag } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PackagePage() {
  const [initialPackages, setInitialPackages] = useState([]);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      const response = await axios.get('https://685b9c6789952852c2da2b80.mockapi.io/package');
      console.log(response.data);
      setInitialPackages(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi mua gói");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="p-6 bg-white"> {/* Đổi màu nền thành trắng */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-center">Danh sách gói hỗ trợ</h2>
      </div>

      <Row gutter={[16, 16]}>
        {initialPackages
          .filter((pkg) => pkg.isActive)
          .map((pkg) => (
            <Col key={pkg.id} xs={24} sm={12} md={8} lg={6}>
              <Card
              
                className="  shadow-lg rounded-lg border-0 transition-transform transform hover:scale-105"
                title={
                  <div>
                  <span className={pkg.name === "Basic" ? "line-through text-gray-500" : ""}>
                    {pkg.name}
                  </span>
                  {pkg.name === "Basic" && (
                       <div className="border-b border-black w-1/2 mx-auto mt-1" />
                      )}
                  </div>
                }
                
                extra={
                  <Tag color={pkg.isActive ? 'green' : 'red'}>
                    
                  </Tag>
                }
                style={{ height: "100%" }}
              >
                <p className="font-semibold">Mô tả:</p>
                <ul className="pl-5">
                  {(pkg.description ? pkg.description.split(/;|\n/) : []).map((item, idx) => (
                    <li key={idx} className="list-none mb-2">
                      <span role="img" aria-label="tick">✅</span> {item.trim()}
                    </li>
                  ))}
                </ul>
                <p><strong>Thời gian:</strong> {pkg.durationInDays} ngày</p>
                <p><strong>Giá:</strong> {pkg.price?.toLocaleString()} VNĐ</p>
                <p><strong>Cấp độ:</strong> {pkg.level}</p>
                <Button 
                  type="primary"
                  block
                  className='mt-4'
                  disabled={!pkg.isActive}
                  onClick={() => {
                    toast.success(`Bạn đã chọn gói: ${pkg.name}`);
                    navigate('/payment');
                  }}
                >
                  Mua ngay
                </Button>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
}

export default PackagePage;
