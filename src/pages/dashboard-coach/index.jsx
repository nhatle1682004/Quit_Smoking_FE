// src/pages/CoachDashboard.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../configs/axios";
import {
  HiOutlineSearch,
  HiOutlineChatAlt2,
  HiChevronDown,
} from "react-icons/hi";

// Component Card cho mỗi chỉ số (Không thay đổi)
const StatCard = ({ title, value, colorClass }) => (
  <div className={`rounded-lg p-4 ${colorClass}`}>
    <p className="text-sm text-gray-700">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

// Component Card cho mỗi Client (Không thay đổi)
const ClientCard = ({ client }) => {
  const { progress } = client;
  const cravingColor =
    progress.cravingIntensity > 75
      ? "bg-red-500"
      : progress.cravingIntensity > 50
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={client.avatar}
            alt={client.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {client.fullName}
            </h3>
            <p className="text-sm text-gray-500">{client.email}</p>
            <p className="text-xs text-gray-400">Joined: {client.joinedDate}</p>
          </div>
        </div>
        {client.plan === "Premium" && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {client.plan}
          </span>
        )}
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-3">Progress Overview</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <StatCard
            title="Smoke-Free Days"
            value={progress.smokeFreeDays}
            colorClass="bg-green-100"
          />
          <StatCard
            title="Cigarettes Avoided"
            value={progress.cigarettesAvoided}
            colorClass="bg-blue-100"
          />
          <StatCard
            title="Money Saved"
            value={`$${progress.moneySaved}`}
            colorClass="bg-yellow-100"
          />
        </div>
      </div>
      <div className="mb-5">
        <h4 className="font-semibold text-gray-700 mb-2">Craving Intensity</h4>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`${cravingColor} h-2.5 rounded-full`}
            style={{ width: `${progress.cravingIntensity}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          View Details
        </button>
        <button className="p-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          <HiOutlineChatAlt2 size={20} />
        </button>
      </div>
    </div>
  );
};

function CoachDashboard() {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    // Bỏ comment và sử dụng API thật
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const apiConfig = {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        };

        // Gọi API duy nhất bạn đã cung cấp
        const response = await api.get(
          `/api/bookings/coach/${currentUser.id}`,
          apiConfig
        );
        const bookings = response.data;

        // --- XỬ LÝ DỮ LIỆU ---

        // 1. Tạo danh sách lịch hẹn để hiển thị
        const formattedAppointments = bookings.map((booking) => ({
          id: booking.id,
          customerName: booking.name || `Customer ID: ${booking.customerId}`, // Dùng tạm nếu API không trả về tên
          date: booking.date,
          time: `${booking.startTime} - ${booking.endTime}`,
          status:
            booking.status.charAt(0).toUpperCase() + booking.status.slice(1), // Viết hoa chữ cái đầu
        }));
        setAppointments(formattedAppointments);

        // 2. Tạo danh sách khách hàng duy nhất từ danh sách booking
        const clientMap = new Map();
        bookings.forEach((booking) => {
          if (!clientMap.has(booking.customerId)) {
            clientMap.set(booking.customerId, {
              id: booking.customerId,
              fullName: booking.name || `Customer ID: ${booking.customerId}`,
              email: "email@example.com", // API booking không có email, cần bổ sung
              avatar:
                booking.avatar ||
                `https://i.pravatar.cc/150?u=${booking.customerId}`,
              joinedDate: "2025-01-01", // API booking không có ngày tham gia, cần bổ sung
              plan: "Premium", // Cần có thông tin này từ API
              progress: {
                // Dữ liệu này cần được lấy từ API riêng về progress của client
                smokeFreeDays: 15,
                cigarettesAvoided: 300,
                moneySaved: 200,
                cravingIntensity: 80,
              },
            });
          }
        });
        const uniqueClients = Array.from(clientMap.values());
        setClients(uniqueClients);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentUser.id) {
      fetchDashboardData();
    } else {
      // Nếu không có user, dừng loading và có thể hiện thông báo
      setIsLoading(false);
      setError("Please log in to view the dashboard.");
    }
  }, [currentUser]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Coach! Here's an overview of your clients.
          </p>
        </header>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-auto">
            <HiOutlineSearch
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
              <span>All Clients</span>
              <HiChevronDown />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upcoming Appointments
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">
                      Customer
                    </th>
                    <th className="p-4 font-semibold text-gray-600">Date</th>
                    <th className="p-4 font-semibold text-gray-600">Time</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, index) => (
                    <tr
                      key={appt.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {appt.customerName}
                      </td>
                      <td className="p-4 text-gray-600">{appt.date}</td>
                      <td className="p-4 text-gray-600">{appt.time}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            appt.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachDashboard;
