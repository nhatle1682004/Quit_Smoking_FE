import React, { useEffect, useState } from 'react';
import api from '../../configs/axios';
import { Button } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function CurrentPlanCard() {
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  const fetchActivePackage = async () => {
    try {
      const response = await api.get('/purchased-plan/active');
      setPlan(response.data);
    } catch (err) {
      setPlan(null);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchActivePackage();
  }, []);

  return (
    <div className="bg-white border-2 border-[#2563eb] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <GiftOutlined style={{ fontSize: 40, color: '#2563eb', marginBottom: 12 }} />
      {plan && plan.packageInfo ? (
        <>
          <div className="text-lg font-semibold text-black">
            Gói hiện tại đang hoạt động:
          </div>
          <div className="text-xl font-bold text-[#2563eb] mt-2">
            {plan.packageInfo.name}
          </div>
        </>
      ) : (
        <>
          <div className="text-lg font-semibold text-black mb-2">
            Bạn chưa có gói nào đang hoạt động
          </div>
          <Button
            type="primary"
            size="large"
            className="rounded-lg mt-2"
            onClick={() => navigate('/package')}
          >
            Mua gói ngay
          </Button>
        </>
      )}
    </div>
  );
}

export default CurrentPlanCard;
