import React from 'react';
import { useSelector } from 'react-redux';
import { UserOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const Profile = () => {
    const user = useSelector((state) => state.user);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Hồ Sơ Cá Nhân</h1>
                    <p className="text-gray-600">Thông tin tài khoản của bạn</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Thông tin cá nhân */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông Tin Cá Nhân</h2>

                        <div className="flex items-center space-x-4">
                            <UserOutlined className="text-2xl text-blue-500" />
                            <div>
                                <p className="text-sm text-gray-500">Họ và tên</p>
                                <p className="text-gray-800">{user?.fullName || 'Chưa cập nhật'}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <MailOutlined className="text-2xl text-blue-500" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-800">{user?.email || 'Chưa cập nhật'}</p>
                            </div>
                        </div>


                        <div className="flex items-center space-x-4">
                            <EnvironmentOutlined className="text-2xl text-blue-500" />
                            <div>
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="text-gray-800">{user?.address || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin tài khoản */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông Tin Tài Khoản</h2>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Tên đăng nhập</p>
                                <p className="text-gray-800">{user?.username || 'Chưa cập nhật'}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Ngày tham gia</p>
                                <p className="text-gray-800">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Trạng thái tài khoản</p>
                                <p className="text-green-600 font-medium">Đang hoạt động</p>
                            </div>
                        </div>

                        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 