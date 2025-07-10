import React, { useEffect, useState, useCallback } from "react";
import {
  Rate,
  Input,
  Button,
  message,
  Spin,
  Avatar,
  Typography,
  Modal,
  Form,
  Space,
  Popconfirm,
  Tooltip,
  Divider,
} from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../../configs/axios"; // Đảm bảo đường dẫn này đúng
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

// --- CÁC COMPONENT CON (TRONG CÙNG FILE) ---

// Card tóm tắt bài viết
const BlogCard = ({ blog, feedbackStats, onViewDetail }) => {
  const { count = 0, avgRating = 0 } = feedbackStats || {};

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full group">
      <div className="relative overflow-hidden">
        <img
          alt={blog.title}
          src={
            blog.imageUrl ||
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
          }
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-4">
          <Avatar src={blog.author?.avatarUrl} icon={<UserOutlined />} />
          <div className="ml-3">
            <Text strong className="text-gray-800">
              {blog.author?.fullName || "Tác giả"}
            </Text>
          </div>
        </div>

        <div className="flex-grow">
          <Title level={4} className="font-bold text-gray-900 mb-3">
            {blog.title}
          </Title>
          <Paragraph
            className="text-gray-600"
            ellipsis={{ rows: 3, expandable: false }}
          >
            {blog.content}
          </Paragraph>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Rate
                disabled
                allowHalf
                value={avgRating}
                className="!text-xl !text-amber-500 mr-2"
              />
              <Text type="secondary" className="text-base">
                ({count} đánh giá)
              </Text>
            </div>
          </div>
          <Button
            type="primary"
            ghost
            className="w-full !border-purple-600 !text-purple-600 hover:!bg-purple-600 hover:!text-white transition-colors duration-300"
            onClick={() => onViewDetail(blog)}
          >
            Đọc thêm & Bình luận
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH CỦA TRANG BLOG ---

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const user = useSelector((state) => state.user);

  // State cho Modal chi tiết
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // State cho Modal sửa feedback
  const [isEditFeedbackModalVisible, setIsEditFeedbackModalVisible] =
    useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  // State cho form feedback trong Modal chi tiết
  const [interactionRating, setInteractionRating] = useState(0);
  const [interactionComment, setInteractionComment] = useState("");
  const [interactionLoading, setInteractionLoading] = useState(false);

  // Hàm tải dữ liệu
  const fetchBlogsAndFeedbacks = useCallback(async () => {
    try {
      const blogResponse = await api.get("/blogs");
      const fetchedBlogs = blogResponse.data;
      setBlogs(fetchedBlogs);

      const feedbackPromises = fetchedBlogs.map((blog) =>
        api.get(`/feedbacks/blog/${blog.id}`).catch(() => ({ data: [] }))
      );
      const feedbackResponses = await Promise.all(feedbackPromises);

      const feedbackMap = {};
      fetchedBlogs.forEach((blog, index) => {
        feedbackMap[blog.id] =
          feedbackResponses[index].data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ) || [];
      });
      setFeedbacks(feedbackMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      message.error("Không thể tải dữ liệu trang blog.");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogsAndFeedbacks();
  }, [fetchBlogsAndFeedbacks]);

  // --- Xử lý Modal chi tiết ---
  const handleViewDetail = (blog) => {
    setSelectedBlog(blog);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedBlog(null);
    setInteractionComment("");
    setInteractionRating(0);
  };

  // --- Xử lý tương tác Feedback (bên trong Modal chi tiết) ---
  const handleSubmitFeedback = async () => {
    if (!selectedBlog) return;
    if (!interactionRating)
      return message.warning("Vui lòng chọn số sao đánh giá.");
    if (!interactionComment.trim())
      return message.warning("Vui lòng nhập nội dung nhận xét.");

    setInteractionLoading(true);
    try {
      const payload = {
        blogId: selectedBlog.id,
        accountId: user.id,
        rating: interactionRating,
        comment: interactionComment.trim(),
      };
      await api.post("/feedbacks", payload);
      message.success("Cảm ơn bạn đã đánh giá!");
      setInteractionComment("");
      setInteractionRating(0);
      await fetchBlogsAndFeedbacks();
    } catch (error) {
      message.error(error.response?.data?.message || "Gửi đánh giá thất bại.");
    } finally {
      setInteractionLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await api.delete(`/feedbacks/${feedbackId}`);
      message.success("Đã xóa phản hồi.");
      await fetchBlogsAndFeedbacks();
    } catch (error) {
      message.error("Xóa phản hồi thất bại.");
    }
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    editForm.setFieldsValue({
      rating: feedback.rating,
      comment: feedback.comment,
    });
    setIsEditFeedbackModalVisible(true);
  };

  const handleUpdateFeedback = async (values) => {
    if (!values.comment?.trim()) {
      return message.warning("Nội dung không được để trống.");
    }
    setEditLoading(true);
    try {
      const payload = { rating: values.rating, comment: values.comment };
      await api.put(`/feedbacks/${editingFeedback.id}`, payload);
      message.success("Cập nhật thành công!");
      setIsEditFeedbackModalVisible(false);
      setEditingFeedback(null);
      await fetchBlogsAndFeedbacks();
    } catch (error) {
      message.error("Cập nhật thất bại.");
    } finally {
      setEditLoading(false);
    }
  };

  // Hàm tiện ích
  const calculateAvgRating = (feedbacksArr = []) => {
    if (feedbacksArr.length === 0) return 0;
    const total = feedbacksArr.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round((total / feedbacksArr.length) * 2) / 2;
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải trang..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Title
            level={1}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 !mb-4"
          >
            Khám Phá Blog
          </Title>
          <Paragraph className="text-lg text-gray-600 mb-8">
            Nơi chia sẻ kiến thức, kinh nghiệm và những câu chuyện truyền cảm
            hứng.
          </Paragraph>
        </div>

        {/* Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                feedbackStats={{
                  count: feedbacks[blog.id]?.length || 0,
                  avgRating: calculateAvgRating(feedbacks[blog.id]),
                }}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Text className="text-lg text-gray-500">Chưa có bài viết nào.</Text>
          </div>
        )}
      </div>

      {/* --- CÁC MODAL --- */}

      {/* 2. Modal Chi tiết bài viết */}
      {selectedBlog && (
        <Modal
          title={
            <Title level={3} className="!m-0">
              {selectedBlog.title}
            </Title>
          }
          open={isDetailModalVisible}
          onCancel={handleCloseDetailModal}
          footer={null}
          width={800}
          destroyOnClose
          className="blog-detail-modal"
        >
          <div className="max-h-[80vh] overflow-y-auto pr-4 -mr-4">
            <div className="flex items-center mb-4 mt-2">
              <Avatar
                src={selectedBlog.author?.avatarUrl}
                size="large"
                icon={<UserOutlined />}
              />
              <div className="ml-4">
                <Text strong>{selectedBlog.author?.fullName}</Text>
                <Text type="secondary" className="block text-sm">
                  Đăng ngày:{" "}
                  {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </Text>
              </div>
            </div>

            {selectedBlog.imageUrl && (
              <img
                src={selectedBlog.imageUrl}
                alt={selectedBlog.title}
                className="w-full h-auto rounded-lg shadow-md my-6"
              />
            )}

            <Paragraph className="prose max-w-none text-base leading-relaxed my-6">
              {selectedBlog.content}
            </Paragraph>

            <Divider />

            {/* Phần tương tác */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <Title level={4} className="!mb-4">
                Để lại đánh giá của bạn
              </Title>
              {user ? (
                <Spin spinning={interactionLoading} tip="Đang gửi...">
                  <div
                    className={`
                    mb-4 text-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300
                    [&_.ant-rate-star-zero_span]:!text-gray-400
                  `}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chạm vào sao để đánh giá
                    </label>
                    <Rate
                      value={interactionRating}
                      onChange={setInteractionRating}
                      className="!text-3xl md:!text-4xl !text-amber-400"
                    />
                  </div>

                  <TextArea
                    rows={4}
                    placeholder="Chia sẻ cảm nhận của bạn về bài viết này..."
                    value={interactionComment}
                    onChange={(e) => setInteractionComment(e.target.value)}
                    className="!rounded-md focus:!border-purple-500 focus:!shadow-outline-purple"
                  />
                  <Button
                    type="primary"
                    onClick={handleSubmitFeedback}
                    loading={interactionLoading}
                    className="mt-4 w-full !h-12 !text-base !font-semibold bg-purple-600 hover:!bg-purple-700 !rounded-lg"
                  >
                    Gửi đánh giá
                  </Button>
                </Spin>
              ) : (
                <Text type="secondary" italic>
                  Vui lòng đăng nhập để đánh giá.
                </Text>
              )}
            </div>

            {/* Danh sách feedback */}
            <div className="mt-10">
              <Title level={4}>
                Bình luận ({feedbacks[selectedBlog.id]?.length || 0})
              </Title>
              <div className="mt-6 space-y-6">
                {(feedbacks[selectedBlog.id] || []).length > 0 ? (
                  (feedbacks[selectedBlog.id] || []).map((fb) => (
                    <div
                      key={fb.id}
                      className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-100"
                    >
                      <Avatar
                        src={fb.user?.avatarUrl}
                        icon={<UserOutlined />}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text strong className="mr-2">
                              {fb.user?.fullName}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              {new Date(fb.createdAt).toLocaleString("vi-VN")}
                            </Text>
                          </div>
                          {user?.id === fb.accountId && (
                            <Space>
                              <Tooltip title="Sửa">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditFeedback(fb)}
                                />
                              </Tooltip>
                              <Popconfirm
                                title="Chắc chắn xóa?"
                                onConfirm={() => handleDeleteFeedback(fb.id)}
                              >
                                <Tooltip title="Xóa">
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                  />
                                </Tooltip>
                              </Popconfirm>
                            </Space>
                          )}
                        </div>
                        <Rate
                          disabled
                          allowHalf
                          value={fb.rating}
                          className="!text-sm !text-amber-500 my-1"
                        />
                        <Paragraph className="mt-1 mb-0 text-gray-700">
                          {fb.comment}
                        </Paragraph>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có bình luận nào. Hãy là người đầu tiên!
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. Modal Sửa Feedback */}
      <Modal
        title="Chỉnh sửa phản hồi"
        open={isEditFeedbackModalVisible}
        onCancel={() => setIsEditFeedbackModalVisible(false)}
        confirmLoading={editLoading}
        destroyOnClose
        okText="Lưu thay đổi"
        cancelText="Hủy"
        onOk={() => {
          editForm.submit();
        }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateFeedback}>
          <Form.Item name="rating" label="Đánh giá của bạn">
            <Rate className="!text-2xl !text-amber-500" />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Nội dung nhận xét"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={4} placeholder="Cập nhật nhận xét của bạn..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BlogPage;
