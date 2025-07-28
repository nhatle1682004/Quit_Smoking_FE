import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { Button, Badge, Divider } from "antd";
import { GiftOutlined, CheckCircleOutlined } from "@ant-design/icons";

function PackagePage() {
  const [packages, setPackages] = useState([]);
  const [userPlans, setUserPlans] = useState([]);

  useEffect(() => {
    fetchPackages();
    fetchUserPlans();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get("/package");
      setPackages(response.data);
    } catch {
      toast.error("Lấy dữ liệu gói thất bại");
    }
  };

  const fetchUserPlans = async () => {
    try {
      const res = await api.get("/purchased-plan/my");
      setUserPlans(res.data);
    } catch {
      // Ignored silently
    }
  };

  const purchasedPackageCodes = useMemo(() => {
    return userPlans
      .filter(
        (plan) =>
          plan.paymentStatus === "SUCCESS" &&
          (plan.status === "PENDING" || plan.status === "ACTIVE")
      )
      .map((plan) => plan.packageInfo?.code || plan.packageInfo?.packageCode);
  }, [userPlans]);

  const handleBuyPackage = async (packageCode) => {
    try {
      const response = await api.post("/purchased-plan/buy", {
        packageCode: String(packageCode),
      });

      const { paymentUrl } = response.data;

      if (!paymentUrl) {
        toast.error("Không nhận được đường dẫn thanh toán");
        return;
      }

      // FE không cần tự gắn thêm paymentId hay planId vào URL
      window.location.href = paymentUrl;
    } catch (error) {
      console.log(error);
      toast.warning(
        " Bạn đang có 1 gói chưa thanh toán. Vui lòng hoàn tất thanh toán tại phần Gói của tôi."
      );
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDuration = (days) => `${days} ngày`;

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:py-10 sm:px-8 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-black">
          🎁 Danh sách gói hỗ trợ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const code = pkg.code || pkg.packageCode;
            const isPurchased = purchasedPackageCodes.includes(code);

            return (
              <div
                key={code}
                className="flex flex-col h-full rounded-2xl shadow-xl border-2 border-[#2563eb] bg-white p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <GiftOutlined style={{ fontSize: 28, color: "#2563eb" }} />
                  <span className="text-lg sm:text-xl font-bold text-black">
                    {pkg.name}
                  </span>
                </div>

                <div className="flex-1 mb-2">
                  {pkg.description?.split("\n").map((line, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 mb-2 text-black text-sm sm:text-base"
                    >
                      <CheckCircleOutlined
                        style={{ fontSize: 18, color: "#22c55e", marginTop: 3 }}
                      />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>

                <Divider dashed style={{ margin: "8px 0" }} />

                <div className="mb-2 flex items-center gap-2 text-sm sm:text-base text-black">
                  <Badge color="blue" />
                  <span className="font-semibold">Giá:</span>
                  <span className="font-bold text-lg">
                    {formatPrice(pkg.price)}
                  </span>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm sm:text-base text-black">
                  <Badge color="purple" />
                  <span className="font-semibold">Thời hạn:</span>
                  <span className="font-bold">
                    {formatDuration(pkg.duration)}
                  </span>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="w-full rounded-lg font-bold text-base sm:text-lg py-2 sm:py-3"
                  disabled={isPurchased}
                  onClick={() => !isPurchased && handleBuyPackage(code)}
                  style={{
                    background: isPurchased
                      ? "#ddd"
                      : "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                    color: isPurchased ? "#888" : "#fff",
                    cursor: isPurchased ? "not-allowed" : "pointer",
                  }}
                >
                  {isPurchased ? "Đã mua" : "Mua ngay"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PackagePage;
