import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { Button, Badge } from "antd";
import {
  GiftOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

function UserPackage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false); // Đang fetch danh sách
  const [activatingPlanId, setActivatingPlanId] = useState(null); // Plan đang kích hoạt
  const navigate = useNavigate();

  const fetchUserPackage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/purchased-plan/my");
      setPackages(response.data);
    } catch {
      toast.error("Không lấy được gói của bạn");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserPackage();
  }, [fetchUserPackage]);

  // Nhóm các gói
  const activePackages = packages.filter((pkg) => pkg.status === "ACTIVE");
  const paidPackages = packages.filter(
    (pkg) => pkg.paymentStatus === "SUCCESS" && pkg.status !== "ACTIVE"
  );
  const unpaidPackages = packages.filter(
    (pkg) => pkg.paymentStatus !== "SUCCESS"
  );
  const failedPackages = unpaidPackages.filter(
    (pkg) => pkg.paymentStatus === "FAILED"
  );
  const pendingPackages = unpaidPackages.filter(
    (pkg) => pkg.paymentStatus !== "FAILED"
  );

  const handleRetryPayment = (paymentUrl) => {
    if (paymentUrl) window.location.href = paymentUrl;
    else toast.error("Không tìm thấy link thanh toán lại!");
  };

  // Sửa lại hàm kích hoạt: disable nút khi đang xử lý, reload xong mới show UI mới
  const handleActivatePackage = async (planId) => {
    if (activatingPlanId) return; // Đang có plan khác đang kích hoạt
    setActivatingPlanId(planId);
    try {
      await api.post(`/purchased-plan/${planId}/activate`);
      toast.success("Kích hoạt gói thành công");
      await fetchUserPackage(); // Đảm bảo fetch lại data mới trước khi cho user thao tác tiếp
    } catch (err) {
      let message = "Không thể kích hoạt gói";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      }
      toast.error(message);
    } finally {
      setActivatingPlanId(null);
    }
  };

  // Badge trạng thái gói
  const renderStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge status="success" text="Đang hoạt động" />;
      case "PENDING":
        return <Badge status="warning" text="Chưa kích hoạt" />;
      case "COMPLETED":
        return <Badge status="processing" text="Đã hoàn thành" />;
      case "FAILED":
        return <Badge status="error" text="Thất bại" />;
      case "CANCELED":
        return <Badge status="error" text="Đã hủy" />;
      default:
        return <Badge status="default" text="Không xác định" />;
    }
  };

  // Badge trạng thái thanh toán
  const renderPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case "SUCCESS":
        return <Badge color="green" text="Đã thanh toán" />;
      case "PENDING":
        return <Badge color="orange" text="Chờ thanh toán" />;
      case "FAILED":
        return (
          <Badge
            color="red"
            text="Thanh toán
         thất bại"
          />
        );
      case "CANCELED":
        return <Badge color="red" text="Thanh toán đã hủy" />;
      default:
        return <Badge color="blue" text="Không xác định" />;
    }
  };

  // Render card của từng gói
  const renderPackageCard = (pkg, options = {}) => (
    <div
      key={pkg.id}
      className="bg-white border-2 border-[#2563eb] rounded-2xl shadow-lg p-6 flex flex-col h-full hover:shadow-2xl transition-shadow duration-200"
      style={{ minHeight: 320 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <GiftOutlined style={{ fontSize: 32, color: "#2563eb" }} />
        <h4 className="text-xl font-bold text-black">{pkg.packageInfo.name}</h4>
      </div>
      <div className="mb-2 flex items-center gap-2 text-black">
        <Badge color="blue" />
        <span className="font-semibold">Giá:</span>
        <span className="font-bold text-lg">
          {pkg.packageInfo.price.toLocaleString()} VNĐ
        </span>
      </div>
      <div className="mb-2">{renderStatusBadge(pkg.status)}</div>
      <div className="mb-2">{renderPaymentBadge(pkg.paymentStatus)}</div>
      <div className="mb-2 text-black">
        <span className="font-medium">Ngày mua: </span>
        <span>{new Date(pkg.purchasedAt).toLocaleDateString()}</span>
      </div>
      <div className="mb-4 text-black">
        <span className="font-medium">Ngày kích hoạt: </span>
        <span>
          {pkg.activationDate ? (
            new Date(pkg.activationDate).toLocaleDateString()
          ) : (
            <span className="text-gray-400">Chưa kích hoạt</span>
          )}
        </span>
      </div>
      {/* Nút tùy theo nhóm */}
      {options.retry && (
        <Button
          type="primary"
          danger={pkg.paymentStatus === "FAILED"} // nút thất bại màu đỏ
          icon={<ReloadOutlined />}
          onClick={() => handleRetryPayment(pkg.paymentUrl)}
          className="mt-auto mb-2"
          style={
            pkg.paymentStatus === "FAILED"
              ? { background: "#ff4d4f", border: "none", fontWeight: 600 } // đỏ
              : { background: "#1677ff", border: "none", fontWeight: 600 } // xanh
          }
        >
          Thanh toán lại
        </Button>
      )}
      {options.activate && (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => handleActivatePackage(pkg.id)}
          className="mt-auto"
          disabled={activatingPlanId === pkg.id} // disable khi đang gọi
          loading={activatingPlanId === pkg.id}
        >
          Kích hoạt ngay
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-10 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">
          Gói của tôi
        </h2>

        {/* Nhóm: GÓI ĐANG HOẠT ĐỘNG */}
        {activePackages.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              Gói đang hoạt động
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {activePackages.map((pkg) => renderPackageCard(pkg))}
            </div>
          </>
        )}

        {/* Nhóm: GÓI ĐÃ THANH TOÁN (chưa ACTIVE) */}
        {paidPackages.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Gói đã thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {paidPackages.map((pkg) =>
                renderPackageCard(pkg, { activate: true })
              )}
            </div>
          </>
        )}

        {/* Nhóm: GÓI CHƯA THANH TOÁN (pending/failed) */}
        {pendingPackages.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-2 text-orange-600">
              Gói chờ thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {pendingPackages.map((pkg) =>
                renderPackageCard(pkg, { retry: true })
              )}
            </div>
          </>
        )}
        {failedPackages.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              Gói thanh toán thất bại
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {failedPackages.map((pkg) =>
                renderPackageCard(pkg, { retry: true })
              )}
            </div>
          </>
        )}

        {/* Nếu không có gói nào */}
        {packages.length === 0 && !loading && (
          <div className="text-center">
            <GiftOutlined
              style={{ fontSize: 48, color: "#bdbdbd", marginBottom: 16 }}
            />
            <p className="text-lg text-gray-600 mb-4">Bạn chưa có gói nào.</p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/package")}
              className="rounded-lg"
            >
              Mua gói ngay
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPackage;
