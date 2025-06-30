import React, { useEffect, useState } from "react";
import {
  Card,
  Rate,
  Input,
  Button,
  message,
  Spin,
  Avatar,
  Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Các component con đã được tái cấu trúc và áp dụng style mới
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

// --- COMPONENT CON (Đã áp dụng style mới) ---

const PageSpinner = ({ tip }) => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
    <Spin size="large" tip={tip} />
  </div>
);

const ActionPrompt = ({ title, buttonText, buttonLink, isPremiumAction }) => (
  <div className="p-4 text-center">
    <Text className="mb-3 block text-gray-400 italic">{title}</Text>
    <Button
      type="primary"
      className={`bg-gradient-to-r ${
        isPremiumAction
          ? "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          : "from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
      } border-0 text-white font-semibold transition-all duration-300 transform hover:scale-105`}
    >
      <Link to={buttonLink}>{buttonText}</Link>
    </Button>
  </div>
);

const FeedbackList = ({ feedbacks }) => (
  <div className="mt-6">
    <Title level={5} className="text-gray-200">
      Phản hồi từ cộng đồng
    </Title>
    <div className="mt-3 p-4 bg-black/20 rounded-lg max-h-48 overflow-y-auto space-y-4 border border-white/10">
      {feedbacks && feedbacks.length > 0 ? (
        feedbacks.map((fb, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Avatar src={fb.user?.avatarUrl} icon={<UserOutlined />} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Text strong className="text-gray-100">
                  {fb.user?.username || "Người dùng"}
                </Text>
                <Rate
                  disabled
                  allowHalf
                  value={fb.rating}
                  // Override style của antd để có màu vàng sáng
                  className="text-xs !text-yellow-400"
                />
              </div>
              <Paragraph className="text-gray-300 mt-1 mb-0 text-sm">
                {fb.comment}
              </Paragraph>
            </div>
          </div>
        ))
      ) : (
        <Text className="text-gray-400 italic">Chưa có phản hồi nào.</Text>
      )}
    </div>
  </div>
);

const FeedbackForm = ({
  blogId,
  interaction,
  onInteractionChange,
  onSubmit,
  isLoading,
}) => (
  <div className="pt-4">
    <Spin spinning={isLoading} tip="Đang gửi...">
      <Title level={5} className="text-gray-200">
        Để lại đánh giá của bạn
      </Title>
      <div className="mt-3 space-y-4">
        <Rate
          allowHalf
          value={interaction?.rating || 0}
          onChange={(value) => onInteractionChange(blogId, "rating", value)}
          // Override style để phù hợp với dark mode
          className="text-2xl !text-yellow-400 hover:!text-yellow-300"
        />
        <TextArea
          rows={3}
          placeholder="Viết nhận xét của bạn ở đây..."
          value={interaction?.feedback || ""}
          onChange={(e) =>
            onInteractionChange(blogId, "feedback", e.target.value)
          }
          // Style cho TextArea trong Dark Mode
          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
        />
        <Button
          type="primary"
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0 h-10 font-semibold transition-all duration-300 transform hover:scale-105"
          onClick={() => onSubmit(blogId)}
          loading={isLoading}
        >
          Gửi đánh giá
        </Button>
      </div>
    </Spin>
  </div>
);

const BlogCard = ({ blog, user, interactions, feedbacks, handlers }) => {
  const { handleInteractionChange, handleSubmitFeedback, submitLoading } =
    handlers;

  const renderFeedbackSection = () => {
    if (!user) {
      return (
        <ActionPrompt
          title="Vui lòng đăng nhập để đánh giá."
          buttonText="Đăng nhập"
          buttonLink="/login"
        />
      );
    }
    if (!user.premium) {
      return (
        <ActionPrompt
          title="Chỉ thành viên Premium mới có thể để lại đánh giá."
          buttonText="Nâng cấp ngay"
          buttonLink="/premium"
          isPremiumAction
        />
      );
    }
    return (
      <FeedbackForm
        blogId={blog.id}
        interaction={interactions[blog.id]}
        onInteractionChange={handleInteractionChange}
        onSubmit={handleSubmitFeedback}
        isLoading={submitLoading[blog.id] || false}
      />
    );
  };

  return (
    // Đây là phần tạo hiệu ứng Glassmorphism
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-white/40 hover:shadow-2xl">
      <img
        alt={blog.title}
        src={
          blog.imgUrl ||
          "https://via.placeholder.com/400x225.png?text=Blog+Image"
        }
        className="h-56 w-full object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <Title level={3} className="text-xl font-semibold text-gray-100 mb-2">
            {blog.title}
          </Title>
          <Paragraph
            className="text-gray-300"
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: (
                <span className="text-purple-400 font-semibold">đọc thêm</span>
              ),
            }}
          >
            {blog.content}
          </Paragraph>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          <FeedbackList feedbacks={feedbacks[blog.id]} />
          <div className="mt-6">{renderFeedbackSection()}</div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---

