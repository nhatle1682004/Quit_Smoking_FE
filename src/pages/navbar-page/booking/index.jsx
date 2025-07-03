import React, { useState } from "react";

function BookingPage() {
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "" });
  const [success, setSuccess] = useState(false);
  const [meetLink] = useState("https://meet.google.com/your-meet-link"); // Thay bằng link thực tế

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập booking thành công
    setSuccess(true);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Đặt lịch tư vấn cai nghiện thuốc lá</h2>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Họ tên:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Ngày tư vấn:</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Giờ tư vấn:</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              background: "#4285F4",
              color: "#fff",
              border: "none",
              borderRadius: 4,
            }}
          >
            Đặt lịch tư vấn
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h3>Đặt lịch thành công!</h3>
          <p>
            Vui lòng tham gia buổi tư vấn qua Google Meet theo link dưới đây:
          </p>
          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4285F4", fontWeight: "bold" }}
          >
            Tham gia Google Meet
          </a>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
