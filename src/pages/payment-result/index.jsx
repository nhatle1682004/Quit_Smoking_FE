import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useGetParams from "../../hook/useGetParam";
import api from "../../configs/axios";
import { FaCheckCircle, FaTimesCircle, FaHome, FaHistory } from "react-icons/fa";
import { format } from "date-fns";

const PaymentPage = () => {
  const [paymentStatus, setPaymentStatus] = useState(""); // 'success' | 'fail'
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "Không xác định",
    amount: 0,
    paymentMethod: "VNPAY",
    transactionDate: new Date()
  });

  const getParam = useGetParams();
  const txnRef = getParam("vnp_TxnRef"); // ✅ Sử dụng đúng tên tham số từ VNPAY

  useEffect(() => {
    if (!txnRef) {
      toast.error("Không tìm thấy mã giao dịch");
      setPaymentStatus("fail");
      return;
    }

    const fetchPaymentStatus = async () => {
      const statusFromUrl = getParam("vnp_TransactionStatus");
    
      try {
        const response = await api.get("/payment/status", {
          params: { txnRef },
        });
    
        const data = response.data;
    
        if (data.status === "00" && statusFromUrl === "00") {
          toast.success("Thanh toán thành công");
          setPaymentStatus("success");
          setOrderDetails({
            orderNumber: data.orderNumber,
            amount: data.amount / 1000,
            paymentMethod: data.paymentMethod || "VNPAY",
            transactionDate: new Date(data.paidAt),
          });
        } else {
          toast.error("Thanh toán thất bại");
          setPaymentStatus("fail");
        }
      } catch (err) {
        toast.error("Lỗi khi kiểm tra trạng thái thanh toán");
        setPaymentStatus("fail");
        console.error("API lỗi:", err?.response?.data || err);
      }
    };

    fetchPaymentStatus();
  }, [txnRef]);

  const failureReasons = [
    "Tài khoản không đủ số dư",
    "Thẻ bị từ chối",
    "Lỗi kết nối mạng khi xử lý thanh toán"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`p-8 ${paymentStatus === "success" ? "bg-green-50" : "bg-red-50"}`}>
          {paymentStatus === "success" ? (
            <div className="text-center">
              <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
              <h2 className="mt-4 text-3xl font-bold text-green-800">Thanh toán thành công!</h2>
              <div className="mt-6 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold">{orderDetails.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold">
                    {orderDetails.amount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND"
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-semibold">{orderDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngày thanh toán:</span>
                  <span className="font-semibold">
                    {format(orderDetails.transactionDate, "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <FaTimesCircle className="mx-auto h-16 w-16 text-red-500 animate-bounce" />
              <h2 className="mt-4 text-3xl font-bold text-red-800">Thanh toán thất bại!</h2>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Lý do có thể:</h3>
                <ul className="text-left space-y-2">
                  {failureReasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-gray-600">
                  Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 space-y-4">
          <button
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => window.location.href = "/"}
          >
            <FaHome className="mr-2" /> Về trang chủ
          </button>
          <button
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => window.location.href = "/orders"}
          >
            <FaHistory className="mr-2" /> Xem lịch sử đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
