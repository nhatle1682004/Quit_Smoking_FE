import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaHome, FaHistory } from "react-icons/fa";

const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(""); // "success" | "fail"
  const [showAction, setShowAction] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const planId = params.get("planId");
    const responseCode = params.get("vnp_ResponseCode"); // "00" là thành công

    if (!paymentId || !planId || !responseCode) {
      toast.error("Thiếu thông tin xác nhận đơn hàng!");
      setPaymentStatus("fail");
      setShowAction(true);
      return;
    }

    // Chuyển code từ VNPay thành SUCCESS/FAILED cho BE
    const statusForApi = responseCode === "00" ? "SUCCESS" : "FAILED";
    setPaymentStatus(statusForApi === "SUCCESS" ? "success" : "fail");

    // Gửi xác nhận lên BE (chỉ gọi một lần khi mount)
    api.post("/payment/confirm", {
      paymentId,
      planId,
      paymentStatus: statusForApi,
    })
      .then(() => {
        if (statusForApi === "SUCCESS") toast.success("Thanh toán thành công!");
        else toast.error("Thanh toán thất bại!");
      })
      .catch(() => {
        toast.error("Không xác nhận được trạng thái đơn hàng!");
      })
      .finally(() => setShowAction(true));
  }, [location]);

  // ... UI hiển thị kết quả giống đoạn bạn đã gửi!

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`p-8 ${paymentStatus === "success" ? "bg-green-50" : "bg-red-50"}`}>
          {paymentStatus === "success" ? (
            <div className="text-center">
              <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
              <h2 className="mt-4 text-3xl font-bold text-green-800">Thanh toán thành công!</h2>
              <p className="mt-4 text-lg text-gray-800">
                Cảm ơn bạn đã thanh toán. Bạn có thể về trang chủ hoặc xem các gói của mình.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <FaTimesCircle className="mx-auto h-16 w-16 text-red-500 animate-bounce" />
              <h2 className="mt-4 text-3xl font-bold text-red-800">Thanh toán thất bại!</h2>
              <div className="mt-6 text-gray-600">Vui lòng thử lại hoặc liên hệ hỗ trợ.</div>
            </div>
          )}
        </div>
        {showAction && (
          <div className="p-6 bg-gray-50 space-y-4">
            <button
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/")}
            >
              <FaHome className="mr-2" /> Về trang chủ
            </button>
            <button
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => navigate("/user-package")}
            >
              <FaHistory className="mr-2" /> Xem các gói đã mua
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;
