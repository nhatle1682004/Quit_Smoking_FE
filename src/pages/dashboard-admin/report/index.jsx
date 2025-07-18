import React from 'react'
import ReportTotalUsers from '../../../components/report-admin/report-total-user/indec';
import DailySuccessAmount from '../../../components/report-admin/report-daily-success-amount';

function ReportDashboard() {
  return (
    <div>
      <ReportTotalUsers />
      <DailySuccessAmount />
    </div>
  )
}

export default ReportDashboard;