import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../../../configs/axios";
import {
  HiCheckCircle,
  HiArrowLeft,
  HiExclamationCircle,
  HiOutlineClock,
} from "react-icons/hi";

// Giữ nguyên các khối 2 giờ ban đầu
const TIME_SLOTS = [
  { label: "08:00 - 10:00", startTime: "08:00", endTime: "10:00" },
  { label: "10:00 - 12:00", startTime: "10:00", endTime: "12:00" },
  { label: "13:00 - 15:00", startTime: "13:00", endTime: "15:00" },
  { label: "15:00 - 17:00", startTime: "15:00", endTime: "17:00" },
];

// Ánh xạ ID của Coach (từ bảng coaches) với link Google Meet
const COACH_MEET_LINKS = {
  1: "https://meet.google.com/pfw-oxjm-vpy",
  2: "https://meet.google.com/uiu-hhqt-hwk",
  3: "https://meet.google.com/avq-ryky-kph",
  4: "https://meet.google.com/yho-wmay-jbe",
  5: "https://meet.google.com/yuo-cfmk-fej",
  6: "https://meet.google.com/hjf-khzm-tsn",
  7: "https://meet.google.com/ddu-cdyn-ihk",
  8: "https://meet.google.com/trg-setn-myv",
  9: "https://meet.google.com/nqs-hrcf-gfh",
  10: "https://meet.google.com/pmv-fnoh-zuu",
};

