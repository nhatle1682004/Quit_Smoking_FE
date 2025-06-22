import React from "react";
import { FaEnvelope, FaPhone, FaCommentDots } from "react-icons/fa";

const ContactPage = () => {
  const chatOptions = [
    {
      title: "Tư vấn trực tiếp",
      description: "Trò chuyện với chuyên gia hỗ trợ bỏ thuốc lá",
      icon: <FaCommentDots />,
      buttonText: "Bắt đầu tư vấn",
      action: () =>
        window.open(
          "https://www.facebook.com/profile.php?id=61577279803007&sk=about",
          "_blank"
        ),
    },
    {
      title: "Gửi email cho chúng tôi",
      description: "Hãy để lại thông tin, chúng tôi sẽ phản hồi sớm nhất",
      icon: <FaEnvelope />,
      buttonText: "Gửi email",
      action: () =>
        (window.location.href =
          "mailto:tanhdangne306@gmail.com?subject=Tư vấn cai thuốc lá&body=Xin chào, tôi muốn được tư vấn về cách cai thuốc lá."),
    },
    {
      title: "Gọi điện hỗ trợ",
      description: "Tổng đài hoạt động 24/7 để hỗ trợ bạn bỏ thuốc",
      icon: <FaPhone />,
      buttonText: "Gọi ngay",
      action: () => (window.location.href = "tel:+84828063463"),
    },
  ];

  return (
    <main className="p-4 bg-[#fffdfa]">
      <h1 className="text-4xl mb-4 font-bold text-center">
        <span className="text-orange-500">Bỏ thuốc</span> không đơn độc, chúng
        tôi luôn sẵn sàng hỗ trợ bạn
      </h1>
      <p className="mb-8 text-center">
        Gặp khó khăn trong quá trình cai thuốc? Hãy liên hệ với chúng tôi để
        được tư vấn, hỗ trợ và đồng hành.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {chatOptions.map((option) => (
          <div
            key={option.title}
            className="p-6 shadow-lg rounded-lg flex flex-col items-center bg-white"
          >
            <div className="text-4xl text-orange-400 mb-4">{option.icon}</div>
            <h2 className="text-xl font-semibold mb-2 text-center">
              {option.title}
            </h2>
            <p className="text-center">{option.description}</p>
            <button
              onClick={option.action}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded py-2 px-4 transition duration-300"
            >
              {option.buttonText}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-20 text-center text-gray-700 max-w-2xl mx-auto">
        Chúng tôi cam kết đồng hành cùng bạn trong suốt hành trình bỏ thuốc.
        Đừng ngần ngại chia sẻ – vì sức khỏe của bạn và người thân.
      </p>
    </main>
  );
};

export default ContactPage;
