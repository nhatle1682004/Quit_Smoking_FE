import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Bỏ import Link
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import logo from "../../assets/image/logo.jpg";

const Header = () => {
  const avatarUrl = "../src/assets/image/avatar.png";

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const user = useSelector((state) => state.user);

  const menuItems = [
    { id: 1, label: "Trang chủ", href: "/" },
    { id: 2, label: "Giới thiệu", href: "/about" },
    { id: 3, label: "Kiến thức chung", href: "/services" },
    { id: 4, label: "Dịch vụ & Sản phẩm", href: "/news" },
    { id: 5, label: "Gương cai thuốc thành công", href: "/news" },
    { id: 6, label: "Liên hệ", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#3498db] shadow-lg" : "bg-[#3498db]"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - sử dụng navigate */}
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate("/")}
                className="border-0 bg-transparent p-0"
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

            {/* Desktop Navigation - sử dụng navigate */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.href)}
                  className="text-white hover:text-gray-200 transition-colors duration-300 bg-transparent border-0"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Auth Buttons or User Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-white hover:text-gray-200"
                  >
                    <span className="mr-2">
                      {user.fullName || "Người dùng"}
                    </span>
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/profile");
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Hồ sơ cá nhân
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-[#2980b9] transition-colors duration-300 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden bg-[#2980b9] shadow-lg rounded-lg mt-2 p-4">
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.href);
                      toggleMenu();
                    }}
                    className="text-white hover:text-gray-200 transition-colors duration-300 text-left bg-transparent border-0"
                  >
                    {item.label}
                  </button>
                ))}

                {user ? (
                  <div className="flex flex-col space-y-4 pt-4 border-t border-[#2573a7]">
                    <div className="flex items-center mb-2">
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <span className="text-white">
                        {user.fullName || "Người dùng"}
                      </span>
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
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4 pt-4 border-t border-[#2573a7]">
                    <button
                      onClick={() => {
                        navigate("/login");
                        toggleMenu();
                      }}
                      className="w-full px-4 py-2 bg-white text-[#2980b9] rounded-lg hover:bg-gray-100 transition-colors duration-300"
                    >
                      Đăng Nhập
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        toggleMenu();
                      }}
                      className="w-full px-4 py-2 bg-[#f39c12] text-white rounded-lg hover:bg-[#e67e22] transition-colors duration-300"
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
