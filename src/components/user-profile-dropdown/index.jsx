// src/components/UserProfileDropdown.js
import React from 'react';
import { Dropdown, Avatar, Divider, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  CreditCardOutlined, 
  SettingOutlined, 
  FileTextOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice';

const { Text, Title } = Typography;

// Hàm tạo avatar từ tên người dùng
const generateAvatarFromName = (name) => {
  if (!name) return 'U';
  
  // Tách tên thành các từ
  const words = name.trim().split(' ');
  
  // Lấy chữ cái đầu của từ cuối cùng
  if (words.length > 0) {
    return words[words.length - 1][0].toUpperCase();
  }
  
  return 'U';
};

// Hàm tạo màu nền cho avatar
const generateAvatarColor = (name) => {
  if (!name) return '#1890ff';
  
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae',
    '#87d068', '#1890ff', '#722ed1', '#eb2f96',
    '#fa8c16', '#52c41a', '#13c2c2', '#2f54eb'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const UserProfileDropdown = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Lấy thông tin user từ Redux store
  const user = useSelector((state) => state.user);
  
  // Tạo avatar từ tên người dùng
  const avatarText = generateAvatarFromName(user?.username || 'User');
  const avatarColor = generateAvatarColor(user?.username || 'User');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'schedule':
        navigate('/schedule');
        break;
      case 'my-package':
        navigate('/my-package');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'terms':
        navigate('/terms');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
    
    // Gọi callback nếu có
    if (onMenuClick) {
      onMenuClick(key);
    }
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined style={{ fontSize: '20px', color: '#222' }} />,
      label: 'Trang cá nhân',
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined style={{ fontSize: '20px', color: '#222' }} />,
      label: 'Lịch huấn luyện viên',
    },
    {
      key: 'my-package',
      icon: <CreditCardOutlined style={{ fontSize: '20px', color: '#222' }} />,
      label: 'Gói của tôi',
    },
    {
      key: 'settings',
      icon: <SettingOutlined style={{ fontSize: '20px', color: '#222' }} />,
      label: 'Cài đặt & Bảo mật',
    },
    {
      key: 'terms',
      icon: <FileTextOutlined style={{ fontSize: '20px', color: '#222' }} />,
      label: 'Chính sách & Điều khoản',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ fontSize: '20px' }} />,
      label: <span className="text-red-500">Đăng xuất</span>,
      danger: true, // AntD sẽ tự động thêm style màu đỏ
    },
  ];

  const menu = (
    <div 
      className="w-full sm:w-[300px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
    >
      {/* Phần Header của Dropdown */}
      <div className="p-4 border-b border-gray-200">
        <Space>
          <Avatar 
            size={40} 
            style={{ 
              backgroundColor: avatarColor,
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            {avatarText}
          </Avatar>
          <div>
            <Title level={5} className="!mb-0">{user?.fullName || user?.name || 'User'}</Title>
            <Text type="secondary">
              Gói Miễn Phí
            </Text>
          </div>
        </Space>
      </div>
      
      {/* Các mục Menu */}
      <ul className="py-2">
        {menuItems.map(item => 
          item.type === 'divider' ? (
            <Divider key="divider" className="my-1" />
          ) : (
            <li 
              key={item.key}
              onClick={() => handleMenuClick(item.key)}
              className="flex items-center gap-4 px-4 py-3 text-base text-[#222] cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <a onClick={(e) => e.preventDefault()} className="flex items-center gap-2 cursor-pointer">
        <Avatar 
          size={40} 
          style={{ 
            backgroundColor: avatarColor,
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          {avatarText}
        </Avatar>
        <span className="font-semibold hidden sm:inline text-white">{user?.fullName || user?.name || 'User'}</span>
      </a>
    </Dropdown>
  );
};

export default UserProfileDropdown;