import axios from 'axios';
import { getToken } from './authService';
import { 
  mockGetAllProducts, 
  mockGetProductById, 
  mockCreateProduct, 
  mockUpdateProduct, 
  mockDeleteProduct 
} from './mockService';

// Base URL của backend API
const API_URL = process.env.REACT_APP_API_URL;

// Chế độ MOCK - Đặt true để dùng mock data, false để dùng API thật
const USE_MOCK = false; // Đổi thành false khi có backend thật

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  if (USE_MOCK) {
    return await mockGetAllProducts();
  }
  
  try {
    // Lấy token và gán vào header cho request này (nếu có)
    const token = getToken();
    const config = {};
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await axiosInstance.get('/product', config);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Lấy sản phẩm theo ID
export const getProductById = async (id) => {
  if (USE_MOCK) {
    return await mockGetProductById(id);
  }
  
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tạo sản phẩm mới
export const createProduct = async (productData) => {
  if (USE_MOCK) {
    return await mockCreateProduct(productData);
  }
  
  try {
    const token = getToken();
    const config = {};
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    // Chuẩn hoá payload theo định dạng yêu cầu
    const payload = {
      productName: productData.productName ?? '',
      description: productData.description ?? '',
      price: Number(productData.price) || 0,
      amount: Number(productData.amount) || 0,
    };

    const response = await axiosInstance.post('/product', payload, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  if (USE_MOCK) {
    return await mockUpdateProduct(id, productData);
  }
  
  try {
    const response = await axiosInstance.put(`product/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  if (USE_MOCK) {
    return await mockDeleteProduct(id);
  }
  
  try {
    const response = await axiosInstance.delete(`product/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
