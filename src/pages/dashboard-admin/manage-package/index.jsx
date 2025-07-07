import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Switch,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function ManagePackage() {
  const [open, setOpen] = useState(false);
  const [initialPackages, setInitialPackages] = useState([]);
  const [form] = Form.useForm(); // dai dien cho form moi lan tuong tac thi goi bien nay
  const [isUpdate, setIsUpdate] = useState(null);

  const fetchPackages = async () => {
    try {
      const response = await api.get("/package");
      console.log(response.data);
      setInitialPackages(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Lấy dữ liệu thất bại");
    }
  };
  useEffect(() => {
    fetchPackages();
  }, []);
  const handleSubmit = async (values) => {
    try {
      if (isUpdate) {
        // Gọi PUT nếu đang cập nhật
        try {
          await api.put(`/package/${isUpdate}`, values);
          toast.success("Cập nhật gói thành công");
        } catch (err) {
          console.log(err);
          toast.error("Cập nhật gói thất bại");
        }
      } else {
        // Gọi POST nếu đang thêm mới
        try {
          await api.post("/package", values);
          toast.success("Thêm gói thành công");
        } catch (err) {
          console.log(err);
          toast.error("Thêm gói thất bại");
        }
      }

      fetchPackages(); //  Chỉ gọi lại khi thành công
    } catch (err) {
      console.log(err);
      toast.error(isUpdate ? "Cập nhật gói thất bại" : "Thêm gói thất bại");
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/package/${id}`);
      toast.success("Xóa gói thành công");
      fetchPackages(); // Reload lại danh sách
    } catch (err) {
      console.log(err);
      toast.error("Xóa gói thất bại");
    }
  };

  const columns = [
    {
      title:"Id",
      dataIndex:"id",
      key:"id",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "name",
    },
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) =>
        (text ? text.split(/;|\n/) : []).map((item, idx) => (
          <li key={idx} style={{ listStyle: "none", marginBottom: 4 }}>
            <span role="img" aria-label="tick">
              ✅
            </span>{" "}
            {item.trim()}
          </li>
        )),
    },
    {
      title: "Coach",
      dataIndex: "coachSupport",
      key: "coachSupport",
      render: (value) =>
        value ? (
          <span style={{ color: "green" }}>Có</span>
        ) : (
          <span style={{ color: "red" }}>Không</span>
        ),
    },

    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
              setIsUpdate(record.id);
              form.setFieldsValue({
                ...record,
                coachSupport: Boolean(record.coachSupport), // ép kiểu sang boolean
              });
            }}
          >
            sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa gói này không?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger style={{ marginLeft: 8 }}>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          form.resetFields();
          setOpen(true);
          setIsUpdate(null);
        }}
      >
        Thêm gói mới
      </Button>
      <Table dataSource={initialPackages} columns={columns} form={form} />
      <Modal
        title={isUpdate ? "Cập nhật gói" : "Thêm gói mới"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setIsUpdate(null);
        }}
        onOk={() => {
          form.submit();
          setOpen(false);
        }}
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item
            name="code"
            label="Mã sản phẩm"
            rules={[
              { required: true, message: "Vui lòng nhập mã sản phẩm!" },
              { max: 50, message: "Mã sản phẩm không được quá 50 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập mã sản phẩm" />
          </Form.Item>

          {/* Trường Name */}
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[
              { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              { min: 3, message: "Tên sản phẩm phải có ít nhất 3 ký tự!" },
              { max: 255, message: "Tên sản phẩm không được quá 255 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          {/* Trường Description */}
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ max: 1000, message: "Mô tả không được quá 1000 ký tự!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          {/* Trường Price */}
          <Form.Item
            name="price"
            label="Giá"
            rules={[
              { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              { type: "number", min: 0.01, message: "Giá phải là số dương!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0.01}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập giá sản phẩm"
            />
          </Form.Item>

          {/* Trường Duration */}
          <Form.Item
            name="duration"
            label="Thời lượng (ngày)"
            rules={[
              { required: true, message: "Vui lòng nhập thời lượng!" },
              {
                type: "number",
                min: 1,
                message: "Thời lượng phải là số nguyên dương!",
              },
              { type: "integer", message: "Thời lượng phải là số nguyên!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              precision={0} // Đảm bảo chỉ nhập số nguyên
              placeholder="Nhập thời lượng sản phẩm "
            />
          </Form.Item>

          {/* Trường Coach Support */}
          <Form.Item
            name="coachSupport"
            label="Hỗ trợ từ huấn luyện viên"
            valuePropName="checked" // Quan trọng cho Switch
          >
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManagePackage;
