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
            <h3>DƯỢC PHẨM HỖ TRỢ CAI THUỐC LÁ</h3>
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
    </div>
  );
}

export default HomePage;
