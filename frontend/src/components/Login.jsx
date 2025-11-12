import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link để chuyển sang trang Register
import './Auth.css'; // Import file CSS

function Login() {
  // Dùng useState để lưu trữ giá trị của input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hàm xử lý khi submit form
  const handleSubmit = (event) => {
    event.preventDefault(); // Ngăn trình duyệt reload lại trang
    
    // Đây là nơi bạn sẽ xử lý logic đăng nhập
    // Ví dụ: gọi API, kiểm tra email/password
    console.log('Đang đăng nhập với:', { email, password });

    // Tạm thời chỉ log ra console
    alert('Đăng nhập thành công! (Kiểm tra console)');
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Cập nhật state khi gõ
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi gõ
            required
          />
        </div>
        <button type="submit" className="auth-button">Đăng Nhập</button>
        
        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;