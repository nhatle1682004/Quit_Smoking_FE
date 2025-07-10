import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import api from '../../../configs/axios';
import { useNavigate } from 'react-router-dom';


function Plan() {
  const [plan,setPlan]= useState(null);
  const navigate = useNavigate();

  const fetchPlan = async () => {
    try {   
      const response = await api.get('/quit-plan/active');
      setPlan(response.data);
      toast.success("Lấy kế hoạch thành công"); 
    } catch (error) {
      console.error("Error fetching plan history:", error);
      setPlan(null);
    }
  };
 useEffect(() => {
    fetchPlan();
  }, []);  

  // Nếu chưa có kế hoạch
  if (!plan || !plan.createdAt) {
    return (
      <div className="bg-white p-8 rounded-lg shadow max-w-xl mx-auto my-10 text-black text-center flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-red-500">Bạn chưa có kế hoạch nào.</h2>
        <p className="text-base text-gray-700">Bạn đã mua gói và kích hoạt chưa?</p>
        <div className="flex gap-4 mt-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            onClick={() => navigate('/package')}
          >
            Mua gói ngay
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            onClick={() => navigate('/user-package')}
          >
            Kích hoạt gói ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto mt-6 text-black">
      <h2 className="text-xl font-bold mb-4">Thông tin Kế Hoạch Cai Thuốc</h2>
  
      <ul className="space-y-2 text-sm">
        <li>
          <strong>Số điếu mỗi ngày:</strong> {plan.cigarettesPerDay}
        </li>
        <li>
          <strong>Thời gian hút đầu tiên:</strong> {plan.firstSmokeTime}
        </li>
        <li>
          <strong>Lý do bắt đầu hút:</strong> {plan.reasonForStarting}
        </li>
        <li>
          <strong>Lý do muốn cai thuốc:</strong> {plan.quitReason}
        </li>
        <li>
          <strong>Thang đo sẵn sàng:</strong> {plan.readinessScale}/10
        </li>
        <li>
          <strong>Tình trạng sức khỏe:</strong> {plan.hasHealthIssues ? 'Có' : 'Không'}
        </li>
        <li>
          <strong>Đã từng thử bỏ thuốc chưa:</strong> {plan.hasTriedToQuit ? 'Có' : 'Chưa'}
        </li>
        <li>
          <strong>Giá 1 điếu:</strong> {plan.pricePerCigarette?.toLocaleString()} VNĐ
        </li>
        <li>
          <strong>Số điếu 1 bao:</strong> {plan.cigarettesPerPack}
        </li>
        <li>
          <strong>Cân nặng:</strong> {plan.weightKg} kg
        </li>
        <li>
          <strong>Độ nghiện:</strong> {plan.addictionLevelLabel || plan.addictionLevel}
        </li>
        <li>
          <strong>Ngày tạo kế hoạch:</strong> {new Date(plan.createdAt).toLocaleDateString()}
        </li>
      </ul>
    </div>
  );
  
}

export default Plan;