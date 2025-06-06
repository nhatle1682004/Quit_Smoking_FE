import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Slider from "react-slick";
// Import required CSS for the slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import all images
import logoImage from "../../assets/image/logo.jpg";
import anhkeo1 from "../../assets/image/anhkeo1.png";
import anhkeo2 from "../../assets/image/anhkeo2.png";
import anhkeo3 from "../../assets/image/anhkeo3.jpg";


function HomePage() {
  const user = useSelector((state) => state.user);
  const [activeItem, setActiveItem] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const menuItems = [
    { name: "VỀ CHÚNG TÔI", path: "/about-us" },
    { name: "KIẾN THỨC CHUNG", path: "/general-knowledge" },
    { name: "HƯỚNG DẪN CAI THUỐC", path: "/quitting-guide" },
    { name: "DỊCH VỤ & SẢN PHẨM", path: "/services-products" },
    { name: "CÔNG CỤ HỖ TRỢ CAI THUỐC LÁ", path: "/quit-smoking-tools" },
    { name: "DÀNH CHO CÁN BỘ Y TẾ", path: "/for-health-professionals" },
    { name: "GƯƠNG CAI THUỐC THÀNH CÔNG", path: "/success-stories" },
  ];

  const handleMenuItemClick = (index) => {
    setActiveItem(index);
    navigate(menuItems[index].path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Banner images for the carousel
  const bannerImages = [
    {
      id: 1,
      imageUrl: anhkeo1,
      title: "Thông báo",
      description: "Chào mừng bạn đến với trang web hỗ trợ cai thuốc lá. Chúng tôi cung cấp các dịch vụ và sản phẩm giúp bạn từ bỏ thuốc lá một cách hiệu quả."
    },
    {
      id: 2,
      imageUrl: anhkeo2,
      title: "Các lợi ích khi cai thuốc lá",
      description: "Cải thiện sức khỏe, tiết kiệm chi phí và nâng cao chất lượng cuộc sống."
    },
    {
      id: 3,
      imageUrl: anhkeo3,
      title: "Dịch vụ hỗ trợ",
      description: "Khám phá các dịch vụ hỗ trợ cai thuốc lá hiệu quả của chúng tôi."
    }
  ];

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true
  };

  return (
    <div className="homepage">
      {/* Header section */}
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <a href="/" onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}>
              <img src={logoImage} alt="Quit Smoking Logo" className="logo" />
            </a>
          </div>
          
          <div className="header-right">
            {/* <div className="contact-icon">
              <i className="phone-icon"></i>
            </div> */}
            

            
            <div className="search-container">
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Từ khóa..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">Tìm kiếm</button>
              </form>
            </div>
            
            <div className="auth-language-container">
              <div className="auth-buttons">
                <button onClick={handleLoginClick} className="auth-btn login-btn">Đăng nhập</button>
                <button onClick={handleRegisterClick} className="auth-btn register-auth-btn">Đăng ký</button>
              </div>
              <div className="language-selector">
                <a href="#" className="flag vn-flag"></a>
                <a href="#" className="flag en-flag"></a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main navigation - updated with clickable items */}
      <nav className="main-navbar">
        <ul className="nav-menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`nav-item ${activeItem === index ? "active" : ""}`}
              onClick={() => handleMenuItemClick(index)}
            >
              <button className="nav-button">{item.name}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <div className="content-area">
        {/* Replace static notice banner with slider */}
        <div className="banner-carousel">
          <Slider {...sliderSettings}>
            {bannerImages.map(banner => (
              <div key={banner.id} className="banner-slide">
                <div 
                  className="banner-content" 
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                >
                  <div className="banner-text">
                    <h1>{banner.title}</h1>
                    <p>{banner.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        
        {/* Service sections */}
        <div className="services-section">
          <div className="service-block">
            <div className="service-icon support-icon"></div>
            <h3>DƯỢC PHẨM HỖ TRỢ CAI THUỐC LÁ AN TOÀN VÀ HIỆU QUẢ</h3>
            <div className="service-image">
              <img src="https://via.placeholder.com/300x200" alt="Quitting support products" />
            </div>
            <div className="service-links">
              <a href="#">Liệu pháp thay thế nicotine (NRT)</a>
              <a href="#">Dược phẩm không chứa nicotine</a>
            </div>
          </div>
          
          <div className="service-block">
            <div className="service-icon sms-icon"></div>
            <h3>DỊCH VỤ HỖ TRỢ CAI THUỐC LÁ QUA TIN NHẮN</h3>
            <div className="service-image">
              <img src="https://via.placeholder.com/300x200" alt="SMS support service" />
            </div>
            <div className="service-links">
              <a href="#">Giới thiệu</a>
              <a href="#">Đăng ký</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer would go here */}

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Liên kết nhanh</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Trang chủ</a></li>
              <li><a href="/about-us" className="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="/services-products" className="hover:text-white transition-colors">Dịch vụ & Sản phẩm</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3">Liên hệ</h3>
            <p className="text-gray-300 text-sm">
              Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM <br />
              Điện thoại: 0123 456 789 <br />
              Email: cainghienthuocla64@gmail.com
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-3">Liên Hệ Với Chúng Tôi</h3>
            <form className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full px-3 py-2 bg-gray-800 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-3 py-2 bg-gray-800 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="Nội dung tin nhắn"
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-800 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Quit Smoking Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
