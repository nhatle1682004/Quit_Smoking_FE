import React, { useState, useEffect } from "react";
import { FiPackage, FiCalendar, FiTrendingUp, FiHeart } from "react-icons/fi";
import axios from "axios";
import { Alert } from "antd";
import api from "./../../../configs/axios";

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
  const [formData, setFormData] = useState({
    cigarettesPerDay: "",
    firstSmokeTime: "",
    quitReason: "",
    intentionSince: "",
    readinessScale: "",
    emotion: "",
  });
  const [errors, setErrors] = useState({});

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
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
      if (!formData.readinessScale)
        newErrors.readinessScale = "Vui lòng nhập mức sẵn sàng";
      if (!formData.emotion) newErrors.emotion = "Vui lòng nhập cảm xúc";
    }
    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length === 0) {
      setStep((prev) => Math.min(prev + 1, 3));
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length === 0) {
      setLoading(true);
      const payload = {
        ...formData,
        intentionSince: formatDate(formData.intentionSince),
        createdAt: new Date().toISOString(),
      };

      try {
        // Lấy token từ localStorage (nếu có)
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await api.post("/initial-condition", payload, config);
        alert("🎉 Gửi thông tin thành công!");
        setSubmitted(true);
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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Cảm ơn bạn!
          </h2>
          <p className="text-gray-700">
            Chúng tôi đã ghi nhận hành trình bỏ thuốc của bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Hành trình bỏ thuốc của bạn
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
                <FiCalendar className="text-blue-500" /> Ý định bỏ thuốc
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lý do bạn muốn bỏ thuốc
                </label>
                <textarea
                  name="quitReason"
                  value={formData.quitReason}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ví dụ: vì sức khỏe, gia đình, tài chính..."
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
                {loading ? "Đang gửi..." : "Gửi thông tin"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductPage;
