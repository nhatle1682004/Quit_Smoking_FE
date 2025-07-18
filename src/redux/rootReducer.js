// src/redux/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import notificationReducer from './features/notificationSlice';

const rootReducer = combineReducers({
  user: userReducer,
  notifications: notificationReducer,
});

export default rootReducer;