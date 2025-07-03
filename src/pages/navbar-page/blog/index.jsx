import React, { useEffect, useState } from "react";
import { Rate, Input, Button, message, Spin, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

// --- CÁC COMPONENT CON (ĐÃ CHUYỂN SANG GIAO DIỆN SÁNG) ---

const PageSpinner = ({ tip }) => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-800">
    <Spin size="large" tip={tip} />
  </div>
);

const ActionPrompt = ({ title, buttonText, buttonLink, isPremiumAction }) => (
  <div className="p-4 text-center bg-gray-50 rounded-lg">
    <Text className="mb-3 block text-gray-500 italic">{title}</Text>
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
    <Title level={5} className="text-gray-800">
      Phản hồi từ cộng đồng
    </Title>
    <div className="mt-3 p-4 bg-gray-100 rounded-lg max-h-48 overflow-y-auto space-y-4 border border-gray-200">
      {feedbacks && feedbacks.length > 0 ? (
        feedbacks.map((fb, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Avatar src={fb.user?.avatarUrl} icon={<UserOutlined />} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Text strong className="text-gray-900">
                  {fb.user?.username || "Người dùng"}
                </Text>
                <Rate
                  disabled
                  allowHalf
                  value={fb.rating}
                  className="text-xs !text-yellow-500"
                />
              </div>
              <Paragraph className="text-gray-600 mt-1 mb-0 text-sm">
                {fb.comment}
              </Paragraph>
            </div>
          </div>
        ))
      ) : (
        <Text className="text-gray-500 italic">Chưa có phản hồi nào.</Text>
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
      <Title level={5} className="text-gray-800">
        Để lại đánh giá của bạn
      </Title>
      <div className="mt-3 space-y-4">
        <Rate
          allowHalf
          value={interaction?.rating || 0}
          onChange={(value) => onInteractionChange(blogId, "rating", value)}
          className="text-2xl !text-yellow-500 hover:!text-yellow-400"
        />
        <TextArea
          rows={3}
          placeholder="Viết nhận xét của bạn ở đây..."
          value={interaction?.feedback || ""}
          onChange={(e) =>
            onInteractionChange(blogId, "feedback", e.target.value)
          }
          className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
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
    // Card với style sáng, đổ bóng nhẹ
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <img
        alt={blog.title}
        // Sử dụng blog.imageUrl từ API, nếu không có thì dùng ảnh placeholder
        src={
          blog.imageUrl ||
          "https://via.placeholder.com/400x225.png?text=H%C3%ACnh+%E1%BA%A3nh+Blog"
        }
        className="h-56 w-full object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <Title level={4} className="font-semibold text-gray-900 mb-2">
            {blog.title}
          </Title>
          <Paragraph
            className="text-gray-600"
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: (
                <span className="text-purple-600 font-semibold cursor-pointer">
                  đọc thêm
                </span>
              ),
            }}
          >
            {blog.content}
          </Paragraph>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <FeedbackList feedbacks={feedbacks[blog.id]} />
          <div className="mt-6">{renderFeedbackSection()}</div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---

function BlogPage() {
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
    // Container chính với nền sáng
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Title
          level={1}
          className="text-center mb-12 text-4xl font-bold text-gray-900 tracking-tight"
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
            <Text className="text-lg text-gray-500">
              Không có bài viết nào để hiển thị.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
