import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Typography, message } from "antd";
import {
  NotificationOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios"; // Adjust path as necessary

const { Title } = Typography;

function NotificationStats() {
  const [stats, setStats] = useState({
    totalNotifications: 0,
    readNotifications: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notifications/stats"); // API đã cung cấp trong Swagger
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch notification stats:", error);
      message.error("Failed to load notification statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Card className="mb-6">
      <Title level={4}>Thống kê Thông báo</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng số thông báo"
              value={stats.totalNotifications}
              formatter={(value) => (
                <span style={{ color: "#3f8600" }}>
                  <NotificationOutlined /> {value}
                </span>
              )}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Thông báo đã đọc"
              value={stats.readNotifications}
              formatter={(value) => (
                <span style={{ color: "#1890ff" }}>
                  <CheckCircleOutlined /> {value}
                </span>
              )}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Thông báo chưa đọc"
              value={stats.unreadNotifications}
              formatter={(value) => (
                <span style={{ color: "#faad14" }}>
                  <ClockCircleOutlined /> {value}
                </span>
              )}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default NotificationStats;
