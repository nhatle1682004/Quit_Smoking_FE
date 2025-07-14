import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaComments,
  FaAmbulance,
  FaFacebookSquare,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const Footer = () => {


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
          {/* Liên Kết Nhanh */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700">
              Liên Kết Nhanh
            </h3>
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

          {/* Liên Hệ Hỗ Trợ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700">
              Liên Hệ Hỗ Trợ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <FaPhone className="text-blue-600" />
                <span className="text-gray-600">1900-1234</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-600" />
                <span className="text-gray-600">
                  cainghienthuocla64@mail.com
                </span>
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

          {/* Kết Nối Cộng Đồng - Đẹp hơn */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700">
              Kết Nối Cộng Đồng
            </h3>
            <p className="text-gray-600 mb-2">
              Hãy tham gia cộng đồng Facebook của chúng tôi để chia sẻ kinh
              nghiệm, nhận động lực và hỗ trợ từ những người cùng mục tiêu cai
              thuốc lá!
            </p>
            <div className="flex gap-6 justify-center mt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61577279803007&sk=about"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-blue-600 hover:text-blue-800"
              >
                <FaFacebookSquare size={32} />
                <span className="text-xs mt-1">Tham gia nhóm Facebook</span>
              </a>
            </div>
            <p className="text-gray-500 text-sm text-center mt-2">
              Cộng đồng luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành
              trình khỏe mạnh không thuốc lá.
            </p>
          </div>
        </div>

        {/* Phần dưới cùng */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-blue-600 font-medium mb-2">
              Bạn Có Thể Làm Được! Mỗi Ngày Không Hút Thuốc Là Một Chiến Thắng.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Hãy nhớ rằng, bạn không đơn độc trong hành trình này. Chúng tôi
              luôn ở đây để hỗ trợ bạn 24/7.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-600 transition duration-300">
              Chính Sách Bảo Mật
            </a>
            <span>|</span>
            <a href="#" className="hover:text-blue-600 transition duration-300">
              Điều Khoản Sử Dụng
            </a>
            <span>|</span>
            <a href="#" className="hover:text-blue-600 transition duration-300">
              Tuyên Bố Y Tế
            </a>
            <span>|</span>
            <a href="#" className="hover:text-blue-600 transition duration-300">
              Bảo Mật Thông Tin
            </a>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} Hỗ Trợ Cai Thuốc Lá. Bảo lưu mọi
            quyền.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
