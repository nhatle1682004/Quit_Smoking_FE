import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Card,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import api from "./../../../configs/axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";

function UserManagement() {
  const { Title, Text } = Typography;
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [datas, setDatas] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await api.get("user");
      const users = response.data
        .filter((user) => user.role === "CUSTOMER")
        .map((user) => ({
          ...user,
          active: user.active === true || user.active === "true",
        }));
      setDatas(users);
    } catch {
      toast.error("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (values) => {
    setIsModalLoading(true);
    const payload = { ...values, role: "CUSTOMER" };
    try {
      if (editingUserId) {
        await api.put(`user/${editingUserId}`, payload);
        toast.success("Cập nhật thành công!");
      } else {
        await api.post("user", payload);
        toast.success("Tạo mới thành công!");
      }
      fetchUser();
      setOpen(false);
    } catch {
      toast.error("Thao tác thất bại!");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      toast.success("Đã xoá khách hàng!");
      fetchUser();
    } catch {
      toast.error("Lỗi khi xoá!");
    }
  };

  const handleRestoreUser = async (user) => {
    if (!user.active) {
      try {
        await api.put(`/user/${user.id}/restore`);
        toast.success("Khôi phục thành công!");
        fetchUser();
      } catch {
        toast.error("Không thể khôi phục!");
      }
    } else {
      toast.info("Tài khoản đang hoạt động.");
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
      title: "Avatar",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      width: 100,
      render: (avatarUrl) => (
        <Image
          width={60}
          height={60}
          src={avatarUrl}
          alt="avatar"
          style={{ objectFit: "cover", borderRadius: 8 }}
          fallback="https://via.placeholder.com/60x60?text=No+Img"
        />
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => text || "N/A",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender === "MALE" ? "Nam" : "Nữ"),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },

    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => {
              setOpen(true);
              setEditingUserId(record.id);
              form.setFieldsValue({ ...record });
            }}
            disabled={!record.active}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn xoá?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Hủy"
            disabled={!record.active}
          >
            <Button icon={<DeleteOutlined />} danger disabled={!record.active}>
              Xoá
            </Button>
          </Popconfirm>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => handleRestoreUser(record)}
            disabled={record.active}
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Quản lý Khách hàng
      </Title>

      <Card
        title="Danh sách Khách hàng"
        extra={
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setOpen(true);
              setEditingUserId(null);
              form.resetFields();
              form.setFieldsValue({
                gender: "MALE",
                active: true,
                // premium: false,
              });
            }}
          >
            Thêm Khách hàng
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={datas}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>

      <Modal
        title={editingUserId ? "Chỉnh sửa Khách hàng" : "Tạo Khách hàng mới"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingUserId(null);
        }}
        footer={null}
        centered
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên!" },
              { min: 5, message: "Tối thiểu 5 ký tự." },
              {
                pattern: /^(?!\s)[A-Za-zÀ-ỹ\s]+$/,
                message:
                  "Họ và tên không được bắt đầu bằng khoảng trắng, chứa số hoặc ký tự đặc biệt!",
              },
            ]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "Không khoảng trắng hoặc ký tự đặc biệt!",
              },
            ]}
          >
            <Input disabled={!!editingUserId} placeholder="nguyenvana" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="email@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Avatar URL"
            name="avatarUrl"
            rules={[
              { required: true, message: "Hãy nhập liên kết ảnh!" },
              { type: "url", message: "Phải là một URL hợp lệ!" },
            ]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          {form.getFieldValue("avatarUrl") && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Image
                width={100}
                height={100}
                src={form.getFieldValue("avatarUrl")}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <Text type="secondary" style={{ display: "block" }}>
                Xem trước ảnh đại diện
              </Text>
            </div>
          )}

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Radio.Group>
              <Radio value="MALE">Nam</Radio>
              <Radio value="FEMALE">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          {!editingUserId && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Tối thiểu 6 ký tự!" },
                {
                  pattern: /^\S+$/,
                  message: "Không được chứa khoảng trắng!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          {/* <Form.Item
            label="Tài khoản Premium"
            name="premium"
            valuePropName="checked"
          >
            <Checkbox>Premium</Checkbox>
          </Form.Item> */}

          <Form.Item name="role" initialValue="CUSTOMER" hidden>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isModalLoading}
            >
              {editingUserId ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
