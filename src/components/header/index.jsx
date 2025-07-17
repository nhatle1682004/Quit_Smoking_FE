import { useState, useEffect } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "antd";
import logo from "/logo.jpg";
import UserAvatar from "../avatar";
import { logout } from "../../redux/features/userSlice";
import { FaBell, FaMedal } from "react-icons/fa";
import UserProfileDropdown from "../user-profile-dropdown";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };

  /* ---------- MENU DATA ----------- */
  const menuItems = [
    { id: 1, label: "Trang chủ", href: "/" },
    { id: 2, label: "Giới thiệu", href: "/about" },
    { id: 3, label: "Đặt lịch tư vấn chuyên gia", href: "/booking" },
    { id: 4, label: "Công cụ hỗ trợ", href: "/service", hasDropdown: true },
    { id: 5, label: "Gói dịch vụ", href: "/package" },
    { id: 6, label: "Nhật ký", href: "/journal" },
    { id: 7, label: "Tấm gương", href: "/success" },
    { id: 8, label: "Kế hoạch của bạn", href: "/my-plan" },
    { id: 9, label: "Blog", href: "/blog" },
  ];

  const serviceDropdownItems = [
    { id: 1, label: "Lập kế hoạch cai thuốc", href: "/service/quit-plan-free" },
    { id: 2, label: "Theo dõi thủ công", href: "/service/process" },
  ];

  const serviceDropdownMenu = {
    items: serviceDropdownItems.map((item) => ({
      key: item.id,
      label: (
        <button
          onClick={() => navigate(item.href)}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 duration-200"
        >
          {item.label}
        </button>
      ),
    })),
  };
  /* ---------- END MENU DATA ----------- */

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header
        className={`fixed w-full z-50 duration-300 ${
          isScrolled ? "bg-[#3498db] shadow-lg" : "bg-[#3498db]"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* ---------- TOP BAR ---------- */}
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={handleHomeClick}
              className="flex-shrink-0 border-0 bg-transparent p-0"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-18 w-18 rounded-full object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/80x80.png?text=Logo")
                }
              />
            </button>

            {/* Desktop menu */}
            <nav className="hidden md:flex space-x-4 lg:space-x-6">
              {menuItems.map((item) =>
                item.hasDropdown && item.id === 4 ? (
                  // Dropdown chỉ cho "Công cụ hỗ trợ"
                  <Dropdown
                    key={item.id}
                    menu={serviceDropdownMenu}
                    placement="bottomLeft"
                    trigger={["hover"]}
                  >
                    <button className="text-white flex items-center space-x-1 hover:text-gray-200 duration-300">
                      <span>{item.label}</span>
                      <FiChevronDown className="w-4 h-4" />
                    </button>
                  </Dropdown>
                ) : (
                  <button
                    key={item.id}
                    onClick={() =>
                      item.id === 1 ? handleHomeClick() : navigate(item.href)
                    }
                    className="text-white hover:text-gray-200 duration-300"
                  >
                    {item.label}
                  </button>
                )
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {user ? (
                <>
                  {/* Đã bỏ nút Dashboard ở header */}
                  <button
                    onClick={() => navigate("/notifications")}
                    className="relative p-2 rounded-full hover:bg-blue-100"
                    aria-label="Thông báo"
                  >
                    <FaBell className="w-6 h-6 text-white" />
                  </button>
                  <UserProfileDropdown />
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 bg-white text-[#2980b9] rounded-lg hover:bg-gray-100"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 bg-[#f39c12] text-white rounded-lg hover:bg-[#e67e22]"
                  >
                    Đăng Ký
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-[#2980b9] text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
          {/* ---------- END TOP BAR ---------- */}

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden bg-[#2980b9] shadow-lg rounded-lg mt-2 p-4">
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) =>
                  item.hasDropdown ? (
                    /* mobile chỉ xử lý dropdown cho service */
                    <div key={item.id}>
                      <div className="text-white flex items-center justify-between">
                        <span>{item.label}</span>
                        <FiChevronDown className="w-4 h-4" />
                      </div>
                      <div className="ml-4 mt-2 space-y-2">
                        {serviceDropdownItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              navigate(sub.href);
                              toggleMenu();
                            }}
                            className="text-gray-200 hover:text-white text-left w-full"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.id === 1 ? handleHomeClick() : navigate(item.href);
                        toggleMenu();
                      }}
                      className="text-white hover:text-gray-200 text-left"
                    >
                      {item.label}
                    </button>
                  )
                )}

                {user ? (
                  <>
                    {/* Đã bỏ nút Dashboard ở đây */}
                    <div className="flex items-center pt-4 border-t border-[#2573a7]">
                      <UserAvatar fullName={user.username} size={32} />
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        toggleMenu();
                      }}
                      className="text-white hover:text-gray-200 text-left"
                    >
                      Hồ sơ cá nhân
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="text-white hover:text-gray-200 text-left"
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
      {/* spacer */}
      <div className="h-24" />
    </>
  );
};

export default Header;
