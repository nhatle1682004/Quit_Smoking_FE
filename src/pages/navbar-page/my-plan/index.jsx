import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../configs/axios';
import { useNavigate } from 'react-router-dom';
import { Button, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

function Plan() {
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  const fetchPlan = async () => {
    try {
      const response = await api.get('/quit-plan/active');
      setPlan(response.data);
      toast.success('Lấy kế hoạch thành công');
    } catch (error) {
      console.error('Lỗi khi lấy kế hoạch:', error);
      setPlan(null);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleDeletePlan = async (planId) => {
    try {
      const response = await api.put(`/quit-plan/${planId}/cancel`);
      toast.success("Xóa kế hoạch thành công");
      setPlan(response.data);
    } catch (error) {
      toast.error("Xóa kế hoạch thất bại");
      console.log(error);
    }
  }


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

  // Parse planDetail
  let parsedPlanDetail = [];
  try {
    parsedPlanDetail = JSON.parse(plan.planDetail);
  } catch {
    parsedPlanDetail = [];
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto mt-6 text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">Thông tin Kế Hoạch Cai Thuốc</h2>

      <div className="mb-6 space-y-2 text-sm">
        <p><strong>Gói:</strong> {plan.packageInfo?.name}</p>
        <p><strong>Ngày bắt đầu:</strong> {new Date(plan.startDate).toLocaleDateString()}</p>
        <p><strong>Ngày mục tiêu:</strong> {new Date(plan.targetQuitDate).toLocaleDateString()}</p>
        <p><strong>Trạng thái:</strong> {plan.status}</p>
        <p><strong>Phương pháp:</strong> {plan.method}</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Chi tiết từng ngày:</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Ngày</th>
              <th className="px-4 py-2 border">Số điếu</th>
              <th className="px-4 py-2 border">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {parsedPlanDetail.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 border">Ngày {item.day}</td>
                <td className="px-4 py-2 border text-center">{item.cigarettes}</td>
                <td className="px-4 py-2 border">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-8">
        <Popconfirm
          title={
            <span>
              <ExclamationCircleOutlined className="text-red-500 mr-2" />
              Bạn có chắc chắn muốn <span className="text-red-600 font-bold">hủy kế hoạch</span>?
            </span>
          }
          description="Sau khi hủy, bạn sẽ không thể tạo lại kế hoạch mới với gói hiện tại."
          okText="Đồng ý"
          cancelText="Không"
          okButtonProps={{ danger: true, className: 'bg-red-600 hover:bg-red-700' }}
          onConfirm={() => handleDeletePlan(plan.id)}
        >
          <Button
            danger
            size="large"
            className="flex items-center gap-2 font-semibold border-2 border-red-500 hover:bg-red-600 hover:text-white transition"
            icon={<ExclamationCircleOutlined />}
          >
            Hủy kế hoạch
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default Plan;
