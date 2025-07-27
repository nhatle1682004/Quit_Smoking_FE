import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Mặc định là localStorage cho web
import rootReducer from './rootReducer';

// Cấu hình cho Redux Persist
const persistConfig = {
  key: 'root',      // Key cho mục trong localStorage
  storage,          // Nơi lưu trữ state (localStorage)
  version: 1,
  // whitelist: ['user'], // Tùy chọn: chỉ định slice nào bạn muốn lưu lại. Ví dụ: chỉ lưu 'user'
  
};

// Tạo một reducer đã được "bọc" bởi persistConfig
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store
export const store = configureStore({
  reducer: persistedReducer,
  // Thêm middleware để bỏ qua việc kiểm tra serializable cho các action của Redux Persist
  // Điều này giúp tránh các lỗi cảnh báo không cần thiết trên console.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Tạo persistor để "bọc" App của bạn
export const persistor = persistStore(store);