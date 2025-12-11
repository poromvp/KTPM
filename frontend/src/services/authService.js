import axios from 'axios';
import { mockLogin, mockRegister } from './mockService';

// Base URL của backend API - Thay đổi theo địa chỉ backend của bạn
const API_URL = process.env.REACT_APP_API_URL;

// Chế độ MOCK:   Đặt true để dùng mock data, false để dùng API thật
const USE_MOCK = false; // Đổi thành false khi có backend thật

// Đăng nhập    
export const login = async (credentials) => {
  if (USE_MOCK) {
    return await mockLogin(credentials);
  }

  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Đăng ký
export const register = async (userData) => {
  if (USE_MOCK) {
    return await mockRegister(userData);
  }

  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Lấy token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Lấy thông tin user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Kiểm tra xem user đã đăng nhập chưa
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
