import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#3498db] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cột 1: Về chúng tôi */}
          <div>
            <h3 className="text-base font-bold mb-2">Về chúng tôi</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-gray-200 transition-colors"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/services")}
                  className="hover:text-gray-200 transition-colors"
                >
                  Dịch vụ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/blog")}
                  className="hover:text-gray-200 transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="hover:text-gray-200 transition-colors"
                >
                  Liên hệ
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-base font-bold mb-2">Liên kết nhanh</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => navigate("/news")}
                  className="hover:text-gray-200 transition-colors"
                >
                  Tin tức
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/success-stories")}
                  className="hover:text-gray-200 transition-colors"
                >
                  Gương thành công
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/faqs")}
                  className="hover:text-gray-200 transition-colors"
                >
                  Câu hỏi thường gặp
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h3 className="text-base font-bold mb-2">Liên hệ</h3>
            <p className="mb-1 text-sm">Địa chỉ: 123 Đường Sức Khỏe, TP. HCM</p>
            <p className="mb-1 text-sm">Điện thoại: 0123 456 789</p>
            <p className="text-sm">Email: support@cainghienthuocla.vn</p>
          </div>

          {/* Cột 4: Gửi câu hỏi */}
          <div>
            <h3 className="text-base font-bold mb-2">
              Gửi câu hỏi cho chúng tôi
            </h3>
            <form>
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full p-1.5 mb-1.5 text-sm rounded bg-white/20 text-white placeholder:text-white/70 border border-white/30"
                required
              />
              <textarea
                placeholder="Câu hỏi..."
                className="w-full p-1.5 mb-1.5 text-sm rounded bg-white/20 text-white placeholder:text-white/70 border border-white/30 h-12"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-white text-[#3498db] px-3 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors font-medium"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center text-sm pt-4 mt-4 border-t border-white/20">
        &copy; {new Date().getFullYear()} Cai Nghiện Thuốc Lá. All rights
        reserved.
      </div>
    </footer>
  );
}

export default Footer;
