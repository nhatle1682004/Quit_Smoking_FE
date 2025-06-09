// src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import logo from '../assets/image/logo.jpg';

const Header = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const menuItems = [
    { name: "VỀ CHÚNG TÔI", path: "/about-us" },
    { name: "KIẾN THỨC CHUNG", path: "/general-knowledge" },
    { name: "HƯỚNG DẪN CAI THUỐC", path: "/quitting-guide" },
    { name: "DỊCH VỤ & SẢN PHẨM", path: "/services-products" },
    { name: "CÔNG CỤ HỖ TRỢ CAI THUỐC LÁ", path: "/quit-smoking-tools" },
    { name: "DÀNH CHO CÁN BỘ Y TẾ", path: "/for-health-professionals" },
    { name: "GƯƠNG CAI THUỐC THÀNH CÔNG", path: "/success-stories" }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="header-right">
          <div className="search-container">
            <form>
              <input type="text" placeholder="Tìm kiếm..." />
              <button type="submit" className="search-btn">Tìm kiếm</button>
            </form>
          </div>
          <div className="auth-language-container">
            <div className="auth-buttons">
              <button className="auth-btn login-btn">Đăng nhập</button>
              <button onClick={handleRegisterClick} className="auth-btn register-auth-btn">Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
      <nav className="main-navbar">
        <ul className="nav-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link to={item.path} className="nav-button">{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
