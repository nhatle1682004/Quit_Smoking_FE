import { Button, Form, Input, InputNumber, Modal, Popconfirm, Switch, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';



function ManagePackage() {
    const [open, setOpen] = useState(false);
    const [initialPackages, setInitialPackages] = useState([]);
    const [form] = Form.useForm();// dai dien cho form moi lan tuong tac thi goi bien nay
    const [isUpdate, setIsUpdate] = useState([]);

    const fetchPackages = async () => {
        try {
            const response = await axios.get('https://685b9c6789952852c2da2b80.mockapi.io/package');
            console.log(response.data);
            setInitialPackages(response.data);
        } catch (err) {
            console.log(err);
            toast.error("Lấy dữ liệu thất bại");
        }
    }
    useEffect(() => {
        fetchPackages();
    }, []);
    const handleSubmit = async (values) => {
        try {
            if (isUpdate) {
                // Gọi PUT nếu đang cập nhật
                try {
                    await axios.put(`https://685b9c6789952852c2da2b80.mockapi.io/package/${isUpdate}`, values);
                    toast.success("Cập nhật gói thành công");
                } catch (err) {
                    console.log(err);
                    toast.error("Cập nhật gói thất bại");
                }
            } else {
                // Gọi POST nếu đang thêm mới
                try {
                    await axios.post('https://685b9c6789952852c2da2b80.mockapi.io/package', values);
                    toast.success("Thêm gói thành công");
                } catch (err) {
                    console.log(err);
                    toast.error("Thêm gói thất bại");
                }
            }

            fetchPackages();          //  Chỉ gọi lại khi thành công

        } catch (err) {
            console.log(err);
            toast.error(isUpdate ? "Cập nhật gói thất bại" : "Thêm gói thất bại");
        }
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://685b9c6789952852c2da2b80.mockapi.io/package/${id}`);
            toast.success("Xóa gói thành công");
            fetchPackages();// Reload lại danh sách
        } catch (err) {
            console.log(err);
            toast.error("Xóa gói thất bại");
        }
    }



    const columns = [
        {
            title: "Tên gói",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Thời gian",
            dataIndex: "durationInDays",
            key: "durationInDays",
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
        },
        {
            title: "Cấp độ",
            dataIndex: "level",
            key: "level",
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            render: (text) => (text ? "Hoạt động" : "Không hoạt động"),
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            render: (text, record) => (
                <>
                    <Button type='primary' onClick={() => {
                        setOpen(true);
                        setIsUpdate(record.id);
                        form.setFieldsValue(record);
                    }}>
                        sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa gói này không?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger style={{ marginLeft: 8 }}>Xóa</Button>
                    </Popconfirm>
                </>
            )
        }

    ];

    return (
        <div>
            <Button type='primary' onClick={() => {
                form.resetFields();
                setOpen(true);
                setIsUpdate(null);

            }}>Thêm gói mới</Button>
            <Table dataSource={initialPackages} columns={columns} form={form} />
            <Modal title={isUpdate ? 'Cập nhật gói' : 'Thêm gói mới'}
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setIsUpdate(null);
                }}
                onOk={() => {
                    form.submit();
                }}
            >
                <Form layout='vertical' onFinish={handleSubmit}form={form}>
                    <Form.Item
                        label="Tên gói"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên gói" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                            { required: true, message: "Vui lòng nhập mô tả" },
                            { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
                        ]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Thời gian (ngày)"
                        name="durationInDays"
                        rules={[
                            { required: true, message: "Vui lòng nhập số ngày" },
                            { type: "number", min: 1, message: "Phải lớn hơn 0" },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Giá (VNĐ)"
                        name="price"
                        rules={[
                            { required: true, message: "Vui lòng nhập giá" },
                            { type: "number", min: 0, message: "Giá không được âm" },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Cấp độ"
                        name="level"
                        rules={[{ required: true, message: "Vui lòng nhập cấp độ" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Kích hoạt"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isUpdate ? 'Cập nhật gói' : 'Thêm gói mới'}
                        </Button>
                    </Form.Item>

                </Form>

            </Modal>
        </div>
    );
};


export default ManagePackage;