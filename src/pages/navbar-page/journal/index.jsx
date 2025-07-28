import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Spin,
} from "antd";
import {
  FireOutlined,
  TrophyOutlined,
  DollarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  CalendarOutlined,
  UserOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import DatePickerSmokingLog from "./DatePickerSmokingLog";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Title, Text } = Typography;

function LogSmoking() {
  const [form] = Form.useForm();
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStatsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [hasActivePaidPlan, setHasActivePaidPlan] = useState(false);
  const [hasActiveQuitPlan, setHasActiveQuitPlan] = useState(false);
  const [hasFreeActivePlan, setHasFreeActivePlan] = useState(false);
  // Removed setPendingDate as it was unused and pendingDate seems to be handled by selectedDate
  // const [pendingDate, setPendingDate] = useState(null);

  const hasAccessToFullFeatures = hasActivePaidPlan || hasActiveQuitPlan;
  // Removed hasLimitedAccess as it was unused
  // const hasLimitedAccess = hasFreeActivePlan && !hasAccessToFullFeatures;

  // canPostSmokingLog vẫn được giữ lại vì nó được dùng cho nút Gửi nhật ký
  const canPostSmokingLog = hasFreeActivePlan || hasAccessToFullFeatures;

  const renderStatusTag = (status) => {
    let color = "";
    let text = "";
    switch (status) {
      case "Tốt":
        color = "green";
        text = "Tốt";
        break;
      case "Trung bình":
        color = "orange";
        text = "Trung bình";
        break;
      case "Kém":
        color = "red";
        text = "Kém";
        break;
      default:
        color = "default";
        text = "Không xác định";
    }
    return <Tag color={color}>{text}</Tag>;
  };

  useEffect(() => {
    if (!user) toast.error("Bạn chưa đăng nhập!");
  }, [user]);
  if (!user) {
    return (
      <div className="center-content">
        <h2>Bạn chưa đăng nhập</h2>
        <Button type="primary" size="large" onClick={() => navigate("/login")}>Đăng nhập để sử dụng chức năng này</Button>
      </div>
    );
  }

  useEffect(() => {
    const checkPaidPlan = async () => {
      try {
        const res = await api.get("/purchased-plan/active");
        if (res.data?.status === "ACTIVE" && res.data?.paymentStatus === "SUCCESS") {
          setHasActivePaidPlan(true);
        } else {
          setHasActivePaidPlan(false);
        }
      } catch (error) {
        console.log(error);
        setHasActivePaidPlan(false);
        console.error("Không thể ghi nhận log: Coach chưa giao nhiệm vụ hôm nay");
      }
    };
  
    checkPaidPlan();
  }, []);

  useEffect(() => {
    const checkQuitPlan = async () => {
      try {
        const res = await api.get("/quit-plan/active");
        setHasActiveQuitPlan(!!res.data?.createdAt);
      } catch (error) {
        console.log(error);
        setHasActiveQuitPlan(false);
       // console.error("Lỗi khi kiểm tra kế hoạch cai thuốc:", error);
      }
    };
  
    checkQuitPlan();
  }, []);
  
  useEffect(() => {
    const checkFreePlan = async () => {
      try {
        const res = await api.get("/free-plan/active");
        if (res.data?.isActive === true) {
          setHasFreeActivePlan(true);
        } else {
          setHasFreeActivePlan(false);
         // toast.error("Bạn chưa có kế hoạch miễn phí nào đang hoạt động. Vui lòng tạo kế hoạch để sử dụng tính năng này.");
        }
      } catch (error) {
        console.log(error);
        setHasFreeActivePlan(false);
       // toast.error("Không thể kiểm tra kế hoạch miễn phí. Vui lòng thử lại sau.");
      }
    };
  
    checkFreePlan();
  }, []);
   


  const fetchStats = async () => {
    try {
      const res = await api.get("/smoking-log/stats");
      setStatsData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSmokingLogByDay = async (date) => {
    try {
      const res = await api.get("/smoking-log/day", { params: { date } });
      setLogData(res.data);
      toast.success("Đã tải nhật ký thành công.");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message;
      if (msg === "Chưa có ghi nhận ngày này") {
        toast.error("Chưa có ghi nhận ngày này.");
        setLogData(null);
      } else {
        toast.error("Lỗi khi tải nhật ký.");
      }
      return null;
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await api.post("/smoking-log", values);
      if (res?.data) {
        setLogData(res.data);
        toast.success("Cập nhật nhật ký thành công!");
        fetchStats();
      } else {
        toast.error("Dữ liệu trả về không hợp lệ.");
      }
    } catch (err) {
      const rawMsg = err.response?.data?.message;
  
      // Trường hợp coach chưa giao nhiệm vụ
      if (rawMsg?.includes("Coach chưa giao nhiệm vụ")) {
        toast.error("Không thể ghi nhật ký: Huấn luyện viên chưa giao nhiệm vụ hôm nay.");
      }
      //  Trường hợp không có kế hoạch nào đang hoạt động (mặc định)
      else if (rawMsg?.includes("không có kế hoạch") || err.response?.status === 400) {
        toast.error("Bạn chưa có kế hoạch nào đang hoạt động.");
      }
      //  Các lỗi khác không rõ
      else {
        toast.error("Đã xảy ra lỗi khi gửi nhật ký. Vui lòng thử lại sau.");
      }
  
      console.error("Lỗi ghi nhật ký:", err);
    }
  };

  const isValidDate = (dateStr) => {
    const today = dayjs().format("YYYY-MM-DD");
    const selected = dayjs(dateStr).format("YYYY-MM-DD");
    return selected <= today;
  };

  const handleUpgradeClick = () => navigate("/package");


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 my-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full my-6">
            <HeartOutlined className="text-white text-3xl" />
          </div>
          <Title
            level={1}
            className="text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text"
          >
            Nhật Ký Hút Thuốc
          </Title>
          <Text className="text-gray-600 text-lg">
            Theo dõi tiến trình cai thuốc và sức khỏe của bạn
          </Text>
        </div>

        {/* Date Picker + Tổng quan thống kê */}
        <Row
          gutter={[24, 24]}
          className="mb-12"
          justify="center"
          align="stretch"
        >
          <Col xs={24} md={12} lg={8} style={{ height: "100%" }}>
            <Card
              className="shadow-lg border-0 bg-gradient-to-br from-blue-100 to-green-100"
              style={{ borderRadius: "16px", height: "100%" }}
            >
              <div className="text-center mb-4">
                <CalendarOutlined className="text-blue-500 text-2xl mb-2" />
                <Title level={3} className="text-blue-700 my-4">
                  Chọn ngày xem nhật ký
                </Title>
                <Text className="text-gray-600">
                  Bạn có thể xem lại nhật ký hút thuốc của bất kỳ ngày nào
                </Text>
              </div>
              {/* Nút chọn ngày và DatePicker */}
              <div className="flex flex-col gap-4 items-center">
                <DatePickerSmokingLog
                  // Now using only selectedDate as pendingDate is removed if not needed
                  key={selectedDate}
                  onDateChange={(date) => {
                    if (date) setSelectedDate(date.format("YYYY-MM-DD"));
                  }}
                  // Now using only selectedDate as pendingDate is removed if not needed
                  defaultValue={dayjs(selectedDate)}
                />

                <Button
                  type="primary"
                  className="bg-gradient-to-r from-blue-500 to-green-500 border-none rounded-lg font-semibold text-lg px-8 py-2 h-auto shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={!selectedDate || !hasAccessToFullFeatures}
                  onClick={() => {
                    if (!selectedDate || !isValidDate(selectedDate)) {
                      toast.error(
                        "Vui lòng chọn ngày hợp lệ (không phải ngày trong tương lai)!"
                      );
                      return;
                    }

                    if (!hasAccessToFullFeatures) {
                      toast.error(
                        "Tính năng xem nhật ký chỉ dành cho tài khoản trả phí."
                      );
                      return;
                    }

                    fetchSmokingLogByDay(selectedDate);
                  }}
                >
                  Xem nhật ký
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8} style={{ height: "100%" }}>
            {stats && (
              <Card
                className="shadow-lg border-0 bg-gradient-to-br from-blue-100 to-green-100"
                style={{ borderRadius: "16px", height: "100%" }}
              >
                <Title level={3} className="text-center text-blue-700 my-4">
                  📊 Thống kê tổng quan
                </Title>
                <Row gutter={16} className="text-center">
                  <Col xs={24} sm={12}>
                    <Statistic
                      title="Tổng số ngày ghi nhận"
                      value={stats.totalDays}
                      valueStyle={{ color: "#2563eb", fontWeight: "bold" }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Statistic
                      title="Tổng số điếu thuốc"
                      value={stats.totalCigarettes}
                      valueStyle={{ color: "#dc2626", fontWeight: "bold" }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    {/* Money Saved - accessible for quit plan users or full features */}
                    <Statistic
                      title="Tổng tiền tiết kiệm (VNĐ)"
                      value={
                        hasActiveQuitPlan || hasAccessToFullFeatures
                          ? stats.totalMoneySaved
                          : "******"
                      }
                      valueStyle={{ color: "#059669", fontWeight: "bold" }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Statistic
                      title="Số ngày đạt mục tiêu"
                      value={
                        hasAccessToFullFeatures
                          ? stats.daysAchievedTarget
                          : "N/A"
                      }
                      valueStyle={{ color: "#10b981", fontWeight: "bold" }}
                    />
                  </Col>
                </Row>
                {!hasAccessToFullFeatures && (
                  <div className="text-center mt-6">
                    <Button
                      type="default"
                      size="small"
                      onClick={handleUpgradeClick}
                      className="text-blue-500 border-blue-500 hover:text-blue-700 hover:border-blue-700"
                    >
                      Nâng cấp để xem chi tiết
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </Col>
        </Row>

        {/* Card ngày thực hiện kế hoạch */}
        {logData &&
          logData.daysCompleted !== undefined &&
          logData.totalPlanDays !== undefined &&
          hasAccessToFullFeatures && (
            <Row justify="center" style={{ marginBottom: 24, marginTop: 24 }}>
              <Col xs={24} sm={12}>
                <Card
                  className="shadow-lg border-0"
                  style={{ borderRadius: 16 }}
                >
                  <Statistic
                    title="📅 Ngày thực hiện kế hoạch"
                    value={`${logData.daysCompleted}/${logData.totalPlanDays}`}
                    suffix=" ngày"
                    valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                  />
                  <Progress
                    percent={Math.round(
                      (logData.daysCompleted / logData.totalPlanDays) * 100
                    )}
                    strokeColor={{ from: "#108ee9", to: "#87d068" }}
                    style={{ marginTop: 12 }}
                  />
                </Card>
              </Col>
            </Row>
          )}

        {/* Nút "Nâng cấp gói" */}
        {!hasAccessToFullFeatures && (
          <div className="text-center mb-6">
            <Button
              type="primary"
              size="large"
              onClick={handleUpgradeClick}
              className="bg-gradient-to-r from-blue-500 to-green-500 border-none rounded-lg font-semibold text-lg px-8 py-4 h-auto shadow-md hover:shadow-lg transition-all duration-300"
              style={{ fontSize: "16px", fontWeight: "600" }}
            >
              Nâng cấp gói để xem đầy đủ thông tin
            </Button>
          </div>
        )}

        {/* Form Section */}
        <Card
          className="my-10 mb-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm"
          style={{
            borderRadius: "20px",
            padding: "3px",
            marginBottom: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="text-center my-6">
            <Title level={3} className="text-gray-700 mb-2">
              📝 Ghi nhận hôm nay
            </Title>
            <Text className="text-gray-500">
              Hãy chia sẻ thông tin về việc hút thuốc của bạn
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="max-w-2xl w-full mx-auto"
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">
                      <FireOutlined className="mr-2 text-red-500" />
                      Số điếu thuốc hôm nay
                    </span>
                  }
                  name="cigarettesToday"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điếu thuốc!.",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Số điếu phải không được là số âm!.",
                    },
                    {
                      pattern: /^\d+$/,
                      message:
                        "Chỉ được nhập số, không được chứa chữ cái hoặc ký tự đặc biệt!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                      height: 56,
                      fontSize: 22,
                      borderRadius: 12,
                      padding: "8px 16px",
                    }}
                    size="large"
                    className="rounded-lg"
                    // ĐÃ BỎ DISABLED Ở ĐÂY
                    // disabled={!canPostSmokingLog}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">
                      <CalendarOutlined className="mr-2 text-blue-500" />
                      Ngày hôm nay
                    </span>
                  }
                >
                  <Input
                    value={new Date().toLocaleDateString("vi-VN")}
                    disabled
                    size="large"
                    className="rounded-lg bg-gray-50"
                    style={{
                      height: 56,
                      fontSize: 22,
                      borderRadius: 12,
                      padding: "8px 16px",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  <UserOutlined className="mr-2 text-green-500" />
                  Ghi chú cá nhân
                </span>
              }
              name="note"
              rules={[
                { required: true, message: "Vui lòng nhập ghi chú." },
                { min: 5, message: "Tối thiểu 5 ký tự" },
                { max: 255, message: "Ghi chú không quá 255 ký tự." },
                {
                  pattern: /^(?!\s).+/,
                  message: "Không được bắt đầu bằng khoảng trắng!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Chia sẻ cảm nhận, khó khăn hoặc thành tựu của bạn hôm nay..."
                className="rounded-lg"
                style={{
                  resize: "none",
                  height: 120,
                  fontSize: 20,
                  borderRadius: 12,
                  padding: "12px 16px",
                }}
                // ĐÃ BỎ DISABLED Ở ĐÂY
                // disabled={!canPostSmokingLog}
              />
            </Form.Item>

            <div className="text-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="px-12 py-3 my-3 h-auto rounded-full bg-gradient-to-r from-blue-500 to-green-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ fontSize: "16px", fontWeight: "600" }}
                // Vẫn giữ disabled cho nút gửi nếu người dùng không có quyền
               
              >
                {loading ? (
                  <>
                    <LoadingOutlined className="mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <SmileOutlined className="mr-2" />
                    Gửi nhật ký
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card>

        {/* Update Loading State */}
        {loading && (
          <div className="text-center py-8 my-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full my-4">
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 32, color: "white" }}
                    spin
                  />
                }
              />
            </div>
            <Text className="block text-gray-600">
              Đang cập nhật dữ liệu...
            </Text>
          </div>
        )}

        {/* Results Section */}
        {logData && (
          <div className="space-y-8">
            {/* Main Statistics */}
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="text-center my-10 shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300"
                  style={{ borderRadius: "16px" }}
                >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-3">
                      <FireOutlined className="text-white text-2xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <span className="text-gray-700 font-medium">
                        Thuốc lá hôm nay
                      </span>
                    }
                    value={logData.cigarettesToday}
                    valueStyle={{
                      color:
                        logData.cigarettesToday > 0 ? "#dc2626" : "#059669",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="text-center my-10 shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300"
                  style={{ borderRadius: "16px" }}
                >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-3">
                      <TrophyOutlined className="text-white text-2xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <span className="text-gray-700 font-medium">
                        Mục tiêu
                      </span>
                    }
                    value={logData.targetCigarettes}
                    valueStyle={{
                      color: "#059669",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                {/* Conditionally apply blur to Nicotine Estimate with Tailwind */}
                <div className="relative">
                  {!hasAccessToFullFeatures ? (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-emerald-500 bg-opacity-80 text-white p-4 rounded-2xl text-lg font-bold text-center z-10 select-none cursor-pointer"
                      onClick={handleUpgradeClick}
                    >
                      Nâng cấp để xem
                      <br />
                      thông tin này
                    </div>
                  ) : null}
                  <Card
                    className={`text-center my-10 shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 ${
                      !hasAccessToFullFeatures
                        ? "filter blur-md pointer-events-none select-none"
                        : "hover:shadow-xl transition-all duration-300"
                    }`}
                    style={{ borderRadius: "16px" }}
                  >
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-3">
                        <FireOutlined className="text-white text-2xl" />
                      </div>
                    </div>
                    <Statistic
                      title={
                        <span className="text-gray-700 font-medium">
                          Nicotine (mg)
                        </span>
                      }
                      value={
                        hasAccessToFullFeatures
                          ? logData.nicotineEstimate
                          : "******"
                      }
                      valueStyle={{
                        color:
                          logData.nicotineEstimate > 0 ? "#ea580c" : "#059669",
                        fontSize: "28px",
                        fontWeight: "bold",
                      }}
                      precision={1}
                    />
                  </Card>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="text-center my-10 shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300"
                  style={{ borderRadius: "16px" }}
                >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-3">
                      <DollarOutlined className="text-white text-2xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <span className="text-gray-700 font-medium">
                        Tiết kiệm hôm nay
                      </span>
                    }
                    // FIX: Ensure money saved requires either quit plan OR full features (paid plan)
                    value={
                      hasActiveQuitPlan || hasAccessToFullFeatures
                        ? logData.moneySavedToday
                        : "******"
                    }
                    valueStyle={{
                      color: "#059669",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                    suffix=" VNĐ"
                  />
                </Card>
              </Col>
            </Row>

            {/* Health Progress */}
            {/* Conditionally apply blur to Health Progress with Tailwind */}
            <div className="relative">
              {!hasAccessToFullFeatures ? (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-emerald-500 bg-opacity-80 text-white p-4 rounded-2xl text-lg font-bold text-center z-10 select-none cursor-pointer"
                  onClick={handleUpgradeClick}
                >
                  Nâng cấp để xem
                  <br />
                  tiến độ sức khỏe
                </div>
              ) : null}
              <Card
                className={`my-10 shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 ${
                  !hasAccessToFullFeatures
                    ? "filter blur-md pointer-events-none select-none"
                    : ""
                }`}
                style={{ borderRadius: "20px" }}
              >
                <div className="text-center my-6">
                  <Title level={3} className="text-gray-800 mb-2">
                    📊 Tiến độ sức khỏe hôm nay
                  </Title>
                  <Text className="text-gray-600">
                    Đánh giá tổng quan về tình trạng sức khỏe của bạn
                  </Text>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <Text strong className="text-lg">
                      Hoàn thành mục tiêu:
                    </Text>
                    {logData.targetAchieved ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircleOutlined className="text-2xl mr-2" />
                        <span className="font-medium">Đạt được</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <CloseCircleOutlined className="text-2xl mr-2" />
                        <span className="font-medium">Chưa đạt</span>
                      </div>
                    )}
                  </div>
                  <Progress
                    percent={logData.dailyHealthPercent}
                    status={
                      logData.dailyHealthPercent >= 80 ? "SUCCESS" : "ACTIVE"
                    }
                    strokeColor={{
                      "0%": "#3b82f6",
                      "100%": "#10b981",
                    }}
                    strokeWidth={12}
                    className="mb-6"
                  />
                  <div className="text-center">
                    <Text className="text-gray-600">
                      Sức khỏe của bạn đang ở mức {logData.dailyHealthPercent}%
                    </Text>
                  </div>
                </div>
              </Card>
            </div>

            {/* Health Status Details */}
            {/* Conditionally apply blur to Health Status Details with Tailwind */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <div className="relative">
                  {!hasAccessToFullFeatures ? (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-emerald-500 bg-opacity-80 text-white p-4 rounded-2xl text-lg font-bold text-center z-10 select-none cursor-pointer"
                      onClick={handleUpgradeClick}
                    >
                      Nâng cấp để xem
                      <br />
                      tình trạng sức khỏe
                    </div>
                  ) : null}
                  <Card
                    title={
                      <span className="text-gray-800 font-semibold">
                        ❤️ Tình trạng tim mạch
                      </span>
                    }
                    className={`h-full my-10 shadow-lg border-0 bg-gradient-to-br from-red-50 to-pink-50 ${
                      !hasAccessToFullFeatures
                        ? "filter blur-md pointer-events-none select-none"
                        : ""
                    }`}
                    style={{ borderRadius: "16px" }}
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <Text className="text-gray-700 font-medium">
                          Nhịp tim:
                        </Text>
                        <Text strong className="text-lg">
                          {logData.heartRate}
                        </Text>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <Text className="text-gray-700 font-medium">
                          Trạng thái nhịp tim:
                        </Text>
                        {renderStatusTag(logData.heartRateStatus)}
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <Text className="text-gray-700 font-medium">
                          Huyết áp:
                        </Text>
                        {renderStatusTag(logData.bloodPressureStatus)}
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <Text className="text-gray-700 font-medium">
                          Tuần hoàn:
                        </Text>
                        {renderStatusTag(logData.circulationStatus)}
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="relative">
                  {!hasAccessToFullFeatures ? (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-emerald-500 bg-opacity-80 text-white p-4 rounded-2xl text-lg font-bold text-center z-10 select-none cursor-pointer"
                      onClick={handleUpgradeClick}
                    >
                      Nâng cấp để xem
                      <br />
                      tình trạng sức khỏe
                    </div>
                  ) : null}
                  <Card
                    title={
                      <span className="text-gray-800 font-semibold">
                        🌟 Tình trạng khác
                      </span>
                    }
                    className={`h-full my-10 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 ${
                      !hasAccessToFullFeatures
                        ? "filter blur-md pointer-events-none select-none"
                        : ""
                    }`}
                    style={{ borderRadius: "16px" }}
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <Text className="text-gray-700 font-medium">Phổi:</Text>
                        {renderStatusTag(logData.lungStatus)}
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <Text className="text-gray-700 font-medium">
                          Vị giác:
                        </Text>
                        {renderStatusTag(logData.tasteStatus)}
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <Text className="text-gray-700 font-medium">Da:</Text>
                        {renderStatusTag(logData.skinStatus)}
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <Text className="text-gray-700 font-medium">CO:</Text>
                        {renderStatusTag(logData.coStatus)}
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* Motivational Message */}
            {/* Conditionally apply blur to Motivational Message if target not achieved and no full access */}
            <div className="relative">
              {!hasAccessToFullFeatures && !logData.targetAchieved ? (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-emerald-500 bg-opacity-80 text-white p-4 rounded-2xl text-lg font-bold text-center z-10 select-none cursor-pointer"
                  onClick={handleUpgradeClick}
                >
                  Nâng cấp để mở khóa
                  <br />
                  tin nhắn động viên
                </div>
              ) : null}
              <Card
                className={`my-10 shadow-xl border-0 text-center ${
                  !hasAccessToFullFeatures && !logData.targetAchieved
                    ? "filter blur-md pointer-events-none select-none"
                    : ""
                }`}
                style={{
                  borderRadius: "20px",
                  background: logData.targetAchieved
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                }}
              >
                <div className="py-8">
                  <HeartOutlined className="text-white text-4xl mb-4" />
                  <Text className="text-white text-lg font-medium block">
                    {logData.targetAchieved ? (
                      <span
                        className="text-2xl font-extrabold text-white drop-shadow-lg block"
                        style={{
                          textShadow: "0 2px 8px #059669, 0 1px 0 #fff",
                          letterSpacing: "1px",
                        }}
                      >
                        🎉 Chúc mừng! Bạn đã đạt được mục tiêu hôm nay và sức
                        khỏe đang cải thiện rất tốt!
                      </span>
                    ) : (
                      "💪 Hãy cố gắng hơn để đạt được mục tiêu của bạn! Mỗi ngày là một bước tiến mới!"
                    )}
                  </Text>
                </div>
              </Card>
            </div>
            {/* Hiển thị ghi chú nếu có */}
            {logData.note && (
              <div className="flex justify-center my-8">
                <div className="w-full max-w-lg bg-blue-50 text-blue-700 px-8 py-4 rounded-2xl font-medium text-base shadow text-center">
                  <b>Ghi chú hôm nay:</b> {logData.note}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LogSmoking;