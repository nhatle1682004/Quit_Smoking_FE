import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: (state) => {
      return null;
    },
    updateUser: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

export const { login, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;