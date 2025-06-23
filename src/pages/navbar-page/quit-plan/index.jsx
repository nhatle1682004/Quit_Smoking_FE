import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTarget,
  FiCalendar,
  FiHeart,
  FiFlag,
  FiPackage,
  FiTrendingUp,
  FiSmile,
  FiClock,
  FiList,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import api from "../../../configs/axios";
import {
  Spin,
  Modal,
  Button,
  Empty,
  Timeline,
  Tag,
  Popconfirm,
  message,
} from "antd";

const QuitPlanForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [submittedPlanData, setSubmittedPlanData] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    targetQuitDate: "",
    motivationReason: "",
    method: "TEMPLATE",
    startDate: new Date().toISOString().split("T")[0],
    goal: "",
  });
  const [errors, setErrors] = useState({});
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Add this function to handle plan deletion
  const handleDeletePlan = async (id) => {
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Bạn chưa đăng nhập!");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/quit-plan/${id}`, config);

      message.success("Kế hoạch bỏ thuốc đã được xóa thành công!");

      // Reset state to show the form
      setSubmitted(false);
      setHasActivePlan(false);
      setSubmittedPlanData(null);

      // Refresh plan history
      await fetchQuitPlanHistory();
    } catch (error) {
      console.error("Error deleting quit plan:", error);
      message.error("Có lỗi xảy ra khi xóa kế hoạch bỏ thuốc.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Kiểm tra xem người dùng đã có kế hoạch bỏ thuốc hay chưa
  useEffect(() => {
    const checkExistingPlan = async () => {
      try {
        setInitialLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setInitialLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
          // Check for any active plan
          const planResponse = await api.get("/quit-plan/active", config);

          if (planResponse.data) {
            // If there is any plan data, set it and show the view mode
            const planData = planResponse.data;
            setSubmittedPlanData(planData);

            // Set active flag based on status
            const isActivePlan = planData.status === "ACTIVE";
            setHasActivePlan(isActivePlan);

            // Always show the submitted view if there's an existing plan
            setSubmitted(true);

            // If it's an active plan, also fetch initial condition data
            if (isActivePlan) {
              try {
                const initialResponse = await api.get(
                  "/initial-condition",
                  config
                );
                setInitialData(initialResponse.data);
              } catch (err) {
                console.log("Could not fetch initial condition data");
              }
            }
          } else {
            // No plan exists, show form
            setSubmitted(false);
            setHasActivePlan(false);
            await fetchQuitPlanHistory();
          }
        } catch (planError) {
          // API error - likely no plan exists
          console.log("No active quit plan found");
          setSubmitted(false);
          setHasActivePlan(false);
          await fetchQuitPlanHistory();
        }
      } catch (error) {
        console.error("Error checking quit plan status:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    checkExistingPlan();
  }, []);

  // Lấy lịch sử kế hoạch
  const fetchQuitPlanHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get("/initial-condition", config);
      if (response.data && Array.isArray(response.data)) {
        setPlanHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching quit plan history:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.targetQuitDate) {
      newErrors.targetQuitDate = "Vui lòng chọn ngày mục tiêu bỏ thuốc";
    }
    if (!formData.motivationReason) {
      newErrors.motivationReason = "Vui lòng nhập lý do động lực";
    }
    if (!formData.goal) {
      newErrors.goal = "Vui lòng nhập mục tiêu của bạn";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchInitialCondition = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get("/initial-condition", config);
      return response.data;
    } catch (error) {
      console.error("Error fetching initial condition:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);

      try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await api.post("/quit-plan", formData, config);
        setSubmittedPlanData(response.data);
        setHasActivePlan(true);

        // Lấy thông tin initial condition
        const initialCondition = await fetchInitialCondition();
        setInitialData(initialCondition);

        setSubmitted(true);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert("❌ Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
        } else {
          alert("❌ Có lỗi khi tạo kế hoạch bỏ thuốc.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Modal hiển thị lịch sử
  const HistoryModal = () => (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FiClock className="text-blue-500" />
          <span>Lịch sử kế hoạch bỏ thuốc</span>
        </div>
      }
      open={showHistory}
      onCancel={() => setShowHistory(false)}
      footer={[
        <Button key="close" onClick={() => setShowHistory(false)}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      {planHistory.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          <Timeline
            items={planHistory.map((plan, index) => ({
              dot: <FiCalendar className="text-blue-500" />,
              color: index === 0 ? "green" : "blue",
              children: (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">
                      Kế hoạch #{planHistory.length - index}
                    </h4>
                    <Tag color={index === 0 ? "green" : "default"}>
                      {index === 0 ? "Gần đây nhất" : "Cũ"}
                    </Tag>
                  </div>
                  <p>
                    <span className="font-medium">Bắt đầu:</span>{" "}
                    {formatDate(plan.startDate)}
                  </p>
                  <p>
                    <span className="font-medium">Mục tiêu bỏ thuốc:</span>{" "}
                    {formatDate(plan.targetQuitDate)}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Lý do:</span>{" "}
                      {plan.motivationReason || "Không có"}
                    </div>
                    <div>
                      <span className="font-medium">Mục tiêu:</span>{" "}
                      {plan.goal || "Không có"}
                    </div>
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      ) : (
        <Empty description="Chưa có lịch sử kế hoạch bỏ thuốc" />
      )}
    </Modal>
  );

  // Hiển thị loading khi đang kiểm tra
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin kế hoạch..." />
      </div>
    );
  }

  // Phần hiển thị thông tin tổng hợp (khi submitted = true)
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                {hasActivePlan
                  ? "🎉 Kế hoạch bỏ thuốc đang hoạt động"
                  : "🎉 Kế hoạch bỏ thuốc của bạn"}
              </h2>
              <p className="text-gray-700">
                Dưới đây là tổng hợp thông tin bạn đã cung cấp cho hành trình bỏ
                thuốc.
              </p>

              {hasActivePlan && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 text-left">
                  <p className="text-blue-700 flex items-center gap-2 font-medium">
                    <FiAlertTriangle />
                    {hasActivePlan
                      ? "Kế hoạch này đang hoạt động. Bạn chỉ có thể xem thông tin, không thể chỉnh sửa."
                      : "Bạn đã có kế hoạch bỏ thuốc. Để tạo kế hoạch mới, vui lòng xóa kế hoạch hiện tại."}
                  </p>
                  <p className="text-blue-700 mt-2">
                    Để tạo kế hoạch mới, bạn cần xóa kế hoạch hiện tại bằng nút
                    "Xóa kế hoạch này" bên dưới.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phần 1: Thông tin khai báo sức khỏe */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <FiPackage /> Thông tin hút thuốc
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-600">Số điếu mỗi ngày:</span>
                    <span className="font-medium">
                      {initialData?.cigarettesPerDay || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-600">
                      Thời điểm hút điếu đầu:
                    </span>
                    <span className="font-medium">
                      {initialData?.firstSmokeTime || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-600">Lý do bỏ thuốc:</span>
                    <span className="font-medium">
                      {initialData?.quitReason || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-600">Ý định bỏ thuốc từ:</span>
                    <span className="font-medium">
                      {formatDate(initialData?.intentionSince)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-600">Mức độ sẵn sàng:</span>
                    <span className="font-medium">
                      {initialData?.readinessScale || "N/A"}/10
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-blue-100 pb-2">
                    <span className="text-gray-600">Cảm xúc:</span>
                    <span className="font-medium">
                      {initialData?.emotion || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phần 2: Thông tin kế hoạch bỏ thuốc */}
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                  <FiCalendar /> Kế hoạch bỏ thuốc
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-green-100 pb-2">
                    <span className="text-gray-600">Ngày bắt đầu:</span>
                    <span className="font-medium">
                      {formatDate(submittedPlanData?.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-green-100 pb-2">
                    <span className="text-gray-600">
                      Ngày mục tiêu bỏ thuốc:
                    </span>
                    <span className="font-medium">
                      {formatDate(submittedPlanData?.targetQuitDate)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-green-100 pb-2">
                    <span className="text-gray-600">Phương pháp:</span>
                    <span className="font-medium">
                      {submittedPlanData?.method || "TEMPLATE"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần động lực và mục tiêu */}
            <div className="mt-6 space-y-6">
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">
                  <FiHeart /> Động lực của bạn
                </h3>
                <p className="text-gray-700 italic">
                  "{submittedPlanData?.motivationReason || "N/A"}"
                </p>
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <FiFlag /> Mục tiêu của bạn
                </h3>
                <p className="text-gray-700 italic">
                  "{submittedPlanData?.goal || "N/A"}"
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Đi đến bảng điều khiển
              </button>

              {/* Nếu có lịch sử, hiển thị nút xem lịch sử */}
              {planHistory.length > 0 && (
                <button
                  onClick={() => setShowHistory(true)}
                  className="bg-indigo-100 text-indigo-700 px-8 py-3 rounded-lg hover:bg-indigo-200 transition shadow-md flex items-center gap-2"
                >
                  <FiClock /> Xem lịch sử kế hoạch
                </button>
              )}

              {/* Thay nút tạo mới bằng nút xóa khi có kế hoạch active */}
              {hasActivePlan && (
                <Popconfirm
                  title="Xóa kế hoạch bỏ thuốc"
                  description="Bạn có chắc chắn muốn xóa kế hoạch bỏ thuốc này? Hành động này không thể hoàn tác."
                  onConfirm={() => handleDeletePlan(submittedPlanData?.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  placement="topRight"
                  okButtonProps={{
                    danger: true,
                    loading: deleteLoading,
                  }}
                >
                  <button className="bg-red-100 text-red-700 px-8 py-3 rounded-lg hover:bg-red-200 transition shadow-md flex items-center gap-2">
                    <FiTrash2 /> Xóa kế hoạch này
                  </button>
                </Popconfirm>
              )}
            </div>
          </div>
        </div>
        {showHistory && <HistoryModal />}
      </div>
    );
  }

  // Form tạo kế hoạch mới (chỉ hiển thị khi không có kế hoạch active)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Tạo kế hoạch bỏ thuốc
          </h1>

          {planHistory.length > 0 && (
            <Button
              type="default"
              icon={<FiList />}
              onClick={() => setShowHistory(true)}
              className="flex items-center"
            >
              Xem lịch sử
            </Button>
          )}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-sm mb-8">
          <p className="text-lg text-gray-700">
            Đặt ra một kế hoạch rõ ràng sẽ tăng khả năng thành công của bạn lên
            gấp đôi. Hãy điền thông tin bên dưới!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <FiCalendar className="text-blue-500" /> Ngày bắt đầu kế hoạch
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm mt-1"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <FiTarget className="text-blue-500" /> Ngày mục tiêu bỏ thuốc
              </label>
              <input
                type="date"
                name="targetQuitDate"
                value={formData.targetQuitDate}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm mt-1"
              />
              {errors.targetQuitDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.targetQuitDate}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <FiHeart className="text-blue-500" /> Lý do động lực
              </label>
              <textarea
                name="motivationReason"
                value={formData.motivationReason}
                onChange={handleChange}
                rows="3"
                placeholder="Ví dụ: Vì sức khỏe của bản thân và gia đình, tôi quyết tâm bỏ thuốc lá..."
                className="w-full rounded-md border-gray-300 shadow-sm mt-1"
              />
              {errors.motivationReason && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.motivationReason}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <FiFlag className="text-blue-500" /> Mục tiêu của bạn
              </label>
              <textarea
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows="3"
                placeholder="Ví dụ: Bỏ hẳn thuốc lá trong vòng 3 tháng, tiết kiệm được 5 triệu đồng..."
                className="w-full rounded-md border-gray-300 shadow-sm mt-1"
              />
              {errors.goal && (
                <p className="text-red-500 text-sm mt-1">{errors.goal}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white ${
                loading
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Đang tạo..." : "Tạo kế hoạch"}
            </button>
          </div>
        </form>
      </div>
      {showHistory && <HistoryModal />}
    </div>
  );
};

export default QuitPlanForm;
