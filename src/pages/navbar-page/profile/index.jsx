import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  Button,
  Card,
  Collapse,
  Typography,
  Space,
  Divider,
  Modal,
  Tabs,
  InputNumber,
} from "antd";
import api from "../../../configs/axios";
import dayjs from "dayjs";

// Redux action giả định, bạn cần import đúng file action của bạn
// import { updateUser } from "../../../store/actions/userActions";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingSmoking, setEditingSmoking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayPrice, setDisplayPrice] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy user từ redux (giả định bạn đã lưu user trong redux store)
  const user = useSelector((state) => state.user?.user);

  const [personalForm] = Form.useForm();
  const [smokingForm] = Form.useForm();

  // Lấy dữ liệu profile
  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const userResponse = await api.get("/user/me");
      const userData = userResponse.data;
      setProfileData(userData);

      // Setup form
      personalForm.setFieldsValue({
        fullName: userData.fullName,
        email: userData.email,
        gender: userData.gender,
        username: userData.username,
      });

      // Lấy thông tin hút thuốc
      const smokingResponse = await api.get("/initial-condition");
      const smokingData = smokingResponse.data;

      smokingForm.setFieldsValue({
        ageStarted: smokingData.ageStarted,
        reasonStartedSmoking: smokingData.reasonStartedSmoking,
        cigarettesPerDay: smokingData.cigarettesPerDay,
        firstSmokeTimeOfDay: smokingData.firstSmokeTimeOfDay,
        hasTriedToQuit: smokingData.hasTriedToQuit,
        hasHealthIssues: smokingData.hasHealthIssues,
        quitReason: smokingData.quitReason,
        quitStartDate: smokingData.quitStartDate
          ? dayjs(smokingData.quitStartDate)
          : null,
        pricePerCigarette: smokingData.pricePerCigarette,
        cigarettesPerPack: smokingData.cigarettesPerPack,
        weight: smokingData.weight,
      });

      if (smokingData.pricePerCigarette) {
        setDisplayPrice(
          Number(smokingData.pricePerCigarette).toLocaleString("vi-VN")
        );
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Không thể tải thông tin profile");
    } finally {
      setLoading(false);
    }
  }, [personalForm, smokingForm]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfileData();
  }, [user, navigate, fetchProfileData]);

  /* ----------- Submit handlers ----------- */
  const handleSaveUser = async () => {
    try {
      const values = await personalForm.validateFields();
      // Chỉ cập nhật những trường được phép
      const userDataToUpdate = {
        fullName: values.fullName,
        gender: values.gender,
      };
      await api.put("/user/me", userDataToUpdate);

      // Cập nhật lại redux (nếu có)
      // dispatch(updateUser(userDataToUpdate));

      setEditingPersonal(false);
      toast.success("Cập nhật thông tin cá nhân thành công!");
      fetchProfileData();
    } catch (error) {
      if (error.errorFields) {
        toast.error("Vui lòng kiểm tra và điền đúng các trường bắt buộc.");
      } else {
        console.error("Error updating user:", error);
        toast.error("Cập nhật thất bại!");
      }
    }
  };

  const handleUserSubmit = () => {
    Modal.confirm({
      title: "Xác nhận cập nhật thông tin cá nhân?",
      content: "Bạn có chắc chắn muốn lưu các thay đổi này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: handleSaveUser,
    });
  };

  const handleSaveSmoking = async () => {
    try {
      const values = await smokingForm.validateFields();
      await api.put("/initial-condition", values);
      toast.success("Cập nhật thông tin hút thuốc thành công!");
      setEditingSmoking(false);
      fetchProfileData();
    } catch (error) {
      if (error.errorFields) {
        toast.error("Vui lòng kiểm tra và điền đúng các trường bắt buộc.");
      } else {
        console.error("Error updating smoking info:", error);
        toast.error("Cập nhật thất bại!");
      }
    }
  };

  // Xử lý giá nhập vào
  const handlePriceChange = (e) => {
    const { value } = e.target;
    const numeric = value.replace(/[^\d]/g, "");
    setDisplayPrice(numeric ? Number(numeric).toLocaleString("vi-VN") : "");
    smokingForm.setFieldValue("pricePerCigarette", numeric);
  };

  const handlePriceBlur = () => {
    const price = smokingForm.getFieldValue("pricePerCigarette");
    if (!price) {
      setDisplayPrice("");
      return;
    }
    const numPrice = Number(price);
    if (!isNaN(numPrice) && numPrice > 0) {
      setDisplayPrice(numPrice.toLocaleString("vi-VN"));
    }
  };

  const handlePriceFocus = () => {
    const price = smokingForm.getFieldValue("pricePerCigarette");
    setDisplayPrice(price ? Number(price).toLocaleString("vi-VN") : "");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Title level={2} className="!mb-0">
              Thông tin tài khoản
            </Title>
          </div>
          <Collapse defaultActiveKey={["personal"]} ghost>
            <Panel
              header={
                <Title level={4} className="!mb-0">
                  Thông tin cá nhân
                </Title>
              }
              key="personal"
            >
              <Card>
                <Form form={personalForm} layout="vertical" disabled={!editingPersonal}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="fullName"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ và tên!" },
                      ]}
                    >
                      <Input placeholder="Nhập họ tên" />
                    </Form.Item>
                    <Form.Item
                      name="gender"
                      rules={[
                        { required: true, message: "Vui lòng chọn giới tính!" },
                      ]}
                    >
                      <Select placeholder="Chọn giới tính">
                        <Option value="MALE">Nam</Option>
                        <Option value="FEMALE">Nữ</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                      <Input disabled placeholder="Email" />
                    </Form.Item>
                    <Form.Item label="Tên đăng nhập" name="username">
                      <Input disabled placeholder="Tên đăng nhập" />
                    </Form.Item>
                  </div>
                  {profileData?.premium !== undefined && (
                    <>
                      <Divider />
                      <div className="flex items-center space-x-2">
                        <Text strong>Trạng thái tài khoản:</Text>
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            profileData.premium
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {profileData.premium ? "Premium" : "Miễn phí"}
                        </span>
                      </div>
                    </>
                  )}
                  <Divider />
                  <div className="flex justify-end space-x-4">
                    {editingPersonal ? (
                      <>
                        <Button type="primary" onClick={handleUserSubmit}>
                          Lưu
                        </Button>
                        <Button
                          onClick={() => {
                            personalForm.setFieldsValue({
                              fullName: profileData.fullName,
                              email: profileData.email,
                              gender: profileData.gender,
                              username: profileData.username,
                            });
                            setEditingPersonal(false);
                          }}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => setEditingPersonal(true)}
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </Form>
              </Card>
            </Panel>
            <Panel
              header={
                <Title level={4} className="!mb-0">
                  Thông tin hút thuốc
                </Title>
              }
              key="smoking"
            >
              <Card>
                <Form
                  form={smokingForm}
                  layout="vertical"
                  disabled={!editingSmoking}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cơ bản */}
                    <div>
                      <Title level={5}>Thông tin cơ bản</Title>
                      <Form.Item
                        label="Tuổi bắt đầu hút thuốc"
                        name="ageStarted"
                        rules={[
                          { required: true, message: "Bắt buộc" },
                          {
                            validator: (_, value) => {
                              const numValue = Number(value);
                              if (isNaN(numValue)) {
                                return Promise.reject(
                                  new Error("Tuổi phải là số")
                                );
                              }
                              if (numValue < 10) {
                                return Promise.reject(
                                  new Error(
                                    "Tuổi bắt đầu hút thuốc phải từ 10 tuổi trở lên"
                                  )
                                );
                              }
                              if (numValue > 80) {
                                return Promise.reject(
                                  new Error(
                                    "Tuổi bắt đầu hút thuốc không hợp lệ"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <InputNumber min={10} max={80} style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        label="Lý do bắt đầu hút thuốc"
                        name="reasonStartedSmoking"
                        rules={[
                          { required: true, message: "Bắt buộc" },
                          { min: 5, message: "Phải nhập ít nhất 5 ký tự" },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Cân nặng (kg)"
                        name="weight"
                        rules={[
                          { required: true, message: "Bắt buộc nhập cân nặng" },
                          {
                            validator: (_, value) => {
                              if (!value || isNaN(Number(value))) {
                                return Promise.reject(
                                  new Error("Cân nặng phải là số")
                                );
                              }
                              if (value <= 20) {
                                return Promise.reject(
                                  new Error("Cân nặng phải lớn hơn 20kg")
                                );
                              }
                              if (value >= 300) {
                                return Promise.reject(
                                  new Error("Cân nặng phải nhỏ hơn 300kg")
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <InputNumber min={21} max={299} style={{ width: "100%" }} />
                      </Form.Item>
                    </div>
                    {/* Hút thuốc hiện tại */}
                    <div>
                      <Title level={5}>Thông tin hút thuốc</Title>
                      <Form.Item
                        label="Số điếu/ngày"
                        name="cigarettesPerDay"
                        rules={[
                          { required: true, message: "Bắt buộc" },
                          {
                            validator: (_, value) => {
                              const numValue = Number(value);
                              if (isNaN(numValue)) {
                                return Promise.reject(
                                  new Error("Số điếu phải là số")
                                );
                              }
                              if (numValue < 0) {
                                return Promise.reject(
                                  new Error("Số điếu phải từ 0 trở lên")
                                );
                              }
                              if (numValue > 100) {
                                return Promise.reject(
                                  new Error(
                                    "Số điếu không được vượt quá 100 điếu/ngày"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <InputNumber min={0} max={100} style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        label="Mốc thời gian hút điếu đầu tiên"
                        name="firstSmokeTimeOfDay"
                        rules={[{ required: true, message: "Bắt buộc chọn" }]}
                      >
                        <Select placeholder="Chọn thời gian">
                          <Option value="morning">Sáng sớm (5h-8h)</Option>
                          <Option value="breakfast">Sau bữa sáng</Option>
                          <Option value="mid_morning">
                            Giữa buổi sáng (9h-11h)
                          </Option>
                          <Option value="lunch">Sau bữa trưa</Option>
                          <Option value="afternoon">
                            Buổi chiều (13h-17h)
                          </Option>
                          <Option value="dinner">Sau bữa tối</Option>
                          <Option value="evening">Buổi tối (19h-22h)</Option>
                          <Option value="late_night">Đêm khuya (22h-5h)</Option>
                          <Option value="stress">Khi căng thẳng/áp lực</Option>
                          <Option value="social">Khi gặp gỡ bạn bè</Option>
                          <Option value="coffee">Khi uống cà phê</Option>
                          <Option value="other">Thời gian khác</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Giá mỗi điếu (VNĐ)"
                        name="pricePerCigarette"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá mỗi điếu",
                          },
                          {
                            validator: (_, value) => {
                              const numValue = Number(value);
                              if (isNaN(numValue)) {
                                return Promise.reject(
                                  new Error("Giá phải là số")
                                );
                              }
                              if (numValue < 500) {
                                return Promise.reject(
                                  new Error(
                                    "Giá mỗi điếu thường từ 500 VNĐ trở lên"
                                  )
                                );
                              }
                              if (numValue > 200000) {
                                return Promise.reject(
                                  new Error("Giá mỗi điếu không hợp lệ")
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập giá"
                          value={displayPrice}
                          onChange={handlePriceChange}
                          onBlur={handlePriceBlur}
                          onFocus={handlePriceFocus}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Số điếu mỗi bao"
                        name="cigarettesPerPack"
                        rules={[
                          { required: true, message: "Bắt buộc" },
                          {
                            validator: (_, value) => {
                              const numValue = Number(value);
                              if (isNaN(numValue)) {
                                return Promise.reject(
                                  new Error("Số điếu phải là số")
                                );
                              }
                              if (numValue < 1) {
                                return Promise.reject(
                                  new Error("Số điếu mỗi bao phải từ 1 trở lên")
                                );
                              }
                              if (numValue > 100) {
                                return Promise.reject(
                                  new Error("Số điếu mỗi bao không hợp lệ")
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <InputNumber min={1} max={100} style={{ width: "100%" }} />
                      </Form.Item>
                    </div>
                    {/* Bổ sung */}
                    <div>
                      <Title level={5}>Thông tin bổ sung</Title>
                      <Form.Item
                        label="Bạn từng thử bỏ thuốc?"
                        name="hasTriedToQuit"
                        rules={[{ required: true, message: "Bắt buộc chọn" }]}
                      >
                        <Radio.Group>
                          <Radio value={true}>Có</Radio>
                          <Radio value={false}>Không</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Có vấn đề sức khỏe liên quan?"
                        name="hasHealthIssues"
                        rules={[{ required: true, message: "Bắt buộc chọn" }]}
                      >
                        <Radio.Group>
                          <Radio value={true}>Có</Radio>
                          <Radio value={false}>Không</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Lý do muốn bỏ thuốc"
                        name="quitReason"
                        rules={[
                          { required: true, message: "Bắt buộc" },
                          { min: 5, message: "Phải nhập ít nhất 5 ký tự" },
                        ]}
                      >
                        <TextArea rows={3} />
                      </Form.Item>
                      <Form.Item
                        label="Bạn đã có ý định bỏ thuốc từ khi nào?"
                        name="quitStartDate"
                      >
                        <DatePicker
                          disabled
                          style={{ width: "100%" }}
                          placeholder="Chọn ngày"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex justify-end space-x-4">
                    {editingSmoking ? (
                      <>
                        <Button type="primary" onClick={handleSaveSmoking}>
                          Lưu
                        </Button>
                        <Button
                          onClick={() => {
                            fetchProfileData();
                            setEditingSmoking(false);
                          }}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => setEditingSmoking(true)}
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </Form>
              </Card>
            </Panel>
          </Collapse>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
