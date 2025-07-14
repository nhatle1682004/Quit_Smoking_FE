import React, { useState, useEffect, useCallback } from "react";
import api from "../../configs/axios";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

// Icons
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EventNoteIcon from "@mui/icons-material/EventNote";

// Bảng màu và các hàm helper giữ nguyên
const PALETTE = {
  primary: "#007BFF",
  primaryLighter: alpha("#007BFF", 0.1),
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  line: "#E9ECEF",
  dotColors: {
    coach_message: "#007BFF",
    welcome: "#DC3545",
    reminder: "#FFC107",
    achievement: "#28A745",
    default: "#6C757D",
  },
};

const getNotificationIcon = (type) => {
  const iconStyle = { color: PALETTE.textSecondary, fontSize: "1.25rem" };
  const icons = {
    coach_message: <MailOutlineIcon sx={iconStyle} />,
    welcome: <PersonAddAlt1Icon sx={iconStyle} />,
    reminder: <EventNoteIcon sx={iconStyle} />,
    achievement: <FavoriteBorderIcon sx={iconStyle} />,
    default: <SettingsOutlinedIcon sx={iconStyle} />,
  };
  return icons[type] || icons.default;
};

const formatTimeAgo = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

// --- COMPONENT CHÍNH ---
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Giữ nguyên toàn bộ logic fetch và xử lý state
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/notifications");
      if (Array.isArray(response.data)) {
        setNotifications(
          response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    try {
      await api.patch(`/notifications/${notificationId}/read`);
    } catch (err) {
      setError("Không thể đánh dấu đã đọc. Vui lòng thử lại sau.");
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.post("/notifications/read-all");
    } catch (err) {
      setError("Không thể thực hiện. Vui lòng thử lại.");
      fetchNotifications();
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleConfirmRead = () => {
    if (selectedNotification && !selectedNotification.isRead) {
      handleMarkAsRead(selectedNotification.id);
    }
    handleCloseModal();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
    }
    if (notifications.length === 0) {
      return (
        <Box sx={{ textAlign: "center", p: 8 }}>
          <NotificationsNoneIcon
            sx={{ fontSize: 60, color: PALETTE.line, mb: 2 }}
          />
          <Typography variant="h6" sx={{ color: PALETTE.textSecondary }}>
            Không có thông báo nào
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={0} sx={{ position: "relative", paddingLeft: "30px" }}>
        <Box
          sx={{
            position: "absolute",
            left: "9px",
            top: "20px",
            bottom: "20px",
            width: "2px",
            backgroundColor: PALETTE.line,
            zIndex: 0,
          }}
        />
        {notifications.map((notification) => (
          <Stack
            key={notification.id}
            direction="row"
            alignItems="center"
            onClick={() => handleNotificationClick(notification)}
            sx={{
              position: "relative",
              width: "100%",
              p: 2.5,
              marginLeft: "-30px",
              borderRadius: 3,
              cursor: "pointer",
              transition: "background-color 0.2s ease-in-out",
              backgroundColor: !notification.isRead
                ? PALETTE.primaryLighter
                : "transparent",
              "&:hover": {
                backgroundColor: !notification.isRead
                  ? alpha(PALETTE.primary, 0.15)
                  : alpha(PALETTE.line, 0.5),
              },
            }}
          >
            {/* Timeline Dot */}
            <Box
              sx={{
                position: "absolute",
                left: "0px",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                backgroundColor: "#fff",
              }}
            >
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor:
                    PALETTE.dotColors[notification.type] ||
                    PALETTE.dotColors.default,
                }}
              />
            </Box>

            {/* Content */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ flexGrow: 1, paddingLeft: "20px" }}
            >
              <Box sx={{ color: PALETTE.textSecondary }}>
                {getNotificationIcon(notification.type)}
              </Box>

              <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                {" "}
                {/* Thêm overflow hidden cho cha */}
                {/* 1. Title */}
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: !notification.isRead ? 600 : 500,
                    color: PALETTE.textPrimary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {notification.title}
                </Typography>
                {/* 2. Message/Content - ĐÂY LÀ THAY ĐỔI CHÍNH */}
                <Typography
                  variant="body2"
                  sx={{
                    color: PALETTE.textSecondary,
                    mt: 0.25,
                    // Giới hạn hiển thị trong 2 dòng
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {notification.message}
                </Typography>
                {/* 3. Timestamp */}
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: PALETTE.textSecondary, mt: 0.5 }}
                >
                  {formatTimeAgo(notification.createdAt)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4, px: 2 }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: PALETTE.textPrimary }}
          >
            Thông báo
          </Typography>
          {unreadCount > 0 && (
            <Button
              startIcon={<MarkEmailReadIcon />}
              onClick={handleMarkAllAsRead}
              sx={{
                color: PALETTE.primary,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: PALETTE.primaryLighter },
              }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Stack>

        {/* Content */}
        {renderContent()}
      </Container>

      {/* Modal hiển thị chi tiết (giữ nguyên) */}
      <Dialog
        open={!!selectedNotification}
        onClose={handleCloseModal}
        PaperProps={{
          sx: { borderRadius: 4, width: "100%", maxWidth: "500px" },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: PALETTE.textPrimary, pb: 1 }}
        >
          {selectedNotification?.title}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Ở đây message sẽ hiển thị đầy đủ và tự xuống dòng */}
          <DialogContentText
            sx={{ color: PALETTE.textSecondary, whiteSpace: "pre-wrap" }}
          >
            {selectedNotification?.message}
          </DialogContentText>
          <Typography
            variant="caption"
            display="block"
            sx={{ color: PALETTE.textSecondary, mt: 2 }}
          >
            {formatTimeAgo(selectedNotification?.createdAt)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {!selectedNotification?.isRead && (
            <Button
              onClick={handleConfirmRead}
              variant="contained"
              startIcon={<CheckCircleOutlineIcon />}
              sx={{
                flexGrow: 1,
                backgroundColor: PALETTE.primary,
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
                py: 1,
                "&:hover": { backgroundColor: alpha(PALETTE.primary, 0.8) },
              }}
            >
              Xác nhận đã đọc
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;