function BookingPage() {
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "" });
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userBlockMessage, setUserBlockMessage] = useState(null);
  const [latestBooking, setLatestBooking] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  const currentUser = useSelector((state) => state.user);

  const selectedCoach = coaches.find((c) => c.id === selectedCoachId);

  const fetchInitialData = useCallback(async () => {
    if (!currentUser?.id) {
      setIsLoading(false);
      setUserBlockMessage("Vui lòng đăng nhập để đặt lịch hẹn.");
      return;
    }
    setIsLoading(true);
    const apiConfig = {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    };

    try {
      const planRes = await api.get("/purchased-plan/my", apiConfig);
      const activePlan = planRes.data.find((plan) => plan.status === "ACTIVE");

      if (!activePlan || activePlan.packageInfo.code != 4) {
        setUserBlockMessage(
          'Bạn cần đăng ký gói "Cao Cấp" để sử dụng tính năng này.'
        );
        setIsLoading(false);
        return;
      }

      const [coachesRes, userBookingsRes] = await Promise.all([
        api.get("/coach/coaches", apiConfig),
        api.get(`/bookings/user/${currentUser.id}`, apiConfig),
      ]);

      const allCoaches = coachesRes.data;
      const userBookings = userBookingsRes.data;

      if (!userBookings || userBookings.length === 0) {
        const coachList = allCoaches.map((coach) => ({
          ...coach,
          specialization:
            "Huấn luyện viên hỗ trợ bỏ thuốc, đồng hành cải thiện sức khỏe.",
          aboutMe: `Chuyên gia với hơn 10 năm kinh nghiệm.`,
        }));
        setCoaches(coachList);
        setIsLoading(false);
        return;
      }

      const assignedBookingCoachId = userBookings[0].coachId;
      const assignedCoach = allCoaches.find(
        (c) => c.id === assignedBookingCoachId
      );

      if (!assignedCoach) {
        setError("Không tìm thấy thông tin Coach đã đặt trước của bạn.");
        setIsLoading(false);
        return;
      }

      const activeBooking = userBookings.find((b) =>
        ["pending", "confirmed"].includes(b.status)
      );

      if (activeBooking) {
        const detailedBooking = {
          ...activeBooking,
          coachName: assignedCoach.fullName,
        };
        if (activeBooking.status === "confirmed") {
          setConfirmedAppointment(detailedBooking);
        } else {
          setUserBlockMessage(
            `Bạn đã có lịch hẹn đang chờ duyệt với Coach ${assignedCoach.fullName}.`
          );
        }
      } else {
        setCoaches([
          {
            ...assignedCoach,
            specialization:
              "Huấn luyện viên hỗ trợ bỏ thuốc, đồng hành cải thiện sức khỏe.",
            aboutMe: `Chuyên gia với hơn 10 năm kinh nghiệm.`,
          },
        ]);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setUserBlockMessage(
          "Bạn chưa đăng ký gói dịch vụ nào. Vui lòng đăng ký để đặt lịch."
        );
      } else {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("API Error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (selectedCoachId && form.date) {
      const fetchBookedSlots = async () => {
        setIsCheckingSlots(true);
        try {
          const apiConfig = {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          };
          const res = await api.get("/bookings/appointments", {
            params: {
              coachId: selectedCoachId,
              date: form.date,
            },
            headers: apiConfig.headers,
          });

          const slots = res.data.map((booking) =>
            booking.startTime ? booking.startTime.substring(0, 5) : ""
          );
          setBookedSlots(slots);
        } catch (error) {
          console.error("Failed to fetch booked slots:", error);
          setBookedSlots([]);
        } finally {
          setIsCheckingSlots(false);
        }
      };
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [selectedCoachId, form.date, currentUser?.token]);

  const handleSelectCoach = (coachId) => {
    setSelectedCoachId(coachId);
    setForm({ date: "", startTime: "", endTime: "" });
    setError(null);
  };

  const handleGoBack = () => {
    setSelectedCoachId(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const apiConfig = {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      };
      const body = {
        userId: currentUser.id,
        coachId: selectedCoach.id,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        status: "pending",
      };
      const res = await api.post("/bookings", body, apiConfig);
      setSuccess(true);
      setLatestBooking(res.data);
    } catch (err) {
      console.log(err);
      setError("Đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!success || !latestBooking || latestBooking.status !== "pending")
      return;
    const interval = setInterval(async () => {
      try {
        const apiConfig = {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        };
        const res = await api.get(
          `/bookings/user/${currentUser.id}`,
          apiConfig
        );
        const updatedBooking = res.data.find(
          (b) => b.bookingId === latestBooking.bookingId
        );
        if (updatedBooking?.status === "confirmed") {
          setLatestBooking(updatedBooking);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [success, latestBooking, currentUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Đang tải...</span>
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
              href={
                COACH_MEET_LINKS[confirmedAppointment.coachId] ||
                "https://meet.google.com/error-link"
              }
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
          <h2 className="text-xl font-bold mt-4">Thông báo</h2>
          <p className="mt-2 text-gray-600">{userBlockMessage}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          {latestBooking?.status === "confirmed" ? (
            <HiCheckCircle className="text-green-500 text-5xl mx-auto" />
          ) : (
            <HiOutlineClock className="text-blue-500 text-5xl mx-auto" />
          )}
          <h2 className="text-2xl font-bold mt-4">
            {latestBooking?.status === "confirmed"
              ? "Lịch hẹn đã được xác nhận!"
              : "Đã gửi yêu cầu đặt lịch!"}
          </h2>
          <p className="mt-2 text-gray-600">
            {latestBooking?.status !== "confirmed" &&
              "Vui lòng chờ Coach xác nhận. Trạng thái sẽ được tự động cập nhật."}
          </p>
          <div className="text-left mt-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Trạng thái:</strong>{" "}
              <span
                className={`font-semibold capitalize ${
                  latestBooking?.status === "confirmed"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {latestBooking?.status}
              </span>
            </p>
            <p className="text-gray-700">
              <strong>Ngày:</strong> {latestBooking.date}
            </p>
            <p className="text-gray-700">
              <strong>Giờ:</strong> {latestBooking.startTime} -{" "}
              {latestBooking.endTime}
            </p>
          </div>
          {latestBooking?.status === "confirmed" && (
            <div className="mt-6">
              <a
                href={
                  COACH_MEET_LINKS[latestBooking.coachId] ||
                  "https://meet.google.com/error-link"
                }
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
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                  startTime: "",
                  endTime: "",
                })
              }
              required
              min={new Date().toISOString().split("T")[0]}
            />
            <label className="block mb-2 font-semibold text-gray-700">
              Chọn khung giờ
            </label>
            {isCheckingSlots && (
              <p className="text-center text-gray-500 mb-4">Đang kiểm tra...</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot.startTime);
                return (
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
                    disabled={isBooked}
                    className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                      isBooked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                        : form.startTime === slot.startTime
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white hover:bg-indigo-50 hover:border-indigo-400"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
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
      {coaches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-white rounded-xl p-6 shadow-md text-center transform hover:scale-105 transition-transform"
            >
              <img
                src={coach.avatarUrl}
                alt={coach.fullName}
                className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-4 border-indigo-200"
              />
              <h3 className="font-bold text-lg text-gray-900">
                {coach.fullName}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {coach.specialization}
              </p>
              <button
                onClick={() => handleSelectCoach(coach.id)}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Chọn Coach
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="text-center text-gray-500">
            Không có coach nào để hiển thị.
          </p>
        )
      )}
    </div>
  );
}

export default BookingPage;