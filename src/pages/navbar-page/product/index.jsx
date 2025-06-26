import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiCalendar,
  FiTrendingUp,
  FiHeart,
  FiEdit,
  FiArrowRight,
} from "react-icons/fi";
import axios from "axios";
import { Alert, Spin, Modal, Button } from "antd";
import api from "./../../../configs/axios";
import { useNavigate } from "react-router-dom";

const QuoteSlider = () => {
  const quotes = [
    "Mỗi ngày không hút thuốc là một chiến thắng đáng ăn mừng",
    "Lá phổi bạn đang khỏe dần theo từng hơi thở sạch",
    "Bạn không từ bỏ gì cả, bạn đang đạt được mọi thứ",
    "Những bước nhỏ tạo nên thay đổi lớn",
  ];
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-sm">
      <p className="text-lg text-gray-700 italic animate-fade-in">
        {quotes[currentQuote]}
      </p>
    </div>
  );
};

const ProgressBar = ({ currentStep }) => (
  <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
    <div
      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
      style={{ width: `${(currentStep / 3) * 100}%` }}
    ></div>
  </div>
);

const ProductPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [formData, setFormData] = useState({
    cigarettesPerDay: "",
    firstSmokeTime: "",
    quitReason: "",
    intentionSince: "",
    readinessScale: "",
    emotion: "",
  });
  const [errors, setErrors] = useState({});
  const [existingData, setExistingData] = useState(null);
  const [showExistingDataModal, setShowExistingDataModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã khai báo chưa
  useEffect(() => {
    const checkInitialCondition = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCheckingStatus(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await api.get("/initial-condition", config);

        // Nếu có dữ liệu, lưu lại để hiển thị
        if (response.data) {
          setExistingData(response.data);
          setShowExistingDataModal(true);
        }
      } catch (error) {
        // Nếu không có dữ liệu hoặc có lỗi, cho phép người dùng khai báo mới
        setCheckingStatus(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkInitialCondition();
  }, [navigate]);

  // Hàm xử lý khi người dùng muốn chỉnh sửa thông tin đã khai báo
  const handleEditExistingData = () => {
    // Định dạng ngày từ chuỗi ISO thành YYYY-MM-DD một cách an toàn
    const formatISODate = (isoString) => {
      if (!isoString) return "";

      try {
        // Kiểm tra nếu là định dạng ngày tháng có dạng "dd/mm/yyyy"
        if (typeof isoString === "string" && isoString.includes("/")) {
          return formatDate(isoString);
        }

        // Nếu đã có định dạng yyyy-MM-dd
        if (
          typeof isoString === "string" &&
          isoString.match(/^\d{4}-\d{2}-\d{2}$/)
        ) {
          return isoString;
        }

        // Kiểm tra nếu là đối tượng Date
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
          console.warn("Invalid date format:", isoString);
          return "";
        }

        return date.toISOString().split("T")[0];
      } catch (error) {
        console.error("Error formatting date:", error);
        return "";
      }
    };

    console.log("Existing data before editing:", existingData); // Logging để debug

    // Đảm bảo readinessScale là số
    let readinessScaleValue = "";
    if (
      existingData.readinessScale !== null &&
      existingData.readinessScale !== undefined
    ) {
      readinessScaleValue = String(existingData.readinessScale);
    }

    // Cập nhật formData với dữ liệu hiện có
    setFormData({
      cigarettesPerDay:
        existingData.cigarettesPerDay !== null
          ? String(existingData.cigarettesPerDay)
          : "",
      firstSmokeTime: existingData.firstSmokeTime || "",
      quitReason: existingData.quitReason || "",
      intentionSince: formatISODate(existingData.intentionSince) || "",
      readinessScale: readinessScaleValue,
      emotion: existingData.emotion || "",
    });

    // Đảm bảo step được đặt về 1 để bắt đầu quy trình chỉnh sửa đúng cách
    setStep(1);

    setIsEditing(true);
    setShowExistingDataModal(false);

    // Xóa lỗi khi bắt đầu chỉnh sửa
    setErrors({});
  };

  // Hàm chuyển đến trang QuitPlan mà không chỉnh sửa
  const handleProceedToQuitPlan = () => {
    navigate("/quit-plan");
  };

  // Thay thế hàm formatDate hiện tại
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    // Kiểm tra nếu là định dạng dd/MM/yyyy hoặc dd/M/yyyy
    if (typeof dateStr === "string" && dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }

    // Trường hợp đã có định dạng yyyy-MM-dd
    if (typeof dateStr === "string" && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }

    // Trường hợp khác, xử lý như trước
    try {
      const date = new Date(dateStr);
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Invalid date format:", dateStr);
      return "";
    }
  };

  // Thêm hàm formatTime để xử lý định dạng thời gian
  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    // Xử lý định dạng "h:mm SA/CH"
    if (timeStr.includes("SA") || timeStr.includes("CH")) {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");

      hours = parseInt(hours, 10);

      // Chuyển đổi sang định dạng 24h
      if (period === "CH" && hours < 12) {
        hours += 12;
      } else if (period === "SA" && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    }

    return timeStr; // Trả về nguyên dạng nếu không phải định dạng đặc biệt
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.cigarettesPerDay)
        newErrors.cigarettesPerDay = "Vui lòng nhập số điếu mỗi ngày";
      if (!formData.firstSmokeTime)
        newErrors.firstSmokeTime = "Vui lòng chọn thời gian";
    }
    if (currentStep === 2) {
      if (!formData.quitReason)
        newErrors.quitReason = "Vui lòng nhập lý do bỏ thuốc";
      if (!formData.intentionSince)
        newErrors.intentionSince = "Vui lòng chọn ngày";
    }
    if (currentStep === 3) {
      // Sửa lại để xử lý cả trường hợp readinessScale = 0
      if (
        formData.readinessScale === "" ||
        formData.readinessScale === null ||
        formData.readinessScale === undefined
      )
        newErrors.readinessScale = "Vui lòng nhập mức sẵn sàng";
      if (!formData.emotion) newErrors.emotion = "Vui lòng nhập cảm xúc";
    }
    return newErrors;
  };

  const handleNext = () => {
    console.log("Current step:", step, "Form data:", formData);
    const stepErrors = validateStep(step);

    if (Object.keys(stepErrors).length === 0) {
      const nextStep = Math.min(step + 1, 3);
      console.log("Moving to step:", nextStep);
      setStep(nextStep);
      setErrors({});
    } else {
      console.log("Validation errors:", stepErrors);
      setErrors(stepErrors);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission attempted. Current step:", step);

    // Kiểm tra xem người dùng đang ở bước nào
    if (step !== 3) {
      console.log("Not at final step, moving to next step instead");
      handleNext();
      return;
    }

    // Kiểm tra lỗi ở bước cuối cùng
    const stepErrors = validateStep(step);
    console.log("Final submission validation errors:", stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      // Đặt trạng thái loading
      setLoading(true);

      // Định dạng dữ liệu trước khi gửi
      const payload = {
        cigarettesPerDay: formData.cigarettesPerDay,
        firstSmokeTime: formatTime(formData.firstSmokeTime),
        quitReason: formData.quitReason,
        intentionSince: formatDate(formData.intentionSince),
        readinessScale: formData.readinessScale,
        emotion: formData.emotion,
      };

      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        // Nếu đang chỉnh sửa, sử dụng PUT thay vì POST
        if (isEditing) {
          await api.put("/initial-condition", payload, config);
          // Hiển thị thông báo thành công
          alert("✅ Cập nhật thông tin thành công!");
        } else {
          await api.post("/initial-condition", payload, config);
          // Hiển thị thông báo thành công
          alert("✅ Ghi nhận thông tin thành công!");
        }

        setSubmitted(true);

        // Chỉ chuyển hướng khi người dùng nhấn OK trên thông báo
        navigate("/quit-plan");
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert("❌ Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
        } else {
          alert("❌ Có lỗi khi gửi thông tin.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(stepErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hiển thị modal xem thông tin đã khai báo
  const ExistingDataModal = () => (
    <Modal
      title="Thông tin khai báo sức khỏe"
      open={showExistingDataModal}
      footer={null}
      closable={false}
      maskClosable={false}
      width={700}
    >
      <div className="p-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            Bạn đã khai báo thông tin sức khỏe trước đó. Bạn có thể xem lại,
            chỉnh sửa hoặc tiếp tục đến trang tạo kế hoạch bỏ thuốc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
              <FiPackage className="text-blue-500" /> Thói quen hút thuốc
            </h3>
            <p>
              <span className="font-semibold">Số điếu mỗi ngày:</span>{" "}
              {existingData?.cigarettesPerDay}
            </p>
            <p>
              <span className="font-semibold">Thời gian hút điếu đầu:</span>{" "}
              {existingData?.firstSmokeTime}
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
              <FiCalendar className="text-blue-500" /> Tại sao bạn hút thuốc
            </h3>
            <p>
              <span className="font-semibold">Lý do hút thuốc:</span>{" "}
              {existingData?.quitReason}
            </p>
            <p>
              <span className="font-semibold">Ý định từ ngày:</span>{" "}
              {new Date(existingData?.intentionSince).toLocaleDateString()}
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
              <FiTrendingUp className="text-blue-500" /> Sẵn sàng & Cảm xúc
            </h3>
            <p>
              <span className="font-semibold">Mức độ sẵn sàng:</span>{" "}
              {existingData?.readinessScale}/10
            </p>
            <p>
              <span className="font-semibold">Cảm xúc:</span>{" "}
              {existingData?.emotion}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <Button
            type="default"
            icon={<FiEdit />}
            onClick={handleEditExistingData}
            className="flex items-center"
          >
            Chỉnh sửa thông tin
          </Button>

          <Button
            type="primary"
            icon={<FiArrowRight />}
            onClick={handleProceedToQuitPlan}
            className="flex items-center"
          >
            Tiếp tục đến kế hoạch bỏ thuốc
          </Button>
        </div>
      </div>
    </Modal>
  );

  // Hiển thị loading khi đang kiểm tra trạng thái
  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang kiểm tra thông tin..." />
      </div>
    );
  }

  // Thay đổi thành phần submitted
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Cảm ơn bạn!
          </h2>
          <p className="text-gray-700 mb-3">
            {isEditing
              ? "Chúng tôi đã cập nhật thông tin sức khỏe của bạn."
              : "Chúng tôi đã ghi nhận thông tin sức khỏe của bạn."}
          </p>
          <button
            onClick={() => navigate("/quit-plan")}
            className="mt-4 bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Đến trang kế hoạch bỏ thuốc
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      {showExistingDataModal && <ExistingDataModal />}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {isEditing
            ? "Chỉnh sửa thông tin sức khỏe"
            : "Hành trình bỏ thuốc của bạn"}
        </h1>
        <QuoteSlider />
        <div className="mt-8">
          <ProgressBar currentStep={step} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                <FiPackage className="text-blue-500" /> Thói quen hút thuốc
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điếu thuốc mỗi ngày
                </label>
                <input
                  type="number"
                  name="cigarettesPerDay"
                  value={formData.cigarettesPerDay}
                  onChange={handleChange}
                  placeholder="Nhập số điếu bạn hút mỗi ngày"
                  className="w-full rounded-md border-gray-300 shadow-sm mt-1"
                />
                {errors.cigarettesPerDay && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cigarettesPerDay}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thời gian hút điếu đầu tiên
                </label>
                <input
                  type="time"
                  name="firstSmokeTime"
                  value={formData.firstSmokeTime}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm mt-1"
                />
                {errors.firstSmokeTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstSmokeTime}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                <FiCalendar className="text-blue-500" /> Tại sao bạn hút thuốc
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lý do bạn muốn hút thuốc
                </label>
                <textarea
                  name="quitReason"
                  value={formData.quitReason}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ví dụ: ÁP LỰC, THÓI QUEN, XÃ HỘI..."
                  className="w-full rounded-md border-gray-300 shadow-sm mt-1"
                />
                {errors.quitReason && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.quitReason}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bạn đã có ý định bỏ thuốc từ khi nào?
                </label>
                <input
                  type="date"
                  name="intentionSince"
                  value={formData.intentionSince}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm mt-1"
                />
                {errors.intentionSince && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.intentionSince}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                <FiTrendingUp className="text-blue-500" /> Sẵn sàng & Cảm xúc
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mức độ sẵn sàng (0 đến 10)
                </label>
                <input
                  type="number"
                  name="readinessScale"
                  min={0}
                  max={10}
                  placeholder="Ví dụ: 7"
                  value={formData.readinessScale}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm mt-1"
                  onBlur={(e) =>
                    console.log("readinessScale value:", e.target.value)
                  }
                />
                {errors.readinessScale && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.readinessScale}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cảm xúc hiện tại
                </label>
                <input
                  name="emotion"
                  value={formData.emotion}
                  onChange={handleChange}
                  placeholder="Ví dụ: lo lắng, tự tin, áp lực..."
                  className="w-full rounded-md border-gray-300 shadow-sm mt-1"
                  onBlur={(e) => console.log("emotion value:", e.target.value)}
                />
                {errors.emotion && (
                  <p className="text-red-500 text-sm mt-1">{errors.emotion}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200"
              >
                Quay lại
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`ml-auto px-6 py-2 rounded-md text-white ${
                  loading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading
                  ? "Đang gửi..."
                  : isEditing
                  ? "Cập nhật thông tin"
                  : "Hoàn thành & Gửi thông tin"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductPage;
