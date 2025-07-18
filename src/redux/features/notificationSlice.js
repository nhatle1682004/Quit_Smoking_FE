// src/redux/features/notificationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/axios";

// Tạo thunk để gọi API
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    // XÓA BỎ LOGIC KIỂM TRA STATE Ở ĐÂY
    // Cứ để cho interceptor tự xử lý việc gắn token
    try {
      const response = await api.get("/notifications/unread-count");
      const count = parseInt(response.data, 10);
      return isNaN(count) ? 0 : count;
    } catch (error) {
      // Nếu không có token, backend sẽ trả lỗi 401/403 và lỗi sẽ được xử lý ở đây
      console.error("Lỗi khi fetch unread count:", error.response?.data || error.message);
      // Không trả về lỗi để tránh hiện UI lỗi, chỉ đơn giản là trả về 0
      return 0;
    }
  }
);

// Tạo slice
const initialState = {
  unreadCount: 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unreadCount = action.payload; // Cập nhật số lượng từ kết quả API
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;