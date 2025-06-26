import React, { useState } from 'react';

const INIT_FORM = {
  smokingStatus: '',
  ageStartedSmoking: '',
  cigarettesPerDay: '',
  hasTriedToQuit: false,
  hasHealthIssues: false,
  quitReason: '',
};

function InitStatus({ onSubmit }) {
  const [form, setForm] = useState(INIT_FORM);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.smokingStatus) {
      setError('Vui lòng chọn tình trạng hút thuốc.');
      return;
    }
    setError('');
    if (onSubmit) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>Khai báo tình trạng sức khỏe</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Tình trạng hút thuốc <span style={{ color: 'red' }}>*</span></label><br />
        <select name="smokingStatus" value={form.smokingStatus} onChange={handleChange} required>
          <option value="">-- Chọn --</option>
          <option value="SMOKER">Đang hút thuốc</option>
          <option value="NON_SMOKER">Chưa từng hút thuốc</option>
          <option value="FORMER_SMOKER">Đã từng hút thuốc</option>
        </select>
      </div>
      {form.smokingStatus === 'SMOKER' || form.smokingStatus === 'FORMER_SMOKER' ? (
        <div style={{ marginBottom: 12 }}>
          <label>Bắt đầu hút thuốc từ năm bao nhiêu tuổi?</label><br />
          <input type="number" name="ageStartedSmoking" value={form.ageStartedSmoking} onChange={handleChange} min={1} />
        </div>
      ) : null}
      {form.smokingStatus === 'SMOKER' ? (
        <div style={{ marginBottom: 12 }}>
          <label>Hút bao nhiêu điếu mỗi ngày?</label><br />
          <input type="number" name="cigarettesPerDay" value={form.cigarettesPerDay} onChange={handleChange} min={1} />
        </div>
      ) : null}
      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" name="hasTriedToQuit" checked={form.hasTriedToQuit} onChange={handleChange} />
          Đã từng cố bỏ thuốc chưa
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" name="hasHealthIssues" checked={form.hasHealthIssues} onChange={handleChange} />
          Có vấn đề sức khỏe liên quan đến hút thuốc không?
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Lý do muốn bỏ thuốc (nếu có)</label><br />
        <input type="text" name="quitReason" value={form.quitReason} onChange={handleChange} />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <button type="submit" style={{ width: '100%', padding: 8, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Gửi khai báo</button>
    </form>
  );
}

export default InitStatus; 