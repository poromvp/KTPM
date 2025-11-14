# 🔐 HƯỚNG DẪN ĐĂNG NHẬP

## 📌 Hiện tại đang dùng MOCK DATA (Không cần backend)

Ứng dụng đang chạy ở chế độ MOCK, có nghĩa là không cần backend API thật. 

### ✅ Tài khoản test sẵn có:

**Email:** `test@example.com`  
**Password:** `123456`

### 🎯 Cách sử dụng:

1. **Đăng nhập với tài khoản có sẵn:**
   - Mở http://localhost:3000
   - Nhập email: `test@example.com`
   - Nhập password: `123456`
   - Click "Đăng Nhập"
   - ✅ Sẽ chuyển đến trang Quản lý Sản phẩm

2. **Đăng ký tài khoản mới:**
   - Click "Đăng ký ngay"
   - Nhập thông tin: username, email, password
   - Click "Đăng Ký"
   - Sau đó dùng email/password vừa tạo để đăng nhập

3. **Quản lý sản phẩm:**
   - Xem danh sách sản phẩm (3 sản phẩm mẫu)
   - Thêm sản phẩm mới
   - Sửa sản phẩm
   - Xóa sản phẩm
   - Đăng xuất

### 🔄 Chuyển sang dùng Backend API thật:

Khi có backend, mở 2 file sau và đổi `USE_MOCK = false`:

1. **src/services/authService.js**
   ```javascript
   const USE_MOCK = false; // Đổi từ true sang false
   ```

2. **src/services/productService.js**
   ```javascript
   const USE_MOCK = false; // Đổi từ true sang false
   ```

### 📦 Data mẫu có sẵn:

**Users:**
- Email: test@example.com
- Password: 123456

**Products:**
- Laptop Dell XPS 15 - 35,000,000đ - Số lượng: 5
- iPhone 15 Pro Max - 30,000,000đ - Số lượng: 10
- Samsung Galaxy S24 - 25,000,000đ - Số lượng: 8

### ⚠️ Lưu ý:

- Mock data được lưu trong memory, khi refresh trang sẽ reset về mặc định
- Các sản phẩm/user mới tạo sẽ mất khi reload page
- Để data persistent, cần dùng backend thật với database

### 🚀 Nếu muốn tạo Backend:

Backend cần có các endpoints:

**Authentication:**
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/register` - Đăng ký

**Products:**
- GET `/api/products` - Lấy tất cả sản phẩm
- GET `/api/products/:id` - Lấy 1 sản phẩm
- POST `/api/products` - Tạo sản phẩm mới
- PUT `/api/products/:id` - Cập nhật sản phẩm
- DELETE `/api/products/:id` - Xóa sản phẩm

Backend nên dùng: Spring Boot 3.2+, ...
