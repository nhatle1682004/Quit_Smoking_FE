import { Form } from 'antd';
import React from 'react'
import { toast } from 'react-toastify';

function QuitPlanFree() {
  const [form] = Form.useForm();


  const handleSubmit = async (values) => {
    try{
      const response = await axios.post('/free-plan/create', values);
      toast.success(response.data.message);
      form.resetFields();
      
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <div></div>
  )
}

export default QuitPlanFree;