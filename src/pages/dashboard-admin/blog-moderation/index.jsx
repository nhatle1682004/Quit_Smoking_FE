import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Tooltip,
  Card,
  Typography,
  Form,
  message,
} from "antd";
import {
  EditOutlined, // Changed from CheckCircleOutlined/CloseCircleOutlined
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

// Axios instance for API calls
const api = axios.create({
  baseURL: "https://68512c568612b47a2c08e9af.mockapi.io",
});

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

function BlogModeration() {
  // State variables for blogs, loading, pagination, filters, and modals
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    keyword: "",
  });
  const [viewingBlog, setViewingBlog] = useState(null);

  // New state for editing blog, null for create, object for edit
  const [blogFormModalVisible, setBlogFormModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); // Stores the blog object being edited

  const [blogForm] = Form.useForm(); // Single form instance for create/edit

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/blogs");
      let data = response.data;

      // Filter data based on current status and keyword filters
      const filteredData = data.filter((blog) => {
        const matchKeyword =
          !filters.keyword ||
          blog.title.toLowerCase().includes(filters.keyword.toLowerCase());
        return matchKeyword;
      });

      setBlogs(filteredData);
      setPagination((p) => ({
        ...p,
        total: filteredData.length,
      }));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      message.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }, [filters.keyword]);

  // Effect hook to fetch blogs when filters or pagination change
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle table pagination and sorting changes
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Handle search input change
  const handleSearch = (value) => {
    setFilters({ ...filters, keyword: value });
    setPagination({ ...pagination, current: 1 });
  };

  // Set selected blog for detailed view
  const viewBlogDetails = (blog) => {
    setViewingBlog(blog);
  };

  // Close the blog details modal
  const closeBlogDetails = () => {
    setViewingBlog(null);
  };

  // Show the blog form modal for creation
  const showCreateBlogModal = () => {
    setEditingBlog(null); // Clear editing blog state for create mode
    blogForm.resetFields(); // Reset form fields
    setBlogFormModalVisible(true);
  };

  // Show the blog form modal for editing
  const showEditBlogModal = (blog) => {
    setEditingBlog(blog); // Set the blog to be edited
    blogForm.setFieldsValue(blog); // Populate form fields with blog data
    setBlogFormModalVisible(true);
  };

  // Handle form submission for both create and edit
  const handleBlogFormSubmit = async (values) => {
    try {
      if (editingBlog) {
        // Edit existing blog
        await api.put(`/blogs/${editingBlog.id}`, {
          ...values,
          updatedAt: new Date().toISOString(), // Add update timestamp
        });
        message.success("Đã cập nhật bài viết");
      } else {
        // Create new blog
        await api.post("/blogs", {
          ...values,
          status: "approved", // New blogs are "approved" by default
          createdAt: new Date().toISOString(),
        });
        message.success("Đã tạo bài viết mới");
      }
      setBlogFormModalVisible(false); // Close modal
      blogForm.resetFields(); // Reset form fields
      fetchBlogs(); // Refresh blog list
    } catch (error) {
      console.error("Error submitting blog:", error);
      message.error(`Không thể ${editingBlog ? "cập nhật" : "tạo"} bài viết`);
    }
  };

  // Handle blog deletion with confirmation
  const handleDeleteBlog = (blogId) => {
    if (!blogId) {
      console.error("Delete operation cancelled: blogId is missing.");
      message.error("Không thể xóa bài viết do thiếu ID.");
      return;
    }

    confirm({
      title: "Bạn có chắc muốn xóa bài viết này?",
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await api.delete(`/blogs/${blogId}`);
          message.success("Đã xóa bài viết");
          // Optimistically update the UI instead of refetching
          const newBlogs = blogs.filter((blog) => blog.id !== blogId);
          setBlogs(newBlogs);
          setPagination((p) => ({ ...p, total: newBlogs.length }));
        } catch (error) {
          const url = api.defaults.baseURL + `/blogs/${blogId}`;
          console.error(
            `Error deleting blog with id ${blogId} at ${url}:`,
            error
          );
          message.error("Lỗi khi xóa bài viết. Vui lòng thử lại.");
          // By re-throwing the error, we prevent the modal from closing
          throw error;
        }
      },
    });
  };

  // Table columns definition
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      responsive: ["lg"],
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title="Xem chi tiết" placement="topLeft">
          <a
            onClick={() => viewBlogDetails(record)}
            className="text-blue-600 hover:underline"
          >
            {text}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
      responsive: ["md"],
    },
    {
      title: "Hành động",
      key: "action",
      width: 240,
      render: (_, record) => (
        <Space size="small" className="flex flex-wrap gap-2">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => viewBlogDetails(record)}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditBlogModal(record)}
            className="rounded-lg shadow-sm bg-blue-500 hover:bg-blue-600 transition-all duration-200"
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBlog(record.id)}
            className="rounded-lg shadow-sm z-10"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-inter">
      <Card bordered={false} className="shadow-lg rounded-xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 border-gray-200">
          <div>
            <Title level={2} className="mb-1 text-gray-800">
              Quản lý bài viết
            </Title>
            <Text
              type="secondary"
              className="text-gray-500 text-sm sm:text-base"
            >
              Quản lý các bài viết trên hệ thống của bạn
            </Text>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
            {/* Removed pending badge as moderation is not needed */}
            <Button
              icon={<PlusOutlined />}
              onClick={showCreateBlogModal}
              className="w-full sm:w-auto rounded-lg shadow-sm border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600 flex items-center justify-center"
            >
              Tạo bài viết
            </Button>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input.Search
              placeholder="Tìm theo tiêu đề"
              onSearch={handleSearch}
              enterButton={
                <Button
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600 rounded-r-lg"
                >
                  <SearchOutlined />
                </Button>
              }
              className="rounded-lg shadow-sm w-full md:w-64"
            />
          </div>
          <Button
            type="default"
            onClick={fetchBlogs}
            className="rounded-lg shadow-sm border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 w-full md:w-auto flex items-center justify-center"
          >
            Làm mới dữ liệu
          </Button>
        </div>

        {/* Blog Table */}
        <Table
          columns={columns}
          dataSource={blogs}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          bordered={false}
          className="rounded-lg overflow-hidden shadow-md"
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Create/Edit Blog Modal */}
      <Modal
        title={
          <Title level={4} className="mb-0 text-gray-800">
            {editingBlog ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </Title>
        }
        open={blogFormModalVisible}
        onCancel={() => {
          setBlogFormModalVisible(false);
          blogForm.resetFields();
          setEditingBlog(null); // Clear editing blog when modal closes
        }}
        footer={null}
        destroyOnClose={true}
        className="rounded-lg"
      >
        <Form layout="vertical" form={blogForm} onFinish={handleBlogFormSubmit}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề bài viết!" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề..." className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung bài viết!" },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Nội dung chi tiết..."
              className="rounded-md"
            />
          </Form.Item>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
            <Button
              onClick={() => {
                setBlogFormModalVisible(false);
                blogForm.resetFields();
                setEditingBlog(null);
              }}
              className="rounded-lg"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-lg bg-blue-500 hover:bg-blue-600"
            >
              {editingBlog ? "Cập nhật" : "Tạo"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Blog Details Modal (remains the same) */}
      <Modal
        title={
          <Title level={4} className="mb-0 text-gray-800">
            Chi tiết bài viết:{" "}
            <span className="font-semibold">{viewingBlog?.title}</span>
          </Title>
        }
        open={viewingBlog !== null}
        onCancel={closeBlogDetails}
        footer={null}
        width={720}
        className="rounded-lg"
      >
        {viewingBlog && (
          <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
            <Paragraph className="text-gray-700 leading-relaxed text-base">
              <span className="font-medium text-gray-900">Ngày tạo:</span>{" "}
              {new Date(viewingBlog.createdAt).toLocaleString("vi-VN")}
            </Paragraph>
            {viewingBlog.updatedAt && (
              <Paragraph className="text-gray-700 leading-relaxed text-base">
                <span className="font-medium text-gray-900">
                  Cập nhật lần cuối:
                </span>{" "}
                {new Date(viewingBlog.updatedAt).toLocaleString("vi-VN")}
              </Paragraph>
            )}
            <Paragraph className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-800">
              <Title level={5} className="mt-0 mb-3 text-gray-900">
                Nội dung:
              </Title>
              {viewingBlog.content}
            </Paragraph>
          </div>
        )}
      </Modal>

      {/* Removed Rejection Reason Modal as moderation is not needed */}
    </div>
  );
}

export default BlogModeration;
