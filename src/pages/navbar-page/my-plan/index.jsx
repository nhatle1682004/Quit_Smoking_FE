import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function Plan() {
  const [plan, setPlan] = useState(null); // quit-plan thường
  const [coachPlan, setCoachPlan] = useState(null); // purchased-plan loại coach
  const [freePlan, setFreePlan] = useState(null); // kế hoạch free
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm này luôn fetch cả hai loại, chỉ khi cả hai đều không có mới coi như chưa có gói nào
  const fetchPlan = async () => {
    setIsLoading(true);
    try {
      // 1. Thử lấy quit-plan (gói thường, có plan detail)
      let resPlan = null;
      try {
        const result = await api.get("/quit-plan/active");
        resPlan = result;
      } catch {
        /* ignore */
      }
      if (resPlan && resPlan.data && resPlan.data.createdAt) {
        setPlan(resPlan.data);
        setCoachPlan(null);
        setFreePlan(null);
      } else {
        // 2. Không có quit-plan, thử lấy gói coach đang active
        let resCoach = null;
        try {
          resCoach = await api.get("/purchased-plan/active");
        } catch {
          /* ignore */
        }
        // Phải check đủ trường, đặc biệt là packageInfo.coachSupport và status
        if (
          resCoach &&
          resCoach.data &&
          resCoach.data.status === "ACTIVE" &&
          (resCoach.data.packageInfo?.coachSupport === true ||
            resCoach.data.packageInfo?.coachSupport === 1 ||
            resCoach.data.packageInfo?.coachSupport === "1")
        ) {
          setPlan(null);
          setCoachPlan(resCoach.data);
          setFreePlan(null);
        } else {
          // 3. Không có quit-plan và không có coach plan, thử lấy free-plan
          let resFree = null;
          try {
            resFree = await api.get("/free-plan/active");
          } catch {
            /* ignore */
          }
          if (resFree && resFree.data && resFree.data.startDate) {
            setPlan(null);
            setCoachPlan(null);
            setFreePlan(resFree.data);
          } else {
            setPlan(null);
            setCoachPlan(null);
            setFreePlan(null);
          }
        }
      }
    } catch {
      setPlan(null);
      setCoachPlan(null);
      setFreePlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  // Hủy gói coach (purchased-plan)
  const handleDeleteCoachPlan = async (planId) => {
    try {
      await api.put(`/purchased-plan/${planId}/cancel`);
      toast.success("Hủy gói coach thành công");
      setCoachPlan(null);
    } catch {
      toast.error("Hủy gói coach thất bại");
    }
  };

  // Hủy quit-plan (gói thường)
  const handleDeletePlan = async (planId) => {
    try {
      await api.put(`/quit-plan/${planId}/cancel`);
      toast.success("Hủy kế hoạch thành công");
      setPlan(null);
    } catch {
      toast.error("Hủy kế hoạch thất bại");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow max-w-xl mx-auto my-10 text-center">
        <Spin size="large" />
        <div className="mt-4 text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  // CASE 1: Có kế hoạch quit-plan thường
  if (plan && plan.createdAt) {
    let parsedPlanDetail = [];
    try {
      parsedPlanDetail = JSON.parse(plan.planDetail);
    } catch {
      parsedPlanDetail = [];
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto mt-6 text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Thông tin Kế Hoạch Cai Thuốc
        </h2>
        <div className="mb-6 space-y-2 text-sm">
          <p>
            <strong>Gói:</strong> {plan.packageInfo?.name}
          </p>
          <p>
            <strong>Ngày bắt đầu:</strong>{" "}
            {new Date(plan.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Ngày mục tiêu:</strong>{" "}
            {new Date(plan.targetQuitDate).toLocaleDateString()}
          </p>
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
                  <td className="px-4 py-2 border text-center">
                    {item.cigarettes}
                  </td>
                  <td className="px-4 py-2 border">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-8">
          <Popconfirm
            title={
              <div className="text-base">
                <span className="font-semibold text-red-600">
                  Bạn có chắc chắn muốn hủy kế hoạch?
                </span>
                <div className="mt-2 text-gray-700">
                  Sau khi hủy, bạn <b>không thể sử dụng các chức năng hỗ trợ</b>{" "}
                  nữa.
                  <br />
                  Để tiếp tục sử dụng, bạn cần <b>mua lại gói kế hoạch</b>.
                </div>
              </div>
            }
            onConfirm={() => handleDeletePlan(plan.id)}
            okText="Đồng ý hủy"
            cancelText="Giữ lại"
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
  }

  // CASE 1.5: Có kế hoạch free-plan
  if (freePlan && freePlan.startDate) {
    const handleCancelFreePlan = async () => {
      try {
        await api.put("/free-plan/cancel");
        setFreePlan(null);
        toast.success("Hủy kế hoạch miễn phí thành công");
      } catch {
        toast.error("Hủy kế hoạch miễn phí thất bại");
      }
    };
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-blue-100 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 tracking-wide uppercase drop-shadow-sm">
            Thông tin Kế Hoạch Cai Thuốc Miễn Phí
          </h2>
          <div className="mb-8 space-y-4 text-base text-gray-700">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-gray-600">Ngày bắt đầu:</span>
              <span className="text-blue-600 font-medium">
                {new Date(freePlan.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-gray-600">
                Ngày kết thúc:
              </span>
              <span className="text-blue-600 font-medium">
                {new Date(freePlan.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-start gap-2 pt-2">
              <span className="font-semibold text-gray-600">
                Lý do thúc đẩy:
              </span>
              <span className="text-gray-800 italic">
                {freePlan.motivationReason}
              </span>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Popconfirm
              title={
                <div className="text-base">
                  <span className="font-semibold text-red-600">
                    Bạn có chắc chắn muốn hủy kế hoạch miễn phí?
                  </span>
                </div>
              }
              onConfirm={handleCancelFreePlan}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition border-2 border-red-500 flex items-center gap-2">
                Hủy kế hoạch
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2: Có gói coach active
  if (
    coachPlan &&
    coachPlan.status === "ACTIVE" &&
    (coachPlan.packageInfo?.coachSupport === true ||
      coachPlan.packageInfo?.coachSupport === 1 ||
      coachPlan.packageInfo?.coachSupport === "1")
  ) {
    return (
      <div className="bg-white p-8 rounded-lg shadow max-w-xl mx-auto my-10 text-black text-center flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-indigo-700 mb-2">
          GÓI HUẤN LUYỆN VIÊN (COACH)
        </h2>
        <div className="mb-2">
          <b>Gói:</b> {coachPlan.packageInfo?.name} <br />
          <b>Ngày kích hoạt:</b>{" "}
          {coachPlan.activationDate
            ? new Date(coachPlan.activationDate).toLocaleDateString()
            : "Chưa kích hoạt"}
        </div>
        <p className="text-base text-gray-800 mb-1">
          Bạn đang tham gia gói <b>Coach</b>. Hằng ngày, hãy xem{" "}
          <b>Nhiệm vụ hôm nay</b> được giao từ huấn luyện viên!
        </p>
        <p className="text-base text-gray-600">
          (Các nhiệm vụ hằng ngày sẽ được coach giao và xem tại mục{" "}
          <b>Nhiệm vụ mỗi ngày</b>)
        </p>
        <div className="flex justify-center mt-4">
          <Popconfirm
            title={
              <span>
                Bạn có chắc chắn muốn{" "}
                <span className="text-red-600 font-bold">hủy gói coach</span>?
              </span>
            }
            onConfirm={() => handleDeleteCoachPlan(coachPlan.id)}
          >
            <Button
              danger
              size="large"
              className="flex items-center gap-2 font-semibold border-2 border-red-500 hover:bg-red-600 hover:text-white transition"
              icon={<ExclamationCircleOutlined />}
            >
              Hủy gói coach
            </Button>
          </Popconfirm>
        </div>
      </div>
    );
  }

  // CASE 3: Không có kế hoạch nào
  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-xl mx-auto my-10 text-black text-center flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold text-red-500">
        Bạn chưa có kế hoạch nào.
      </h2>
      <p className="text-base text-gray-700">
        Bạn đã mua gói và kích hoạt chưa?
      </p>
      <div className="flex gap-4 mt-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          onClick={() => navigate("/package")}
        >
          Mua gói ngay
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          onClick={() => navigate("/user-package")}
        >
          Kích hoạt gói ngay
        </button>
      </div>
    </div>
  );
}

export default Plan;
