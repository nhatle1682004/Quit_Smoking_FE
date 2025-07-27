import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
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

import { fetchUnreadCount } from "../../redux/features/notificationSlice";

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

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dispatch = useDispatch();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/notifications");
      setNotifications(
        Array.isArray(response.data)
          ? response.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          : []
      );
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
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      fetchNotifications();
      dispatch(fetchUnreadCount()); // Cập nhật lại số lượng trên Redux
    } catch (err) {
      setError("Không thể đánh dấu đã đọc. Vui lòng thử lại sau.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      fetchNotifications();
      dispatch(fetchUnreadCount()); // Cập nhật lại số lượng trên Redux
    } catch (err) {
      setError("Không thể thực hiện. Vui lòng thử lại.");
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderContent = () => {
    if (loading)
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
          <CircularProgress />
        </Box>
      );
    if (error)
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
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
        {/* Timeline Line */}
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
                <Typography
                  variant="body2"
                  sx={{
                    color: PALETTE.textSecondary,
                    mt: 0.25,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {notification.message}
                </Typography>
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
      {/* Modal */}
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
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;