function BlogPage() {
  // ... (Toàn bộ state và logic giống hệt như trước, không cần thay đổi)
  const [blogs, setBlogs] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState({});
  const user = useSelector((state) => state.user);

  const fetchBlogsAndFeedbacks = async () => {
    setPageLoading(true);
    try {
      const blogResponse = await api.get("/blogs");
      const fetchedBlogs = blogResponse.data;

      const initialInteractions = {};
      const initialSubmitLoading = {};
      fetchedBlogs.forEach((blog) => {
        initialInteractions[blog.id] = { rating: 0, feedback: "" };
        initialSubmitLoading[blog.id] = false;
      });

      setBlogs(fetchedBlogs);
      setInteractions(initialInteractions);
      setSubmitLoading(initialSubmitLoading);

      const feedbackPromises = fetchedBlogs.map((blog) =>
        api.get(`/feedbacks/blog/${blog.id}`).catch((e) => {
          console.error(`Failed to fetch feedbacks for blog ${blog.id}:`, e);
          return { data: [] };
        })
      );

      const feedbackResponses = await Promise.all(feedbackPromises);
      const feedbackMap = {};
      fetchedBlogs.forEach((blog, index) => {
        feedbackMap[blog.id] = feedbackResponses[index].data || [];
      });
      setFeedbacks(feedbackMap);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      message.error("Không thể tải danh sách bài viết.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsAndFeedbacks();
  }, []);

  const handleInteractionChange = (blogId, key, value) => {
    setInteractions((prev) => ({
      ...prev,
      [blogId]: { ...(prev[blogId] || {}), [key]: value },
    }));
  };

  const handleSubmitFeedback = async (blogId) => {
    if (!user || !user.premium) {
      message.error("Bạn không có quyền thực hiện chức năng này.");
      return;
    }

    const interaction = interactions[blogId];
    if (!interaction?.rating || interaction.rating < 1) {
      message.warning("Vui lòng chọn số sao đánh giá.");
      return;
    }
    if (!interaction?.feedback?.trim()) {
      message.warning("Vui lòng nhập nội dung nhận xét của bạn.");
      return;
    }

    setSubmitLoading((prev) => ({ ...prev, [blogId]: true }));

    try {
      const payload = {
        blogId,
        accountId: user.id,
        rating: interaction.rating,
        comment: interaction.feedback.trim(),
      };

      const response = await api.post("/feedbacks", payload);

      if (response.status === 201 || response.status === 200) {
        message.success("Cảm ơn bạn đã gửi đánh giá!");

        const newFeedback = {
          ...response.data,
          user: { username: user.username, avatarUrl: user.avatarUrl },
        };

        setFeedbacks((prev) => ({
          ...prev,
          [blogId]: [newFeedback, ...(prev[blogId] || [])],
        }));

        setInteractions((prev) => ({
          ...prev,
          [blogId]: { rating: 0, feedback: "" },
        }));
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Gửi đánh giá thất bại. Vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setSubmitLoading((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  if (pageLoading) {
    return <PageSpinner tip="Đang tải trang blog..." />;
  }

  return (
    // Container chính với hiệu ứng Aurora
    <div className="relative min-h-screen w-full bg-gray-900 overflow-hidden isolate">
      {/* Các đốm màu nền tạo hiệu ứng Aurora */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-sky-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Title
          level={1}
          className="text-center mb-12 text-4xl font-bold text-white tracking-wider"
        >
          Khám Phá Blog
        </Title>
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                user={user}
                interactions={interactions}
                feedbacks={feedbacks}
                handlers={{
                  handleInteractionChange,
                  handleSubmitFeedback,
                  submitLoading,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Text className="text-lg text-gray-400">
              Không có bài viết nào để hiển thị.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
