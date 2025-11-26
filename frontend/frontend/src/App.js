import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import { isAuthenticated } from './services/authService';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho trang Đăng Nhập (trang chủ) */}
        <Route path="/" element={<Login />} />
        
        {/* Route cho trang Đăng Ký */}
        <Route path="/register" element={<Register />} />
        
        {/* Route cho trang Quản lý Sản phẩm (Protected) */}
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          } 
        />

        {/* Redirect các route không tồn tại về trang login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;