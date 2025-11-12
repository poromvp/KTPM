import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link để chuyển về trang Login
import './Auth.css'; // Dùng chung file CSS

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Kiểm tra mật khẩu có khớp không
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return; // Dừng lại nếu không khớp
    }

    // Đây là nơi bạn xử lý logic đăng ký
    console.log('Đang đăng ký với:', { username, email, password });

    // Tạm thời chỉ log ra console
    alert('Đăng ký thành công! (Kiểm tra console)');
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng Ký</h2>
        
        <div className="form-group">
          <label htmlFor="username">Tên người dùng</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">Đăng Ký</button>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;