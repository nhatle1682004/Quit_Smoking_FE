import React from "react";
import "./home.css";
import Slider from "react-slick";
// Import required CSS for the slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import all images
import anhkeo1 from "../../assets/image/anhkeo1.png";
import anhkeo2 from "../../assets/image/anhkeo2.png";
import anhkeo3 from "../../assets/image/anhkeo3.jpg";
import duocPham from "../../assets/image/duocPham.jpg";
import sms from "../../assets/image/sms.jpg";

function HomePage() {
  // Banner images for the carousel
  const bannerImages = [
    {
      id: 1,
      imageUrl: anhkeo1,
      title: "Thông báo",
      description:
        "Chào mừng bạn đến với trang web hỗ trợ cai thuốc lá. Chúng tôi cung cấp các dịch vụ và sản phẩm giúp bạn từ bỏ thuốc lá một cách hiệu quả.",
    },
    {
      id: 2,
      imageUrl: anhkeo2,
      title: "Các lợi ích khi cai thuốc lá",
      description:
        "Cải thiện sức khỏe, tiết kiệm chi phí và nâng cao chất lượng cuộc sống.",
    },
    {
      id: 3,
      imageUrl: anhkeo3,
      title: "Dịch vụ hỗ trợ",
      description:
        "Khám phá các dịch vụ hỗ trợ cai thuốc lá hiệu quả của chúng tôi.",
    },
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
    arrows: true,
  };

  return (
    <div className="homepage">
      {/* Main content */}
      <div className="content-area">
        {/* Replace static notice banner with slider */}
        <div className="banner-carousel">
          <Slider {...sliderSettings}>
            {bannerImages.map((banner) => (
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
              <img src={duocPham} alt="Quitting support products" />
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
              <img src={sms} alt="SMS support service" />
            </div>
            <div className="service-links">
              <a href="#">Giới thiệu</a>
              <a href="#">Đăng ký</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
