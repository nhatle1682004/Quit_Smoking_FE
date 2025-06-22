import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Tooltip,
  Badge,
  Card,
  Typography,
  Form,
  Spin,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

function BlogModeration() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: "pending",
    keyword: "",
  });
  const [viewingBlog, setViewingBlog] = useState(null);
  const [rejectionModal, setRejectionModal] = useState(false);
  const [rejectionForm] = Form.useForm();
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  // Mô phỏng dữ liệu - trong thực tế sẽ được lấy từ API
  useEffect(() => {
    fetchBlogs();
  }, [filters, pagination.current, pagination.pageSize]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Trong thực tế, thay thế đoạn này bằng API call thực
      // const response = await api.get('/blogs/moderation', {
      //   params: {
      //     status: filters.status,
      //     keyword: filters.keyword,
      //     page: pagination.current,
      //     pageSize: pagination.pageSize
      //   }
      // });

      // Dữ liệu mẫu
      const mockData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        title: `Bài viết về cai thuốc lá ${i + 1}`,
        author: `Tác giả ${(i % 5) + 1}`,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: i % 3 === 0 ? "pending" : i % 3 === 1 ? "approved" : "rejected",
        content: `Đây là nội dung chi tiết của bài viết về cai thuốc lá. Bài viết này mô tả các phương pháp giúp người hút thuốc có thể từ bỏ thói quen này. Phương pháp số ${
          i + 1
        } được cho là hiệu quả nhất.`,
        rejectionReason:
          i % 3 === 2
            ? "Nội dung không phù hợp với tiêu chuẩn cộng đồng"
            : null,
      }));

      const filteredData = mockData.filter((blog) => {
        const matchStatus =
          filters.status === "all" || blog.status === filters.status;
        const matchKeyword =
          !filters.keyword ||
          blog.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          blog.author.toLowerCase().includes(filters.keyword.toLowerCase());
        return matchStatus && matchKeyword;
      });

      setBlogs(filteredData);
      setPagination({
        ...pagination,
        total: filteredData.length,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      message.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleStatusFilterChange = (value) => {
    setFilters({
      ...filters,
      status: value,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleSearch = (value) => {
    setFilters({
      ...filters,
      keyword: value,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const viewBlogDetails = (blog) => {
    setViewingBlog(blog);
  };

  const closeBlogDetails = () => {
    setViewingBlog(null);
  };

  const showRejectionModal = (blogId) => {
    setSelectedBlogId(blogId);
    setRejectionModal(true);
  };

  const handleRejectSubmit = async (values) => {
    try {
      // Trong thực tế, gọi API để từ chối blog
      // await api.put(`/blogs/${selectedBlogId}/reject`, { reason: values.rejectionReason });

      message.success("Đã từ chối bài viết");
      setRejectionModal(false);
      rejectionForm.resetFields();

      // Cập nhật UI
      setBlogs(
        blogs.map((blog) =>
          blog.id === selectedBlogId
            ? {
                ...blog,
                status: "rejected",
                rejectionReason: values.rejectionReason,
              }
            : blog
        )
      );
    } catch (error) {
      console.error("Error rejecting blog:", error);
      message.error("Không thể từ chối bài viết");
    }
  };

  const approveBlog = async (blogId) => {
    try {
      // Trong thực tế, gọi API để duyệt blog
      // await api.put(`/blogs/${blogId}/approve`);

      message.success("Đã duyệt bài viết");

      // Cập nhật UI
      setBlogs(
        blogs.map((blog) =>
          blog.id === blogId
            ? { ...blog, status: "approved", rejectionReason: null }
            : blog
        )
      );
    } catch (error) {
      console.error("Error approving blog:", error);
      message.error("Không thể duyệt bài viết");
    }
  };

  const handleDeleteBlog = (blogId) => {
    confirm({
      title: "Bạn có chắc muốn xóa bài viết này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Trong thực tế, gọi API để xóa blog
          // await api.delete(`/blogs/${blogId}`);

          message.success("Đã xóa bài viết");

          // Cập nhật UI
          setBlogs(blogs.filter((blog) => blog.id !== blogId));
        } catch (error) {
          console.error("Error deleting blog:", error);
          message.error("Không thể xóa bài viết");
        }
      },
    });
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="gold">Chờ duyệt</Tag>;
      case "approved":
        return <Tag color="green">Đã duyệt</Tag>;
      case "rejected":
        return <Tag color="red">Đã từ chối</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title="Xem chi tiết">
          <a onClick={() => viewBlogDetails(record)}>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Hành động",
      key: "action",
      width: 240,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewBlogDetails(record)}
          >
            Xem
          </Button>

          {record.status !== "approved" && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => approveBlog(record.id)}
            >
              Duyệt
            </Button>
          )}

          {record.status !== "rejected" && (
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => showRejectionModal(record.id)}
            >
              Từ chối
            </Button>
          )}

          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteBlog(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="blog-moderation-container p-6">
      <Card bordered={false}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="mb-0">
              Quản lý bài viết
            </Title>
            <Text type="secondary">
              Kiểm duyệt các bài viết để đảm bảo tuân thủ quy định
            </Text>
          </div>

          <Badge
            count={blogs.filter((blog) => blog.status === "pending").length}
            overflowCount={99}
          >
            <Button type="primary">Bài viết chờ duyệt</Button>
          </Badge>
        </div>

        <div className="flex flex-wrap justify-between mb-4 gap-2">
          <div className="flex gap-2">
            <Select
              defaultValue="pending"
              style={{ width: 150 }}
              onChange={handleStatusFilterChange}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả</Option>
              <Option value="pending">Chờ duyệt</Option>
              <Option value="approved">Đã duyệt</Option>
              <Option value="rejected">Đã từ chối</Option>
            </Select>

            <Input.Search
              placeholder="Tìm theo tiêu đề, tác giả"
              onSearch={handleSearch}
              enterButton
              style={{ width: 260 }}
            />
          </div>

          <Button type="default" onClick={fetchBlogs}>
            Làm mới dữ liệu
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={blogs}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          bordered
          scroll={{ x: true }}
        />
      </Card>

      {/* Modal xem chi tiết bài viết */}
      <Modal
        title={viewingBlog?.title}
        open={viewingBlog !== null}
        onCancel={closeBlogDetails}
        width={800}
        footer={[
          <Button key="close" onClick={closeBlogDetails}>
            Đóng
          </Button>,
          viewingBlog?.status !== "approved" && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                approveBlog(viewingBlog.id);
                closeBlogDetails();
              }}
            >
              Duyệt
            </Button>
          ),
          viewingBlog?.status !== "rejected" && (
            <Button
              key="reject"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                closeBlogDetails();
                showRejectionModal(viewingBlog.id);
              }}
            >
              Từ chối
            </Button>
          ),
        ].filter(Boolean)}
      >
        {viewingBlog && (
          <div>
            <div className="mb-4">
              <div className="mb-2">
                <Text strong>Tác giả:</Text> {viewingBlog.author}
              </div>
              <div className="mb-2">
                <Text strong>Ngày tạo:</Text>{" "}
                {new Date(viewingBlog.createdAt).toLocaleString("vi-VN")}
              </div>
              <div>
                <Text strong>Trạng thái:</Text>{" "}
                {getStatusTag(viewingBlog.status)}
              </div>
              {viewingBlog.rejectionReason && (
                <div className="mt-2">
                  <Text strong type="danger">
                    Lý do từ chối:
                  </Text>{" "}
                  {viewingBlog.rejectionReason}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <Title level={4}>Nội dung bài viết</Title>
              <Paragraph>{viewingBlog.content}</Paragraph>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal từ chối bài viết */}
      <Modal
        title="Từ chối bài viết"
        open={rejectionModal}
        onCancel={() => {
          setRejectionModal(false);
          rejectionForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={rejectionForm}
          layout="vertical"
          onFinish={handleRejectSubmit}
        >
          <Form.Item
            name="rejectionReason"
            label="Lý do từ chối"
            rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập lý do từ chối bài viết này..."
            />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setRejectionModal(false);
                rejectionForm.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" danger htmlType="submit">
              Xác nhận từ chối
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default BlogModeration;
