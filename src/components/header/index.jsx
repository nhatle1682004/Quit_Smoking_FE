import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/image/logo.jpg";
import UserAvatar from "../avatar"; // avatar user
import { logout } from "../../redux/features/userSlice"; // dropdown tách riêng
import UserProfileDropdown from "../user-profile-dropdown";
import { FaBell, FaMedal } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };

  const menuItems = [
    { id: 1, label: "Trang chủ", href: "/" },
    { id: 2, label: "Giới thiệu", href: "/about" },

    { id: 3, label: "Đặt lịch tư vấn chuyên gia", href: "/knowledge" },
    { id: 4, label: "Dịch vụ", href: "/service" },
    { id: 5, label: "Nhật ký", href: "/journal" },
    { id: 6, label: "Tấm gương", href: "/success" },
    { id: 7, label: "Kế hoạch của bạn", href: "/plan" },
    { id: 8, label: "Blog", href: "/blog" },
    { id: 9, label: "Liên hệ", href: "/contact" },

  ];


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#3498db] shadow-lg" : "bg-[#3498db]"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={handleHomeClick}
                className="cursor-pointer border-0 bg-transparent p-0"
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="h-18 w-18 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://png.pngtree.com/png-clipart/20190904/original/pngtree-user-cartoon-avatar-pattern-flat-avatar-png-image_4492883.jpg";
                  }}
                />
              </button>
            </div>

            {/* Desktop menu */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    item.id === 1 ? handleHomeClick() : navigate(item.href)
                  }
                  className="cursor-pointer text-white hover:text-gray-200 transition-colors duration-300 bg-transparent border-0"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right side: login / user */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => navigate("/achievements")}
                    className="relative p-2 rounded-full hover:bg-yellow-100 transition-colors"
                    aria-label="Thành tích"
                  >
                    <FaMedal className="w-6 h-6 text-yellow-400" />
                  </button>
                  <button
                    onClick={() => navigate("/notifications")}
                    className="relative p-2 rounded-full hover:bg-blue-100 transition-colors"
                    aria-label="Thông báo"
                  >
                    <FaBell className="w-6 h-6 text-white" />
                    {/* Có thể thêm chấm đỏ nếu có thông báo mới */}
                  </button>
                  <UserProfileDropdown
                    user={user}
                    showDropdown={showDropdown}
                    toggleDropdown={toggleDropdown}
                    dropdownRef={dropdownRef}
                    handleLogout={handleLogout}
                    navigate={navigate}
                  />
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 bg-white text-[#2980b9] rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 bg-[#f39c12] text-white rounded-lg hover:bg-[#e67e22] transition-colors duration-300"
                  >
                    Đăng Ký
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-[#2980b9] transition-colors duration-300 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden bg-[#2980b9] shadow-lg rounded-lg mt-2 p-4">
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.id === 1 ? handleHomeClick() : navigate(item.href);
                      toggleMenu();
                    }}
                    className="text-white hover:text-gray-200 transition-colors duration-300 text-left bg-transparent border-0"
                  >
                    {item.label}
                  </button>
                ))}
                {user ? (
                  <>
                    <div className="flex items-center pt-4 border-t border-[#2573a7]">
                      <UserAvatar fullName={user.username} size={32} />
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        toggleMenu();
                      }}
                      className="text-white hover:text-gray-200 transition-colors duration-300 text-left bg-transparent border-0"
                    >
                      Hồ sơ cá nhân
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="text-left text-white hover:text-gray-200 transition-colors duration-300 bg-transparent border-0"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-4 pt-4 border-t border-[#2573a7]">
                    <button
                      onClick={() => {
                        navigate("/login");
                        toggleMenu();
                      }}
                      className="w-full px-4 py-2 bg-white text-[#2980b9] rounded-lg hover:bg-gray-100"
                    >
                      Đăng Nhập
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        toggleMenu();
                      }}
                      className="w-full px-4 py-2 bg-[#f39c12] text-white rounded-lg hover:bg-[#e67e22]"
                    >
                      Đăng Ký
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      <div className="h-24"></div>
    </>
  );
};

export default Header;
