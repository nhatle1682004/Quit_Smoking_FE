import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Rate, Input, Button, message } from "antd";

const { TextArea } = Input;
const API_BASE = "https://68512c568612b47a2c08e9af.mockapi.io";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [feedbacks, setFeedbacks] = useState({}); // blogId -> array of feedback
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/blogs`);
      setBlogs(res.data);

      // Gọi luôn feedbacks từng blog
      for (const blog of res.data) {
        const fb = await axios.get(
          `${API_BASE}/blogInteractions?blogId=${blog.id}`
        );
        setFeedbacks((prev) => ({ ...prev, [blog.id]: fb.data }));
      }

      message.success("Tải danh sách blog thành công!");
    } catch (err) {
      message.error("Không thể tải danh sách blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (blogId) => {
    const interaction = interactions[blogId];
    if (!interaction?.rating || !interaction?.feedback?.trim()) {
      return message.warning("Vui lòng đánh giá và nhập nhận xét của bạn.");
    }

    try {
      const payload = {
        blogId: String(blogId),
        userId: "guest",
        username: "Khách ẩn danh",
        rating: interaction.rating,
        feedback: interaction.feedback.trim(),
        createdAt: new Date().toISOString(),
      };

      await axios.post(`${API_BASE}/blogInteractions`, payload);
      message.success("Phản hồi đã được gửi!");

      // Cập nhật lại feedback
      const updated = await axios.get(
        `${API_BASE}/blogInteractions?blogId=${blogId}`
      );
      setFeedbacks((prev) => ({ ...prev, [blogId]: updated.data }));

      // Reset form
      setInteractions((prev) => ({
        ...prev,
        [blogId]: { rating: 0, feedback: "" },
      }));
    } catch (err) {
      console.error("Lỗi gửi phản hồi:", err);
      message.error("Không thể gửi phản hồi.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-wide">
        Khám phá Blog của chúng tôi
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Card
              key={blog.id}
              className="shadow-xl rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out border border-gray-200"
              hoverable
              title={
                <h2 className="text-2xl font-semibold text-gray-800 truncate">
                  {blog.title}
                </h2>
              }
            >
              <p className="text-gray-700 leading-relaxed mb-4">
                {blog.content?.slice(0, 180)}
                {blog.content?.length > 180 ? "..." : ""}
              </p>
              <p className="text-sm text-gray-500 mb-4 font-light">
                Đăng ngày:{" "}
                {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
              </p>

              {/* Hiển thị feedback của người khác */}
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-2">
                  Phản hồi từ người dùng:
                </p>
                {feedbacks[blog.id]?.length > 0 ? (
                  feedbacks[blog.id].map((fb) => (
                    <div
                      key={fb.id}
                      className="border p-2 mb-2 rounded bg-gray-50"
                    >
                      <p className="text-sm font-semibold text-blue-700">
                        {fb.username || "Ẩn danh"}{" "}
                        <Rate
                          disabled
                          value={fb.rating}
                          className="text-sm ml-2"
                        />
                      </p>
                      <p className="text-gray-600 text-sm italic">
                        {fb.feedback}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Chưa có phản hồi.</p>
                )}
              </div>

              {/* Gửi feedback mới */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-md font-medium text-gray-700 mb-2">
                  Đánh giá bài viết:
                </p>
                <Rate
                  allowHalf
                  defaultValue={0}
                  value={interactions[blog.id]?.rating || 0}
                  onChange={(value) =>
                    setInteractions((prev) => ({
                      ...prev,
                      [blog.id]: {
                        ...prev[blog.id],
                        rating: value,
                      },
                    }))
                  }
                  className="text-yellow-500 text-xl"
                />
                <TextArea
                  rows={3}
                  placeholder="Viết nhận xét của bạn về bài viết này..."
                  value={interactions[blog.id]?.feedback || ""}
                  onChange={(e) =>
                    setInteractions((prev) => ({
                      ...prev,
                      [blog.id]: {
                        ...prev[blog.id],
                        feedback: e.target.value,
                      },
                    }))
                  }
                  className="mt-4 p-3 border border-gray-300 rounded-lg"
                />
                <Button
                  type="primary"
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={() => handleSubmitFeedback(blog.id)}
                >
                  Gửi đánh giá và nhận xét
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-2xl text-gray-500">Không có bài viết nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
