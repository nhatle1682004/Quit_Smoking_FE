import React from 'react';
import { DatePicker } from 'antd';
// import { CalendarOutlined } from '@ant-design/icons';

const DatePickerSmokingLog = ({ onDateChange, defaultValue }) => {
  return (
    <div className="text-center">
      {/* <CalendarOutlined className="text-blue-500 text-2xl mb-2" /> */}
      <DatePicker
        onChange={onDateChange}
        defaultValue={defaultValue}
        format="YYYY-MM-DD"
        style={{ width: '100%', height: 48, fontSize: 18, borderRadius: 12 }}
        size="large"
        allowClear={false}
      />
    </div>
  );
};

export default DatePickerSmokingLog; 