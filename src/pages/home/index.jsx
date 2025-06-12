import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import {
  FaCheck,
  FaChartLine,
  FaBell,
  FaUsers,
  FaComment,
  FaMedal,
  FaCalendarAlt,
} from "react-icons/fa";

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
  const navigate = useNavigate();

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

  // Tính năng của nền tảng
  const features = [
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-500" />,
      title: "Theo dõi tiến trình",
      description:
        "Ghi nhận tình trạng hút thuốc hiện tại: số lượng điếu thuốc, tần suất hút, giá tiền thuốc hút",
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8 text-blue-500" />,
      title: "Kế hoạch cai thuốc cá nhân",
      description:
        "Tùy chỉnh lộ trình cai thuốc dựa trên thói quen và mức độ phụ thuộc của bạn",
    },
    {
      icon: <FaBell className="w-8 h-8 text-blue-500" />,
      title: "Thông báo động viên",
      description:
        "Nhận thông báo định kỳ và nhắc nhở để duy trì động lực cai thuốc",
    },
    {
      icon: <FaMedal className="w-8 h-8 text-blue-500" />,
      title: "Thành tích & Phần thưởng",
      description:
        "Mở khóa huy hiệu thành tích khi đạt được mốc không hút thuốc",
    },
    {
      icon: <FaUsers className="w-8 h-8 text-blue-500" />,
      title: "Cộng đồng hỗ trợ",
      description:
        "Chia sẻ thành tích, động viên và nhận lời khuyên từ cộng đồng",
    },
    {
      icon: <FaComment className="w-8 h-8 text-blue-500" />,
      title: "Tư vấn chuyên gia",
      description:
        "Nhận tư vấn trực tuyến từ các huấn luyện viên và chuyên gia y tế",
    },
  ];

  // Câu chuyện thành công
  const successStories = [
    {
      name: "Nguyễn Văn A",
      story:
        "Sau 15 năm hút thuốc, tôi đã cai nghiện thành công nhờ nền tảng này. Sức khỏe cải thiện rõ rệt sau 3 tháng.",
      duration: "Cai thuốc được 6 tháng",
    },
    {
      name: "Trần Thị B",
      story:
        "Tôi đã thử nhiều phương pháp khác nhau nhưng chỉ với hệ thống hỗ trợ này tôi mới thành công. Cảm ơn đội ngũ tư vấn!",
      duration: "Cai thuốc được 1 năm",
    },
    {
      name: "Lê Văn C",
      story:
        "Ứng dụng thông báo và kế hoạch cai thuốc đã giúp tôi từng bước giảm dần sự phụ thuộc vào nicotine một cách dễ dàng.",
      duration: "Cai thuốc được 3 tháng",
    },
  ];

  // FAQ
  const faqs = [
    {
      question: "Cai thuốc lá có khó không?",
      answer:
        "Cai thuốc lá có thể khó khăn vì nicotine gây nghiện mạnh. Tuy nhiên, với sự hỗ trợ đúng cách và quyết tâm, bạn hoàn toàn có thể thành công.",
    },
    {
      question: "Tôi nên bắt đầu cai thuốc như thế nào?",
      answer:
        "Bạn nên bắt đầu bằng việc đăng ký tài khoản trên hệ thống, thiết lập kế hoạch cai thuốc cá nhân và tham khảo tư vấn từ chuyên gia.",
    },
    {
      question: "Các triệu chứng cai thuốc kéo dài bao lâu?",
      answer:
        "Triệu chứng cai thuốc thường kéo dài từ vài ngày đến vài tuần. Triệu chứng nặng nhất thường xuất hiện trong 2-3 ngày đầu và giảm dần sau đó.",
    },
    {
      question: "Ứng dụng hỗ trợ cai thuốc có tính phí không?",
      answer:
        "Chúng tôi cung cấp phiên bản miễn phí với các tính năng cơ bản và phiên bản premium với nhiều tính năng nâng cao. Bạn có thể dùng thử miễn phí trước khi quyết định nâng cấp.",
    },
  ];

  return (
    <div className="homepage bg-gray-50">
      {/* Hero Section với Banner Slider - Cải tiến */}
      <section className="relative overflow-hidden">
        <div className="banner-carousel">
          <Slider {...sliderSettings}>
            {bannerImages.map((banner) => (
              <div key={banner.id} className="relative h-[500px] md:h-[600px]">
                {/* Layer 1: Ảnh nền */}
                <div className="absolute inset-0">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Layer 2: Gradient overlay thay vì chỉ màu đen mờ */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>

                {/* Layer 3: Nội dung */}
                <div className="absolute inset-0 container mx-auto px-6">
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="max-w-3xl text-center">
                      {/* Badge gây chú ý */}
                      <span className="inline-block bg-[#3498db] text-white text-sm px-3 py-1 rounded-full mb-3 shadow-lg animate-pulse">
                        Quit Smoking Support
                      </span>

                      {/* Tiêu đề với hiệu ứng */}
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg transform transition-transform animate-fadeIn">
                        {banner.title}
                      </h1>

                      {/* Mô tả với box shadow và padding */}
                      <p className="text-lg md:text-xl mb-8 text-gray-100 bg-black/20 p-4 rounded-lg backdrop-blur-sm shadow-inner">
                        {banner.description}
                      </p>

                      {/* Nút CTA có glow effect khi hover */}
                      <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                          onClick={() => navigate("/register")}
                          className="px-8 py-3 bg-[#3498db] hover:bg-[#2980b9] text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#3498db]/50 hover:-translate-y-0.5"
                        >
                          Đăng Ký Ngay
                        </button>
                        <button
                          onClick={() => navigate("/about")}
                          className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#3498db] transition-all duration-300 shadow-lg hover:-translate-y-0.5"
                        >
                          Tìm Hiểu Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 4: Trang trí - điểm nhấn hình tròn tạo chiều sâu */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#3498db]/20 blur-xl"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#3498db]/20 blur-xl"></div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Thêm đường cong phía dưới banner */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 text-gray-50"
            fill="currentColor"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V100C0,67.23,91.18,56.44,150,47.48,222.19,36.5,280.09,63.84,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Giới thiệu về nền tảng */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Nền Tảng Hỗ Trợ Cai Nghiện Thuốc Lá
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp một hệ thống toàn diện giúp bạn từ bỏ thói quen
              hút thuốc một cách hiệu quả. Với công nghệ tiên tiến và sự hỗ trợ
              từ chuyên gia, hành trình cai thuốc của bạn sẽ trở nên dễ dàng
              hơn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dịch vụ hỗ trợ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dịch Vụ Hỗ Trợ</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Khám phá các dịch vụ và sản phẩm của chúng tôi giúp hỗ trợ hành
              trình cai thuốc lá của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <h3 className="text-2xl font-bold mb-4 text-[#3498db]">
                DƯỢC PHẨM HỖ TRỢ CAI THUỐC LÁ
              </h3>
              <div className="mb-4 h-64 overflow-hidden rounded-lg">
                <img
                  src={duocPham}
                  alt="Dược phẩm hỗ trợ"
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <p className="text-gray-600 mb-4">
                Các sản phẩm dược phẩm an toàn và hiệu quả giúp giảm thiểu triệu
                chứng cai nicotine và tăng khả năng thành công.
              </p>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-[#3498db] hover:text-[#2980b9] font-medium"
                >
                  • Liệu pháp thay thế nicotine (NRT)
                </a>
                <a
                  href="#"
                  className="block text-[#3498db] hover:text-[#2980b9] font-medium"
                >
                  • Dược phẩm không chứa nicotine
                </a>
                <a
                  href="#"
                  className="block text-[#3498db] hover:text-[#2980b9] font-medium"
                >
                  • Kẹo cao su và miếng dán nicotine
                </a>
              </div>
              <button
                className="mt-6 px-6 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
                onClick={() => navigate("/services")}
              >
                Xem chi tiết
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <h3 className="text-2xl font-bold mb-4 text-[#3498db]">
                DỊCH VỤ HỖ TRỢ CAI THUỐC LÁ
              </h3>
              <div className="mb-4 h-64 overflow-hidden rounded-lg">
                <img
                  src={sms}
                  alt="Dịch vụ hỗ trợ"
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <p className="text-gray-600 mb-4">
                Các dịch vụ hỗ trợ trực tuyến và trực tiếp từ đội ngũ chuyên gia
                giúp bạn duy trì động lực cai thuốc.
              </p>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-[#3498db] hover:text-[#2980b9] font-medium"
                >
                  • Tư vấn trực tuyến với chuyên gia
                </a>
                <a
                  href="#"
                  className="block text-[#3498db] hover:text-[#2980b9] font-medium"
                >
                  • Dịch vụ nhắc nhở qua tin nhắn SMS
                </a>
                <a
                  href="#"
                  className="block text-[#3498db] hover:text-[#2980b9] font-medium"
                >
                  • Nhóm hỗ trợ trực tuyến 24/7
                </a>
              </div>
              <button
                className="mt-6 px-6 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
                onClick={() => navigate("/services")}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Câu chuyện thành công */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu Chuyện Thành Công</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hàng nghìn người đã thành công cai thuốc lá với sự hỗ trợ của
              chúng tôi. Đây là một số câu chuyện từ họ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#3498db] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {story.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">{story.name}</h3>
                    <p className="text-sm text-[#3498db]">{story.duration}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{story.story}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              className="px-8 py-3 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
              onClick={() => navigate("/success-stories")}
            >
              Xem Thêm Câu Chuyện
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu Hỏi Thường Gặp</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dưới đây là một số câu hỏi thường gặp về việc cai thuốc lá và dịch
              vụ của chúng tôi.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 bg-white rounded-lg shadow-sm">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer p-4 hover:bg-gray-50">
                    <span>{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="p-4 pt-0 text-gray-600">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              className="px-8 py-3 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
              onClick={() => navigate("/faqs")}
            >
              Xem Thêm FAQ
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#3498db]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bắt đầu hành trình cai thuốc lá ngay hôm nay
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto mb-8">
            Đăng ký tài khoản miễn phí và khám phá các công cụ hỗ trợ giúp bạn
            cai thuốc lá thành công.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-white text-[#3498db] font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Đăng Ký Ngay
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Đăng Nhập
            </button>
          </div>
        </div>
      </section>

      {/* Thống kê */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-[#3498db] mb-2">
                10,000+
              </div>
              <p className="text-gray-600">Người dùng đã đăng ký</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#3498db] mb-2">75%</div>
              <p className="text-gray-600">Tỷ lệ thành công cai thuốc</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#3498db] mb-2">50+</div>
              <p className="text-gray-600">Chuyên gia y tế</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#3498db] mb-2">
                1,000,000+
              </div>
              <p className="text-gray-600">Điếu thuốc đã bỏ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

/* Thêm CSS global để hỗ trợ các hiệu ứng */
<style jsx global>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  /* Tùy chỉnh hiệu ứng dots của slider */
  .slick-dots li button:before {
    font-size: 12px;
    color: white;
    opacity: 0.5;
  }

  .slick-dots li.slick-active button:before {
    color: white;
    opacity: 1;
  }

  /* Hiệu ứng glow cho nút */
  .slick-prev,
  .slick-next {
    background: rgba(255, 255, 255, 0.3) !important;
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    transition: all 0.3s ease !important;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background: rgba(255, 255, 255, 0.5) !important;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5) !important;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 24px !important;
  }
`}</style>;
