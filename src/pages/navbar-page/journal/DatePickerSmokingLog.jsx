import React from "react";
import { DatePicker, Alert } from "antd";

const DatePickerSmokingLog = ({ onDateChange, defaultValue, noLogMessage }) => {
  return (
    <div className="text-center">

      <DatePicker
        value={defaultValue}
        onChange={onDateChange}
        format="YYYY-MM-DD"
        style={{ width: "100%", height: 48, fontSize: 18, borderRadius: 12 }}
        size="large"
        allowClear={false}
      />


      {noLogMessage && (
        <Alert
          message={noLogMessage}
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default DatePickerSmokingLog;
