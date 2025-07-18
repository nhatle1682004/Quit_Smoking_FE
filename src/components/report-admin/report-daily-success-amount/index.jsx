import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, DollarSign, BarChart3, ChevronDown } from 'lucide-react';
import api from '../../../configs/axios';

// Tạo mảng các ngày đủ trong khoảng from-to
const getDateRangeArray = (from, to) => {
  const range = [];
  let start = new Date(from);
  const end = new Date(to);
  while (start <= end) {
    range.push(start.toISOString().split('T')[0]);
    start.setDate(start.getDate() + 1);
  }
  return range;
};

// Fill đủ ngày, nếu ngày nào không có giao dịch thì amount = 0
const fillMissingDates = (data, from, to) => {
  const range = getDateRangeArray(from, to);
  const dataMap = {};
  (data || []).forEach(item => {
    dataMap[new Date(item.date).toISOString().split('T')[0]] = item.amount;
  });
  return range.map(date => ({
    date,
    amount: dataMap[date] != null ? dataMap[date] : 0,
    displayDate: date.split('-')[2] + '/' + date.split('-')[1]
  }));
};

// Custom Date Picker Component
const DateRangePicker = ({ onChange }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFromChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    if (newFromDate && toDate) {
      onChange([newFromDate, toDate]);
    }
  };

  const handleToChange = (e) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
    if (fromDate && newToDate) {
      onChange([fromDate, newToDate]);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex items-center gap-2 flex-1">
      <Calendar className="text-blue-500 text-xl" />
      <div className="flex gap-2 flex-1">
        <input
          type="date"
          value={fromDate}
          onChange={handleFromChange}
          max={today}
          className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        />
        <span className="text-gray-400 self-center">đến</span>
        <input
          type="date"
          value={toDate}
          onChange={handleToChange}
          max={today}
          className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
};

// Statistic Card Component
const StatisticCard = ({ title, value, color, suffix = "VND" }) => {
  const formatValue = (val) => {
    return val.toLocaleString('vi-VN');
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/90 text-sm font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold">
        {formatValue(value)} {suffix}
      </div>
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="text-sm text-gray-600">{`Ngày: ${label}`}</p>
        <p className="text-sm text-blue-600 font-semibold">
          {`Tổng tiền: ${payload[0].value.toLocaleString('vi-VN')} VND`}
        </p>
      </div>
    );
  }
  return null;
};

function ReportDailySuccessAmount() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);

  const handleChange = (values) => {
    setDates(values);
  };

  const handleFetch = async () => {
    if (dates && dates.length === 2) {
      const from = dates[0];
      const to = dates[1];
      setLoading(true);
      try {
        // Gọi API thực tế bằng axios instance
        const response = await api.get(`/admin/dashboard/daily-success-amount?from=${from}&to=${to}`);
        const filled = fillMissingDates(response.data.data || [], from, to);
        setData(filled);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            <BarChart3 className="inline-block mr-3 text-blue-600" />
            Báo cáo Giao dịch Thành công
          </h1>
          <p className="text-gray-600 text-lg">
            Theo dõi và phân tích doanh thu hàng ngày
          </p>
        </div>

        {/* Date Picker Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border-0">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <DateRangePicker onChange={handleChange} />
            <button
              onClick={handleFetch}
              disabled={dates.length !== 2 || loading}
              className={`px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 flex items-center gap-2 ${
                dates.length !== 2 || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang tải...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Phân tích dữ liệu
                </>
              )}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        

        {/* Chart Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Biểu đồ doanh thu theo ngày
              </h2>
              {data.length > 0 && (
                <div className="text-right">
                  <span className="text-3xl font-bold text-blue-600">
                    {total.toLocaleString('vi-VN')} VND
                  </span>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                </div>
              )}
            </div>

            <div className="h-80">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </div>
              )}

              {!loading && data && data.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="displayDate" 
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#667eea"
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                      strokeWidth={3}
                      dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#667eea', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {!loading && (!data || data.length === 0) && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 italic">
                      Chưa có dữ liệu. Vui lòng chọn khoảng thời gian và nhấn "Phân tích dữ liệu".
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDailySuccessAmount;