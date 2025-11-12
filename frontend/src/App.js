import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

// Xóa file App.css mặc định nếu bạn muốn, hoặc import file index.css
import './index.css'; // (File này thường có sẵn)

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho trang Đăng Nhập (mặc định là trang chủ) */}
        <Route path="/" element={<Login />} />
        
        {/* Route cho trang Đăng Ký */}
        <Route path="/register" element={<Register />} />
        
        {/* Bạn có thể thêm các route khác ở đây, ví dụ:
        <Route path="/dashboard" element={<Dashboard />} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;