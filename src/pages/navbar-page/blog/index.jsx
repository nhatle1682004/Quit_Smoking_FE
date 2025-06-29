import React, { useEffect, useState } from "react";
import { Card, Rate, Input, Button, message } from "antd";
import api from "../../../configs/axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const { TextArea } = Input;

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [feedbacks, setFeedbacks] = useState({}); // blogId -> array of feedback
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      message.error("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacksForBlog = async (blogId) => {
    try {
      const response = await api.get(`/feedbacks/blog/${blogId}`);
      setFeedbacks((prev) => ({ ...prev, [blogId]: response.data }));
    } catch (error) {
      console.error(`Failed to fetch feedbacks for blog ${blogId}:`, error);
      // Do not show error message for feedback fetching
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    blogs.forEach((blog) => {
      fetchFeedbacksForBlog(blog.id);
    });
  }, [blogs]);

  const handleInteractionChange = (blogId, key, value) => {
    setInteractions((prev) => ({
      ...prev,
      [blogId]: {
        ...(prev[blogId] || {}),
        [key]: value,
      },
    }));
  };

  const handleSubmitFeedback = async (blogId) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này.");
      return;
    }

    // Assuming user object from redux has an `isPremium` flag
    if (!user.premium) {
      message.error("Chỉ có thành viên Premium mới có thể để lại đánh giá.");
      return;
    }

    const interaction = interactions[blogId];
    if (!interaction?.rating || !interaction?.feedback?.trim()) {
      message.warning("Vui lòng cung cấp cả đánh giá sao và nhận xét.");
      return;
    }

    try {
      const payload = {
        blogId: blogId,
        accountId: user.id, // Dynamically get accountId from the logged-in user
        rating: interaction.rating,
        comment: interaction.feedback.trim(),
      };

      const response = await api.post("/feedbacks", payload);

      if (response.status === 200 || response.status === 201) {
        message.success("Cảm ơn bạn đã gửi đánh giá!");
        // Add the new feedback to the list without re-fetching
        const newFeedback = {
          ...response.data,
          user: { username: user.username },
        };
        setFeedbacks((prev) => ({
          ...prev,
          [blogId]: [newFeedback, ...(prev[blogId] || [])],
        }));
        // Clear the input fields for this blog
        setInteractions((prev) => ({
          ...prev,
          [blogId]: { rating: 0, feedback: "" },
        }));
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Gửi đánh giá thất bại. Vui lòng thử lại.";
      message.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Khám phá Blog
      </h1>
      {loading ? (
        <div className="text-center">Đang tải...</div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
              cover={
                <img
                  alt={blog.title}
                  src={blog.imgUrl || "/placeholder.jpg"} // Provide a fallback image
                  className="h-56 w-full object-cover"
                />
              }
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4">{blog.content}</p>

              {/* Existing Feedbacks */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                <h3 className="font-semibold text-lg mb-2 border-b pb-2">
                  Phản hồi từ cộng đồng
                </h3>
                {feedbacks[blog.id] && feedbacks[blog.id].length > 0 ? (
                  feedbacks[blog.id].map((fb, index) => (
                    <div
                      key={index}
                      className="mb-3 border-b border-gray-200 pb-2"
                    >
                      <p className="font-semibold text-gray-800">
                        {fb.user?.username || "Người dùng ẩn danh"}
                        <Rate
                          disabled
                          allowHalf
                          defaultValue={fb.rating}
                          className="text-xs ml-2"
                        />
                      </p>
                      <p className="text-gray-600 text-sm italic">
                        {fb.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Chưa có phản hồi.</p>
                )}
              </div>

              {/* New Feedback Section - Conditional Rendering */}
              {user ? (
                user.premium ? (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-md font-medium text-gray-700 mb-2">
                      Đánh giá bài viết:
                    </p>
                    <Rate
                      allowHalf
                      value={interactions[blog.id]?.rating || 0}
                      onChange={(value) =>
                        handleInteractionChange(blog.id, "rating", value)
                      }
                      className="text-yellow-500 text-xl"
                    />
                    <TextArea
                      rows={3}
                      placeholder="Viết nhận xét của bạn..."
                      value={interactions[blog.id]?.feedback || ""}
                      onChange={(e) =>
                        handleInteractionChange(
                          blog.id,
                          "feedback",
                          e.target.value
                        )
                      }
                      className="mt-4 p-3 border border-gray-300 rounded-lg"
                    />
                    <Button
                      type="primary"
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                      onClick={() => handleSubmitFeedback(blog.id)}
                    >
                      Gửi đánh giá
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 text-center">
                    <p className="text-gray-600 italic mb-2">
                      Chỉ có thành viên Premium mới có thể để lại đánh giá.
                    </p>
                    <Button
                      type="primary"
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Link to="/premium">Nâng cấp ngay</Link>
                    </Button>
                  </div>
                )
              ) : (
                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-gray-600 italic mb-2">
                    Vui lòng đăng nhập để đánh giá.
                  </p>
                  <Button
                    type="primary"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">Không có bài viết nào để hiển thị.</p>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
