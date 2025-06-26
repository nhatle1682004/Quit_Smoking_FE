import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaComments, FaAmbulance } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  const menuItems = [
    { id: 1, label: "Trang chủ", href: "/" },
    { id: 2, label: "Giới thiệu", href: "/about" },
    { id: 3, label: "Kiến thức chung", href: "/knowledge" },
    { id: 4, label: "Dịch vụ & Sản phẩm", href: "/service" },
    { id: 5, label: "Gương cai thuốc thành công", href: "/news" },
    { id: 6, label: "Liên hệ", href: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a 
                    href={item.href} 
                    className="text-gray-600 hover:text-blue-600 transition duration-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700">Liên Hệ Hỗ Trợ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <FaPhone className="text-blue-600" />
                <span className="text-gray-600">1900-1234</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-600" />
                <span className="text-gray-600">cainghienthuocla64@mail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaComments className="text-blue-600" />
                <span className="text-gray-600">Hỗ Trợ Trực Tuyến 24/7</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaAmbulance className="text-blue-600" />
                <span className="text-gray-600">Cấp Cứu: 115</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700">Kết Nối</h3>
            <p className="text-gray-600">Tham gia cộng đồng của chúng tôi để nhận hỗ trợ và động lực hàng ngày.</p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-blue-600 font-medium mb-2">Bạn Có Thể Làm Được! Mỗi Ngày Không Hút Thuốc Là Một Chiến Thắng.</p>
            <p className="text-sm text-gray-500 mb-4">Hãy nhớ rằng, bạn không đơn độc trong hành trình này. Chúng tôi luôn ở đây để hỗ trợ bạn 24/7.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-600 transition duration-300">Chính Sách Bảo Mật</a>
            <span>|</span>
            <a href="#" className="hover:text-blue-600 transition duration-300">Điều Khoản Sử Dụng</a>
            <span>|</span>
            <a href="#" className="hover:text-blue-600 transition duration-300">Tuyên Bố Y Tế</a>
            <span>|</span>
            <a href="#" className="hover:text-blue-600 transition duration-300">Bảo Mật Thông Tin</a>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">&copy; {new Date().getFullYear()} Hỗ Trợ Cai Thuốc Lá. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;