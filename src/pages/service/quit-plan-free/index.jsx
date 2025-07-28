import { Button, DatePicker, Form, Input } from "antd";
import React from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

import { CalendarOutlined, DownloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function QuitPlanFree() {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleDownloadTemplate = () => {
    window.open("/QuitSmoking_KeHoachCaiThuoc.pdf", "_blank");
  };

  const handleSubmit = async (values) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tạo kế hoạch cai thuốc.");
      return;
    }

    try {
      const response = await api.post("/free-plan/create", values);
      console.log(response.data);
      toast.success("Tạo kế hoạch thành công");
      form.resetFields();
      navigate("/my-plan");
    } catch (error) {
      toast.error("Lỗi khi tạo kế hoạch");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-xl">
        <h3 className="mt-4 text-center text-lg font-semibold text-blue-700 tracking-wide mb-2">
          Hướng dẫn tạo kế hoạch cai thuốc miễn phí
        </h3>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Đầu tiên, hãy tải về file kế hoạch mẫu của chúng tôi để tham khảo:
          </p>
          <Button
            type="default"
            onClick={handleDownloadTemplate}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <DownloadOutlined />
            Tải về Kế hoạch mẫu PDF
          </Button>
          <hr className="my-8 border-gray-200" />
          <p className="text-gray-600 mb-4">
            Sau đó, điền thông tin vào biểu mẫu dưới đây để thiết lập kế hoạch
            của bạn:
          </p>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="space-y-6"
        >
          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Ngày bắt đầu kế hoạch *
              </span>
            }
            name="startDate"
            rules={[
              { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              {
                validator(_, value) {
                  const today = dayjs().startOf("day");
                  if (!value || dayjs(value).isSameOrAfter(today, "day")) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Không được chọn ngày trong quá khứ");
                },
              },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Ngày kết thúc kế hoạch *
              </span>
            }
            name="endDate"
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue("startDate");
                  const today = dayjs().startOf("day");

                  if (!value) return Promise.resolve();

                  const selectedDate = dayjs(value);
                  const start = startDate ? dayjs(startDate) : null;

                  if (selectedDate.isBefore(today, "day")) {
                    return Promise.reject("Không được chọn ngày trong quá khứ");
                  }

                  if (start && selectedDate.isBefore(start, "day")) {
                    return Promise.reject(
                      "Ngày kết thúc không được trước ngày bắt đầu"
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">Lý do thúc đẩy</span>
            }
            name="motivationReason"
            rules={[
              { required: true, message: "Vui lòng nhập lý do thúc đẩy" },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Tại sao bạn muốn cai thuốc? (Ví dụ: Vì sức khỏe, gia đình...)"
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Thiết Lập Kế Hoạch
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default QuitPlanFree;
