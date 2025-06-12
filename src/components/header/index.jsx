import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.jpg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { id: 1, label: "Trang chủ", href: "/" },
    { id: 2, label: "Giới thiệu", href: "/about" },
    { id: 3, label: "Kiến thức chung", href: "/services" },
    { id: 4, label: "Dịch vụ & Sản phẩm", href: "/news" },
    { id: 5, label: "Gương cai thuốc thành công", href: "/news" },
    { id: 6, label: "Liên hệ", href: "/contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#990e53] shadow-lg" : "bg-[#990e53]"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 ">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-18 w-18 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3";
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="text-white hover:text-gray-200 transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 bg-white  text-[#b71c1c] rounded-lg hover:bg-gray-100 transition-colors duration-300">
              Đăng Nhập
            </Link>
            <Link to="/register" className="px-4 py-2 bg-white text-[#b71c1c] rounded-lg hover:bg-gray-100 transition-colors duration-300">
              Đăng Ký
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-[#8f1616] transition-colors duration-300 text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-[#b71c1c] shadow-lg rounded-lg mt-2 p-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className="text-white hover:text-gray-200 transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-4 pt-4 border-t border-[#8f1616]">
                <Link to="/login" className="w-full px-4 py-2 text-white hover:text-gray-200 transition-colors duration-300">
                  Đăng Nhập
                </Link>
                <Link to="/register" className="w-full px-4 py-2 bg-white text-[#b71c1c] rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  Đăng Ký
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;