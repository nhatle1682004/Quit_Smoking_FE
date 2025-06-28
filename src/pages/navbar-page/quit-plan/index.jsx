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
  // New state variables for plan selection
  const [planType, setPlanType] = useState(null); // 'free' or 'paid'
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPackageSelection, setShowPackageSelection] = useState(false);
  const [formData, setFormData] = useState({
    targetQuitDate: "",
    motivationReason: "",
    method: "TEMPLATE",
    startDate: new Date().toISOString().split("T")[0],
    goal: "",
    planType: "FREE", // Default to free
    packageType: null, // Will be set for paid plans
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

        // Include plan type information
        const planData = {
          ...formData,
          // Make sure planType is capitalized for API
          planType: formData.planType.toUpperCase(),
          // Only include packageType if it's a paid plan
          packageType:
            formData.planType === "PAID" ? formData.packageType : null,
        };

        const response = await api.post("/quit-plan", planData, config);
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
                  {submittedPlanData?.planType === "PAID" && (
                    <div className="flex justify-between border-b border-green-100 pb-2">
                      <span className="text-gray-600">Gói:</span>
                      <span className="font-medium">
                        {submittedPlanData?.packageType === "BASIC" && "Cơ Bản"}
                        {submittedPlanData?.packageType === "STANDARD" &&
                          "Tiêu Chuẩn"}
                        {submittedPlanData?.packageType === "PREMIUM" &&
                          "Cao Cấp"}
                      </span>
                    </div>
                  )}
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
                onClick={() => navigate("/tracking")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2"
              >
                <FiTrendingUp /> Theo dõi tiến trình hằng ngày
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

  // Plan type selection view (initial screen if no plan exists)
  if (!planType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Chọn loại kế hoạch bỏ thuốc
            </h1>
            <p className="text-lg text-gray-600">
              Hãy chọn loại kế hoạch phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Free plan option */}
            <div
              onClick={() => {
                setPlanType("free");
                setFormData((prev) => ({
                  ...prev,
                  planType: "FREE",
                  packageType: null,
                }));
              }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-blue-700 mb-4">
                  Miễn phí
                </h3>
                <div className="bg-white rounded-lg p-4 mb-6">
                  <p className="text-3xl font-bold text-blue-600 mb-2">0 ₫</p>
                  <p className="text-gray-500">Không mất phí</p>
                </div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tự lên kế hoạch bỏ thuốc</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Theo dõi tiến độ cơ bản</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Nhật ký cai thuốc</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Paid plan option */}
            <div
              onClick={() => {
                setPlanType("paid");
                setShowPackageSelection(true);
              }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl cursor-pointer border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-green-700 mb-4">
                  Trả phí
                </h3>
                <div className="bg-white rounded-lg p-4 mb-6">
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    Từ 99.000 ₫
                  </p>
                  <p className="text-gray-500">Theo gói</p>
                </div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Kế hoạch bỏ thuốc được cá nhân hóa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tư vấn và hỗ trợ chuyên sâu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Công cụ và tài nguyên cao cấp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Cộng đồng hỗ trợ</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {planHistory.length > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowHistory(true)}
                className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 mx-auto"
              >
                <FiClock size={16} /> Xem lịch sử kế hoạch bỏ thuốc
              </button>
            </div>
          )}
        </div>
        {showHistory && <HistoryModal />}
      </div>
    );
  }

  // Package selection view for paid plans
  if (planType === "paid" && showPackageSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <button
              onClick={() => {
                setPlanType(null);
                setShowPackageSelection(false);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              ← Quay lại
            </button>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Chọn gói phù hợp với bạn
            </h1>
            <p className="text-lg text-gray-600">
              Dựa trên mức độ hút thuốc hiện tại của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Basic Package */}
            <div
              onClick={() => {
                setSelectedPackage("basic");
                setFormData((prev) => ({
                  ...prev,
                  planType: "PAID",
                  packageType: "BASIC",
                }));
                setShowPackageSelection(false);
              }}
              className="border-2 border-blue-200 hover:border-blue-400 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="bg-blue-100 p-4 text-center">
                <h3 className="text-xl font-bold text-blue-700">Gói Cơ Bản</h3>
                <p className="text-gray-600 text-sm mt-1">Cho người hút nhẹ</p>
              </div>
              <div className="p-6">
                <p className="text-center mb-4">
                  <span className="text-3xl font-bold text-gray-800">
                    99.000 ₫
                  </span>
                  <span className="text-gray-500 text-sm">/tháng</span>
                </p>
                <div className="bg-blue-50 p-3 rounded-lg mb-4 text-center">
                  <p className="font-medium text-blue-700">
                    Phù hợp cho người hút
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    ≤ 10 điếu/ngày
                  </p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Kế hoạch giảm nhẹ nhàng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Công cụ theo dõi tiến độ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tài liệu hỗ trợ</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Standard Package */}
            <div
              onClick={() => {
                setSelectedPackage("standard");
                setFormData((prev) => ({
                  ...prev,
                  planType: "PAID",
                  packageType: "STANDARD",
                }));
                setShowPackageSelection(false);
              }}
              className="border-2 border-green-300 hover:border-green-500 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer transform scale-105"
            >
              <div className="bg-green-500 p-4 text-center">
                <h3 className="text-xl font-bold text-white">Gói Tiêu Chuẩn</h3>
                <p className="text-green-50 text-sm mt-1">
                  Cho người hút vừa phải
                </p>
                <div className="bg-white text-green-600 font-bold py-1 px-3 rounded-full text-xs inline-block mt-2">
                  PHỔ BIẾN NHẤT
                </div>
              </div>
              <div className="p-6">
                <p className="text-center mb-4">
                  <span className="text-3xl font-bold text-gray-800">
                    199.000 ₫
                  </span>
                  <span className="text-gray-500 text-sm">/tháng</span>
                </p>
                <div className="bg-green-50 p-3 rounded-lg mb-4 text-center">
                  <p className="font-medium text-green-700">
                    Phù hợp cho người hút
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    10-20 điếu/ngày
                  </p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tất cả tính năng của gói Cơ Bản</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Hỗ trợ cá nhân qua chat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Công cụ đối phó cơn thèm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Nhắc nhở và động viên</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Package */}
            <div
              onClick={() => {
                setSelectedPackage("premium");
                setFormData((prev) => ({
                  ...prev,
                  planType: "PAID",
                  packageType: "PREMIUM",
                }));
                setShowPackageSelection(false);
              }}
              className="border-2 border-purple-200 hover:border-purple-400 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="bg-purple-100 p-4 text-center">
                <h3 className="text-xl font-bold text-purple-700">
                  Gói Cao Cấp
                </h3>
                <p className="text-gray-600 text-sm mt-1">Cho người hút nặng</p>
              </div>
              <div className="p-6">
                <p className="text-center mb-4">
                  <span className="text-3xl font-bold text-gray-800">
                    299.000 ₫
                  </span>
                  <span className="text-gray-500 text-sm">/tháng</span>
                </p>
                <div className="bg-purple-50 p-3 rounded-lg mb-4 text-center">
                  <p className="font-medium text-purple-700">
                    Phù hợp cho người hút
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    > 20 điếu/ngày
                  </p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tất cả tính năng của gói Tiêu Chuẩn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tư vấn 1:1 với chuyên gia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Kế hoạch chi tiết từng ngày</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Hỗ trợ khẩn cấp 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Báo cáo tiến độ nâng cao</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form tạo kế hoạch mới (chỉ hiển thị khi không có kế hoạch active)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <button
            onClick={() => {
              setPlanType(null);
              setShowPackageSelection(false);
              setSelectedPackage(null);
            }}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Quay lại lựa chọn gói
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {planType === "free"
              ? "Tạo kế hoạch bỏ thuốc"
              : `Kế hoạch bỏ thuốc ${
                  selectedPackage === "basic"
                    ? "Cơ Bản"
                    : selectedPackage === "standard"
                    ? "Tiêu Chuẩn"
                    : "Cao Cấp"
                }`}
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

        {planType === "paid" && (
          <div
            className={`mb-8 p-4 rounded-xl ${
              selectedPackage === "basic"
                ? "bg-blue-50 border-l-4 border-blue-500"
                : selectedPackage === "standard"
                ? "bg-green-50 border-l-4 border-green-500"
                : "bg-purple-50 border-l-4 border-purple-500"
            }`}
          >
            <h3
              className={`text-lg font-medium mb-2 ${
                selectedPackage === "basic"
                  ? "text-blue-700"
                  : selectedPackage === "standard"
                  ? "text-green-700"
                  : "text-purple-700"
              }`}
            >
              {selectedPackage === "basic"
                ? "Gói Cơ Bản"
                : selectedPackage === "standard"
                ? "Gói Tiêu Chuẩn"
                : "Gói Cao Cấp"}
            </h3>
            <p className="text-gray-600">
              {selectedPackage === "basic"
                ? "Kế hoạch này phù hợp cho người hút dưới 10 điếu mỗi ngày."
                : selectedPackage === "standard"
                ? "Kế hoạch này được thiết kế cho người hút từ 10-20 điếu mỗi ngày."
                : "Kế hoạch chuyên sâu dành cho người hút trên 20 điếu mỗi ngày."}
            </p>
          </div>
        )}

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
