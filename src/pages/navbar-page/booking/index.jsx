import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "./../../../configs/axios";
import {
  HiOutlineCalendar,
  HiCheckCircle,
  HiArrowLeft,
  HiOutlineClock,
  HiOutlineUser,
} from "react-icons/hi";

const MOCK_API_BASE = "https://68512c568612b47a2c08e9af.mockapi.io";
const APPOINTMENTS_API = `${MOCK_API_BASE}/appointments`;
// Bỏ SLOTS_API vì không dùng nữa

// Sử dụng lại mảng thời gian cố định
const TIME_SLOTS = [
  { label: "08:00 - 10:00", time: "08:00" },
  { label: "10:00 - 12:00", time: "10:00" },
  { label: "13:00 - 15:00", time: "13:00" },
  { label: "15:00 - 17:00", time: "15:00" },
];

function BookingPage() {
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [form, setForm] = useState({ date: "", time: "" });
  const [coaches, setCoaches] = useState([]);
  // Bỏ state timeSlots
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [meetLink] = useState("https://meet.google.com/your-meet-link");

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const selectedCoach = coaches.find((coach) => coach.id === selectedCoachId);

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/coaches") // Thay đổi: Gọi đến API chuyên lấy danh sách coach
      .then((res) => {
        // Giả định API trả về đúng danh sách coach đã được lọc
        const coachList = res.data.map((coach) => ({
          ...coach,
          // Dữ liệu giả lập có thể giữ lại hoặc bỏ đi nếu API đã cung cấp đủ
          specialization: "Life & Relationship Coach",
          aboutMe: `Chuyên gia với hơn 10 năm kinh nghiệm trong lĩnh vực tư vấn tâm lý và phát triển bản thân. ${coach.fullName} cam kết mang lại sự thay đổi tích cực và bền vững cho khách hàng.`,
        }));
        setCoaches(coachList);
      })
      .catch((err) => {
        console.error("Error fetching coaches:", err);
        setError("Không thể tải dữ liệu cần thiết.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectCoach = (coachId) => {
    setSelectedCoachId(coachId);
    setForm({ date: "", time: "" });
  };

  const handleGoBack = () => {
    setSelectedCoachId(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const bookingData = {
      coachId: selectedCoach.id,
      customerId: currentUser.id,
      coach: {
        id: selectedCoach.id,
        fullName: selectedCoach.fullName,
        avatar: selectedCoach.avatar,
      },
      customer: {
        id: currentUser.id,
        fullName: currentUser.fullName,
        username: currentUser.username,
        email: currentUser.email,
      },
      date: form.date,
      time: form.time,
      status: "BOOKED",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.get(APPOINTMENTS_API, {
        params: {
          coachId: selectedCoach.id,
        },
      });

      const isBooked = res.data.some(
        (booking) =>
          booking.date === form.date &&
          booking.time === form.time &&
          (booking.status === "BOOKED" || booking.status === "ACCEPTED")
      );

      if (isBooked) {
        setError("Khung giờ này đã có người đặt. Vui lòng chọn giờ khác.");
        setIsLoading(false);
        return;
      }

      await axios.post(APPOINTMENTS_API, bookingData);
      setSuccess(true);
    } catch (err) {
      console.error("Booking failed:", err);
      setError("Đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    const formattedDate = new Date(form.date).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <HiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Đặt lịch thành công!
          </h2>
          <p className="mt-2 text-gray-600">
            Thông tin chi tiết lịch hẹn của bạn:
          </p>
          <div className="mt-6 space-y-3 border border-gray-200 bg-gray-50 p-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center font-medium">
                <HiOutlineUser className="mr-2" /> Người tư vấn:
              </span>
              <span className="font-bold text-gray-900">
                {selectedCoach?.fullName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center font-medium">
                <HiOutlineCalendar className="mr-2" /> Ngày hẹn:
              </span>
              <span className="font-bold text-gray-900">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center font-medium">
                <HiOutlineClock className="mr-2" /> Thời gian:
              </span>
              <span className="font-bold text-gray-900">{form.time}</span>
            </div>
          </div>
          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700"
          >
            Tham gia Google Meet
          </a>
        </div>
      </div>
    );
  }

  return selectedCoach ? (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleGoBack}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
        >
          <HiArrowLeft /> Quay lại chọn Coach
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
              <img
                className="mx-auto h-32 w-32 rounded-full object-cover"
                src={
                  selectedCoach.avatar ||
                  `https://i.pravatar.cc/150?u=${selectedCoach.id}`
                }
                alt={selectedCoach.fullName}
              />
              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                {selectedCoach.fullName}
              </h3>
              <p className="text-sm font-semibold text-indigo-600">
                {selectedCoach.specialization}
              </p>
              <div className="mt-6 border-t border-gray-200 pt-6 text-left">
                <h4 className="text-sm font-bold text-gray-500">GIỚI THIỆU</h4>
                <p className="mt-2 text-sm text-gray-600">
                  {selectedCoach.aboutMe}
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900">
                Lịch làm việc & Đặt hẹn
              </h3>
              <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-base font-bold text-gray-900"
                  >
                    1. Chọn ngày
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-2 block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-gray-900">
                    2. Chọn khung giờ
                  </label>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {TIME_SLOTS.map(
                      (
                        slot // Sử dụng lại mảng TIME_SLOTS
                      ) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setForm({ ...form, time: slot.time })}
                          className={`rounded-lg border px-4 py-3 text-center text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            form.time === slot.time
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {slot.label}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !form.date || !form.time}
                    className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    {isLoading ? "Đang xử lý..." : "Xác nhận & Đặt hẹn"}
                  </button>
                </div>
                {error && (
                  <p className="text-center text-sm text-red-600">{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Coach Consultation
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tìm kiếm sự hỗ trợ từ các chuyên gia hàng đầu.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="text-center col-span-full">Đang tải...</div>
          ) : (
            coaches.map((coach) => (
              <div
                key={coach.id}
                className="flex flex-col rounded-2xl bg-white shadow-xl transition hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="flex-1 p-8 text-center">
                  <img
                    className="mx-auto h-32 w-32 rounded-full object-cover"
                    src={
                      coach.avatar || `https://i.pravatar.cc/150?u=${coach.id}`
                    }
                    alt={coach.fullName}
                  />
                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {coach.fullName}
                  </h3>
                  <p className="text-sm text-indigo-600 font-semibold">
                    {coach.specialization}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-b-2xl">
                  <button
                    onClick={() => handleSelectCoach(coach.id)}
                    className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    Xem lịch & Đặt hẹn
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
