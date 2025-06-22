import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ManOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { updateUser } from "../../../redux/features/userSlice"; // Cần tạo action này trong userSlice

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    gender: user?.gender || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gọi API để cập nhật thông tin người dùng
      // const response = await updateUserAPI(formData);

      // Nếu thành công, cập nhật thông tin trong Redux
      dispatch(updateUser(formData));

      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      message.error("Mật khẩu mới không khớp");
      setIsLoading(false);
      return;
    }

    try {
      // Gọi API để đổi mật khẩu
      // const response = await changePasswordAPI({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword,
      // });

      message.success("Đổi mật khẩu thành công!");
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      message.error("Có lỗi xảy ra khi đổi mật khẩu");
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      gender: user?.gender || "",
    });
    setIsEditing(false);
  };

  const cancelPasswordChange = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hồ Sơ Cá Nhân
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? "Chỉnh sửa thông tin của bạn"
              : showPasswordForm
              ? "Đổi mật khẩu của bạn"
              : "Thông tin tài khoản của bạn"}
          </p>
        </div>

        {showPasswordForm ? (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Đổi Mật Khẩu
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength="6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength="6"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:bg-blue-300"
                >
                  {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                </button>
                <button
                  type="button"
                  onClick={cancelPasswordChange}
                  disabled={isLoading}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Thông tin cá nhân */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Thông Tin Cá Nhân
              </h2>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <UserOutlined className="text-2xl text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Họ và tên</p>
                      <p className="text-gray-800">
                        {user?.fullName || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <MailOutlined className="text-2xl text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">
                        {user?.email || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <ManOutlined className="text-2xl text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Giới tính</p>
                      <p className="text-gray-800">
                        {user?.gender || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Thông tin tài khoản */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Thông Tin Tài Khoản
              </h2>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Tên đăng nhập</p>
                  <p className="text-gray-800">
                    {user?.username || "Chưa cập nhật"}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Ngày tham gia</p>
                  <p className="text-gray-800">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Trạng thái tài khoản</p>
                  <p className="text-green-600 font-medium">Đang hoạt động</p>
                </div>
              </div>

              {isEditing ? (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:bg-blue-300"
                  >
                    {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={isLoading}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Chỉnh sửa thông tin
                  </button>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full mt-4 border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                  >
                    Đổi mật khẩu
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
