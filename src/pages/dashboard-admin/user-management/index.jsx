import React from 'react'

function UserManagement() {
  return (
    <div>
      {/* Nút thêm người dùng */}
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          setEditingUserId(null);
          form.resetFields();
        }}
      >
        Add New User
      </Button>

      {/* Bảng dữ liệu người dùng */}
      <Table columns={columns} dataSource={datas} rowKey="id" />

      {/* Modal thêm/sửa người dùng */}
      <Modal
        title={editingUserId ? "Edit User" : "Add New User"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingUserId(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          {/* Họ và tên */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              { required: true, message: "Please enter full name!" },
              { min: 5, message: "Name must be at least 5 characters." },
              {
                pattern: /^(?!\s).+$/,
                message: "Name cannot start with a space!",
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          {/* Tên đăng nhập */}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter username!" },
              { min: 4, message: "Username must be at least 4 characters!" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "No spaces or special characters allowed!",
              },
            ]}
          >
            <Input
              placeholder="Enter username"
              readOnly={!!editingUserId} // Nếu đang sửa thì không cho chỉnh username
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          {/* Giới tính */}
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Radio.Group>
              <Radio value="MALE">Male</Radio>
              <Radio value="FEMALE">Female</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Mật khẩu - chỉ hiển thị khi tạo mới */}
          {!editingUserId && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password!" },
                { min: 6, message: "Password must be at least 6 characters." },
                {
                  pattern: /^\S+$/,
                  message: "Password cannot contain spaces!",
                },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          {/* Tài khoản Premium */}
          <Form.Item
            label="Premium Account"
            name="premium"
            valuePropName="checked"
          >
            <Checkbox>Enable Premium</Checkbox>
          </Form.Item>

          {/* Vai trò */}
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value="CUSTOMER">Customer</Select.Option>
              <Select.Option value="COACH">Coach</Select.Option>
            </Select>
          </Form.Item>

          {/* Nút submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingUserId ? "Update User" : "Create New User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;

