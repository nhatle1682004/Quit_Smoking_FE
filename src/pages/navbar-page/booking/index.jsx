// BookingPage.jsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/axios";
import {
  HiCheckCircle,
  HiArrowLeft,
  HiExclamationCircle,
} from "react-icons/hi";

const TIME_SLOTS = [
  { label: "08:00 - 10:00", startTime: "08:00", endTime: "10:00" },
  { label: "10:00 - 12:00", startTime: "10:00", endTime: "12:00" },
  { label: "13:00 - 15:00", startTime: "13:00", endTime: "15:00" },
  { label: "15:00 - 17:00", startTime: "15:00", endTime: "17:00" },
];

function BookingPage() {
  // ✅ STEP 1: Đổi tên state để lưu accountId
  const [selectedCoachAccountId, setSelectedCoachAccountId] = useState(null);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "" });
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userBlockMessage, setUserBlockMessage] = useState(null);
  const [latestBooking, setLatestBooking] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  // ✅ STEP 2: Cập nhật logic tìm coach bằng accountId
  const selectedCoach = coaches.find(
    (c) => c.accountId === selectedCoachAccountId
  );

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      setUserBlockMessage("Vui lòng đăng nhập để đặt lịch hẹn.");
      return;
    }

    const apiConfig = {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    };

    Promise.all([
      api.get("/coach/coaches", apiConfig),
      api.get("/bookings/appointments", apiConfig),
    ])
      .then(([coachesRes, bookingsRes]) => {
        const allCoaches = coachesRes.data;
        const allBookings = bookingsRes.data;

        const userActiveBooking = allBookings.find(
          (b) =>
            b.customerId === currentUser.id &&
            ["pending", "confirmed", "completed"].includes(b.status)
        );

        if (userActiveBooking) {
          // Sửa logic tìm coach khớp với booking đang có (dùng accountId)
          const matchedCoach = allCoaches.find(
            (c) => c.accountId === userActiveBooking.coachId
          );
          const coachName = matchedCoach?.fullName || "chưa rõ";

          if (userActiveBooking.status === "confirmed") {
            setConfirmedAppointment({ ...userActiveBooking, coachName });
            setIsLoading(false);
            return;
          }

          setUserBlockMessage(
            `Bạn đã có lịch hẹn (${userActiveBooking.status.toLowerCase()}) với Coach ${coachName}.`
          );
          setCoaches([]);
          setIsLoading(false);
          return;
        }

        const availableCoaches = allCoaches.filter((coach) => {
          const activeCustomers = new Set();
          allBookings.forEach((booking) => {
            // Sửa logic lọc coach (dùng accountId)
            if (
              booking.coachId === coach.accountId &&
              ["pending", "confirmed", "completed"].includes(booking.status)
            ) {
              activeCustomers.add(booking.customerId);
            }
          });
          return activeCustomers.size < 4;
        });

        const coachList = availableCoaches.map((coach) => ({
          ...coach,
          specialization: "Life & Relationship Coach",
          aboutMe: `Chuyên gia với hơn 10 năm kinh nghiệm. ${coach.fullName} cam kết đồng hành cùng bạn.`,
        }));
        setCoaches(coachList);
      })
      .catch(() => setError("Không thể tải dữ liệu."))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  // ✅ STEP 3: Cập nhật hàm để nhận và lưu accountId
  const handleSelectCoach = (accountId) => {
    setSelectedCoachAccountId(accountId);
    setForm({ date: "", startTime: "", endTime: "" });
    setError(null);
  };

  const handleGoBack = () => {
    setSelectedCoachAccountId(null);
    setError(null);
  };

  // ✅ STEP 4: Cập nhật hàm handleSubmit để gửi đi accountId
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!currentUser) {
      setError("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    try {
      const apiConfig = {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      };

      // Gửi đi accountId để kiểm tra
      const check = await api.get("/bookings/appointments", {
        params: {
          coachId: selectedCoach.accountId,
          date: form.date,
          time: form.startTime,
        },
        headers: apiConfig.headers,
      });

      const isBooked = check.data.some((b) =>
        ["pending", "confirmed"].includes(b.status)
      );

      if (isBooked) {
        setError("Khung giờ này đã có người đặt.");
        setIsLoading(false);
        return;
      }

      // Gửi đi accountId trong body của request
      const body = {
        userId: currentUser.id,
        coachId: selectedCoach.accountId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        status: "pending",
      };

      const res = await api.post("/bookings", body, apiConfig);
      setSuccess(true);
      setLatestBooking(res.data);
    } catch (err) {
      setError("Đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success && latestBooking?.status === "pending") {
      const interval = setInterval(async () => {
        try {
          const apiConfig = {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          };
          const res = await api.get("/bookings/appointments", apiConfig);
          // Cập nhật logic polling để tìm đúng booking
          const updated = res.data.find(
            (b) =>
              b.customerId === currentUser.id &&
              b.coachId === selectedCoach.accountId &&
              b.date === form.date &&
              b.startTime === form.startTime
          );
          if (updated?.status === "confirmed") {
            setLatestBooking(updated);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [success, latestBooking, currentUser, selectedCoach, form]);

  // PHẦN RENDER JSX (Không cần thay đổi logic ở đây)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (confirmedAppointment) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <HiCheckCircle className="text-green-500 text-5xl mx-auto" />
          <h2 className="text-2xl font-bold mt-4">
            Bạn có lịch hẹn đã xác nhận
          </h2>
          <div className="text-left mt-4 bg-gray-50 p-4 rounded-lg border">
            <p className="text-gray-700">
              <strong>Coach:</strong> {confirmedAppointment.coachName}
            </p>
            <p className="text-gray-700">
              <strong>Ngày:</strong> {confirmedAppointment.date}
            </p>
            <p className="text-gray-700">
              <strong>Giờ:</strong> {confirmedAppointment.startTime} -{" "}
              {confirmedAppointment.endTime}
            </p>
          </div>
          <div className="mt-6">
            <p className="text-gray-600 mb-2">
              Vui lòng tham gia cuộc hẹn đúng giờ.
            </p>
            <a
              href="https://meet.google.com/tdk-kvpn-zww"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              ✅ Tham gia Google Meet
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (userBlockMessage) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md">
          <HiExclamationCircle className="text-yellow-500 text-5xl mx-auto" />
          <h2 className="text-xl font-bold mt-4">Không thể đặt lịch</h2>
          <p className="mt-2 text-gray-600">{userBlockMessage}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <HiCheckCircle className="text-green-500 text-5xl mx-auto" />
          <h2 className="text-2xl font-bold mt-4">Đặt lịch thành công!</h2>
          <div className="text-left mt-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Trạng thái:</strong>{" "}
              <span className="font-semibold capitalize text-indigo-600">
                {latestBooking?.status}
              </span>
            </p>
            <p className="text-gray-700">
              <strong>Ngày:</strong> {form.date}
            </p>
            <p className="text-gray-700">
              <strong>Giờ:</strong> {form.startTime} - {form.endTime}
            </p>
          </div>

          {latestBooking?.status === "confirmed" && (
            <div className="mt-6">
              <p className="text-gray-600 mb-2">
                Lịch hẹn đã được xác nhận. Vui lòng tham gia đúng giờ.
              </p>
              <a
                href="https://meet.google.com/tdk-kvpn-zww"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                ✅ Tham gia Google Meet
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedCoach) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold"
        >
          <HiArrowLeft /> Quay lại
        </button>
        <div className="bg-white shadow-xl rounded-xl p-6 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Đặt lịch với {selectedCoach.fullName}
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-semibold text-gray-700">
              Chọn ngày
            </label>
            <input
              type="date"
              className="border rounded w-full p-2 mb-4"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              min={new Date().toISOString().split("T")[0]}
            />
            <label className="block mb-2 font-semibold text-gray-700">
              Chọn khung giờ
            </label>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                    })
                  }
                  className={`p-3 rounded-lg border-2 transition-all ${
                    form.startTime === slot.startTime
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white hover:bg-indigo-50 hover:border-indigo-400"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={isLoading || !form.date || !form.startTime}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận & Đặt lịch"}
            </button>
            {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Chọn Coach để đặt lịch
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-white rounded-xl p-6 shadow-md text-center transform hover:scale-105 transition-transform"
          >
            <img
              src={coach.avatarUrl} // Sửa lại để dùng avatarUrl từ API
              alt={coach.fullName}
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-4 border-indigo-200"
            />
            <h3 className="font-bold text-lg text-gray-900">
              {coach.fullName}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{coach.specialization}</p>
            {/* ✅ STEP 3.2: Truyền vào accountId khi click */}
            <button
              onClick={() => handleSelectCoach(coach.accountId)}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Chọn Coach
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingPage;
