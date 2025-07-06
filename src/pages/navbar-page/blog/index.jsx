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
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios"; // Đảm bảo đường dẫn này đúng
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

// --- CÁC COMPONENT CON (TRONG CÙNG FILE) ---

// Card tóm tắt bài viết
const BlogCard = ({ blog, feedbackStats, onViewDetail }) => {
  const { count = 0, avgRating = 0 } = feedbackStats || {};

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden flex flex-col h-full group">
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
                className="!text-sm !text-amber-500 mr-1.5"
              />
              <Text type="secondary">({count} đánh giá)</Text>
            </div>
          </div>
          <Button
            type="primary"
            ghost
            className="w-full !border-purple-600 !text-purple-600 hover:!bg-purple-600 hover:!text-white"
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

  // State cho Modal tạo bài viết
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newBlogData, setNewBlogData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

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
    // Không set loading ở đây để tránh giật màn hình khi refresh
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
      setPageLoading(false); // Chỉ tắt loading chính ở lần đầu
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

  // --- Xử lý Modal Tạo bài viết ---
  const showCreateModal = () => setIsCreateModalVisible(true);
  const handleCancelCreateModal = () => {
    setIsCreateModalVisible(false);
    setNewBlogData({ title: "", content: "", imageUrl: "" });
  };
  const handleCreateBlog = async () => {
    if (!user) return message.error("Bạn cần đăng nhập.");
    if (!newBlogData.title.trim() || !newBlogData.content.trim()) {
      return message.warning("Vui lòng nhập đủ tiêu đề và nội dung.");
    }
    setCreateLoading(true);
    try {
      await api.post("/blogs", { ...newBlogData, accountId: user.id });
      message.success("Đăng bài viết thành công!");
      handleCancelCreateModal();
      await fetchBlogsAndFeedbacks();
    } catch (error) {
      message.error("Đăng bài viết thất bại.");
    } finally {
      setCreateLoading(false);
    }
  };

  // --- Xử lý tương tác Feedback (bên trong Modal chi tiết) ---
  const handleSubmitFeedback = async () => {
    if (!selectedBlog) return;
    if (!interactionRating) return message.warning("Vui lòng chọn số sao.");
    if (!interactionComment.trim())
      return message.warning("Vui lòng nhập nhận xét.");

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
          {user && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0"
              onClick={showCreateModal}
            >
              Viết bài mới
            </Button>
          )}
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

      {/* 1. Modal Tạo bài viết mới */}
      <Modal
        title="Tạo bài viết mới"
        visible={isCreateModalVisible}
        onOk={handleCreateBlog}
        onCancel={handleCancelCreateModal}
        confirmLoading={createLoading}
        okText="Đăng bài"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Tiêu đề" required>
            <Input
              value={newBlogData.title}
              onChange={(e) =>
                setNewBlogData({ ...newBlogData, title: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Nội dung" required>
            <TextArea
              rows={8}
              value={newBlogData.content}
              onChange={(e) =>
                setNewBlogData({ ...newBlogData, content: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="URL Hình ảnh">
            <Input
              value={newBlogData.imageUrl}
              onChange={(e) =>
                setNewBlogData({ ...newBlogData, imageUrl: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 2. Modal Chi tiết bài viết */}
      {selectedBlog && (
        <Modal
          title={selectedBlog.title}
          visible={isDetailModalVisible}
          onCancel={handleCloseDetailModal}
          footer={null} // Tắt footer mặc định
          width={800} // Modal rộng hơn
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
            <div className="bg-gray-50 p-6 rounded-lg">
              <Title level={4}>Để lại đánh giá của bạn</Title>
              {user ? (
                <Spin spinning={interactionLoading} tip="Đang gửi...">
                  <Rate
                    allowHalf
                    value={interactionRating}
                    onChange={setInteractionRating}
                    className="!text-2xl !text-amber-500 mb-4"
                  />
                  <TextArea
                    rows={3}
                    placeholder="Viết nhận xét..."
                    value={interactionComment}
                    onChange={(e) => setInteractionComment(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={handleSubmitFeedback}
                    loading={interactionLoading}
                    className="mt-4 w-full bg-purple-600"
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
            <div className="mt-8">
              <Title level={4}>
                Bình luận ({feedbacks[selectedBlog.id]?.length || 0})
              </Title>
              <div className="mt-4 space-y-6">
                {(feedbacks[selectedBlog.id] || []).map((fb) => (
                  <div key={fb.id} className="flex items-start space-x-4">
                    <Avatar src={fb.user?.avatarUrl} icon={<UserOutlined />} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Text strong>{fb.user?.fullName}</Text>
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
                        className="text-xs !text-amber-500"
                      />
                      <Paragraph className="mt-1">{fb.comment}</Paragraph>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. Modal Sửa Feedback */}
      <Modal
        title="Chỉnh sửa phản hồi"
        visible={isEditFeedbackModalVisible}
        onCancel={() => setIsEditFeedbackModalVisible(false)}
        confirmLoading={editLoading}
        destroyOnClose
        onOk={() => {
          editForm.submit();
        }} // Trigger form submit
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateFeedback}>
          <Form.Item name="rating" label="Đánh giá">
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BlogPage;
