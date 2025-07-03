import { Button, Card, Col, Row, Tag } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function PackagePage() {
  const [initialPackages, setInitialPackages] = useState([]);

  const fetchPackages = async () => {
        try{
          const response = await axios.get('https://685b9c6789952852c2da2b80.mockapi.io/package');
          console.log(response.data);
          setInitialPackages(response.data); 
        }catch(err){
          console.log(err);
          toast.error("Lỗi khi mua gói");
        }
  }
  useEffect(() => {
    fetchPackages();
  }, []);
  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Danh sách gói hỗ trợ</h2>

      <Row gutter={[16, 16]}>
        {initialPackages
        .filter((pkg) => pkg.isActive)
        .map((pkg) => (
          <Col key={pkg.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={pkg.name}
              bordered
              extra={
                <Tag color={pkg.isActive ? 'green' : 'red'}>
                  {/* Không có nội dung */}
                </Tag>
              }
              style={{ height: "100%" }}
            >
              <p><strong>Mô tả:</strong></p>
              <ul style={{ paddingLeft: 20 }}>
                {(pkg.description ? pkg.description.split(/;|\n/) : []).map((item, idx) => (
                  <li key={idx} style={{ listStyle: "none", marginBottom: 4 }}>
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
                disabled={!pkg.isActive}
                onClick={() => {
                  toast.success(`Bạn đã chọn gói: ${pkg.name}`);
                }}
              >
                Mua ngay
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default PackagePage;