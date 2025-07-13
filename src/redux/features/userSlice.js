import { createSlice } from '@reduxjs/toolkit';

//@reduxjs/toolkit quan ly trang thai nguoi dung user state

const initialState = null;//trang thai ban dau cua user là null, chua co nguoi dung login


export const userSlice = createSlice({ //tao nhanh 1 slice cua redux store, name là tên slice, initialState là trang thai ban dau
  // reducers là các reducer, mỗi reducer là 1 hàm, có 2 tham số là state và action
  // state là trang thai cua slice, action là action của redux
  name: 'user',
  initialState: null,
  reducers: {

    login: (state, action) => {// khi nguoi dung dang nhap, hanh dong nay se gan toan bo thong tin nguoi dung vao state
      //state = initialState, action = { type: 'user/login', payload: { ... } }
      //payload là thong tin, type la loai hanh dong 
      return action.payload;
    },
    logout: () => {
      localStorage.removeItem("token"); 
      return initialState;// dat lai state ve null 
    },
    updateAvatar: (state, action) => {
      // Nếu state null thì không làm gì
      if (state === null) return state;
      return {
        ...state, // copy lai thong tin cu 
        avatarUrl: action.payload, // cập nhật url mới vào state
      };
    },
    updateUser: (state, action) => {
      // Nếu state null thì không làm gì
      if (state === null) return state;
      return {
        ...state, // copy lai thong tin cu
        ...action.payload, // cập nhật thông tin mới
      };
    },
  },
});


export const { login, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
 

