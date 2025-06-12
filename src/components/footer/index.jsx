import React from 'react';


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Về chúng tôi */}

        <div className="footer-column">
          <h3>Về chúng tôi</h3>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/services">Dịch vụ</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>
        
        {/* Cột 3: Liên hệ */}
        <div className="footer-column">
          <h3>Liên hệ</h3>
          <p>Địa chỉ: 123 Đường Sức Khỏe, TP. HCM</p>
          <p>Điện thoại: 0123 456 789</p>
          <p>Email: support@cainghienthuocla.vn</p>
        </div>

        {/* Cột 2: Liên kết nhanh */}




        {/* Cột 4: Gửi câu hỏi */}
        <div className="footer-column">
          <h3>Gửi câu hỏi cho chúng tôi</h3>
          <form className="footer-form">
            <input type="email" placeholder="Email của bạn" required />
            <textarea placeholder="Câu hỏi..." required></textarea>
            <button type="submit">Gửi</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Cai Nghiện Thuốc Lá. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
