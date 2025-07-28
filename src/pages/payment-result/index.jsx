import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaHome, FaHistory } from "react-icons/fa";

const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("loading"); // "loading" | "success" | "fail"
  const [showAction, setShowAction] = useState(false);

  //  Hàm gọi xác nhận lên BE
  const handleVnpayConfirm = async () => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const planId = params.get("planId");
    const responseCode = params.get("vnp_ResponseCode");

    if (!paymentId || !planId || !responseCode) {
      toast.error("Thiếu thông tin thanh toán!");
      setPaymentStatus("fail");
      setShowAction(true);
      return;
    }

    const statusForApi = responseCode === "00" ? "SUCCESS" : "FAILED";

    try {
      const res = await api.post("/payment/confirm", {
        paymentId,
        planId,
        paymentStatus: statusForApi,
      });
      console.log("🔥 Phản hồi từ BE:", res.data);

      if (res.data === "OK") {
        console.log("📦 Phản hồi xác nhận:", status);
        toast.success("Thanh toán thành công!");
        setPaymentStatus("success");
      } else if (res.data.paymentStatus === "PENDING") {
        toast.info("Thanh toán đang chờ xử lý từ VNPAY.");
        setPaymentStatus("pending");
      } else {
        toast.error("Thanh toán thất bại!");
        setPaymentStatus("fail");
      }
      
    } catch (error) {
      console.error("Lỗi xác nhận thanh toán:", error);
      toast.error("Không xác nhận được đơn hàng!");
      setPaymentStatus("fail");
    } finally {
      setShowAction(true);
    }
  };

  // Gọi xác nhận khi component mount
  useEffect(() => {
    handleVnpayConfirm();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div
          className={`p-8 ${
            paymentStatus === "success"
              ? "bg-green-50"
              : paymentStatus === "fail"
              ? "bg-red-50"
              : "bg-gray-50"
          }`}
        >
          {paymentStatus === "loading" && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Đang xác nhận giao dịch...</h2>
              <p className="mt-4 text-gray-600">Vui lòng chờ trong giây lát.</p>
            </div>
          )}
          {paymentStatus === "success" && (
            <div className="text-center">
              <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
              <h2 className="mt-4 text-3xl font-bold text-green-800">Thanh toán thành công!</h2>
              <p className="mt-4 text-lg text-gray-800">
                Cảm ơn bạn đã thanh toán. Bạn có thể về trang chủ hoặc xem các gói của mình.
              </p>
            </div>
          )}
          {paymentStatus === "fail" && (
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
