import { Button, Form, Input, Modal, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import api from './../../../configs/axios';

function UserManagement() {

  const [open, setOpen] = useState(false);
  const [datas, setDatas] = useState([]);
// lấy dữ liệu gửi xuống back-end
  const handleSubmit = (values) => {
    //value giá trị người dùng nhập trên form 

    // nhiệm vụ: cầm cục data chuyển xuống cho back-end
    try{

    }catch(error){}
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },


  ];
  const fetchUser = async () => {
    try {
      const response = await api.get("user");
      setDatas(response.data);

    } catch (error) { }
  };
  // ue(d/n hanh dong,[]: d/n dependency list: khi nao thi hanh dong trc dc chay)
  // [] => chay 1 lan duy nhat khi load page
  // () => {} : goi la anonymous function vi la ham ko co ten
  // [name]: chay moi khi ma bien name thay doi 
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add new User</Button>
      <Table columns={columns} dataSource={datas} />
      <Modal open={open} title="Add new User">
        <Form labelCol={{span:24,}} onFinish={handleSubmit}>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              <Option value="ADMIN">Admin</Option>
              <Option value="USER">User</Option>
              <Option value="USER">COACH</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement;