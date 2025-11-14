# Frontend - Ứng dụng Đăng nhập & Quản lý Sản phẩm
Đây là phần frontend của Assignment 2 - Môn Kiểm thử Phần mềm, xây dựng bằng React 18+.

## 🎯 Chức năng

### 1. Chức năng Login (Đăng nhập)
- Hệ thống đăng nhập với validation đầy đủ
- Xác thực email và mật khẩu
- Lưu token vào localStorage
- Chuyển hướng đến trang quản lý sản phẩm sau khi đăng nhập thành công

### 2. Chức năng Register (Đăng ký)
- Đăng ký tài khoản mới
- Validation form: username, email, password, confirm password
- Kiểm tra mật khẩu khớp
- Chuyển về trang đăng nhập sau khi đăng ký thành công

### 3. Chức năng Product (Quản lý Sản phẩm)
- **Create**: Thêm sản phẩm mới
- **Read**: Hiển thị danh sách sản phẩm
- **Update**: Sửa thông tin sản phẩm
- **Delete**: Xóa sản phẩm
- Protected route - yêu cầu đăng nhập

## 📁 Cấu trúc Dự án

```
frontend/
├── src/
│   ├── components/          # Các React components
│   │   ├── Login.jsx       # Component đăng nhập
│   │   ├── Register.jsx    # Component đăng ký
│   │   ├── ProductList.jsx # Component danh sách sản phẩm
│   │   ├── ProductForm.jsx # Component form sản phẩm
│   │   ├── Auth.css        # CSS cho Login & Register
│   │   └── Product.css     # CSS cho Product
│   ├── services/            # API services
│   │   ├── authService.js  # Service xử lý authentication
│   │   └── productService.js # Service xử lý products
│   ├── utils/              # Validation utilities
│   │   └── validation.js   # Các hàm validation
│   ├── tests/              # Test files
│   │   ├── Login.test.jsx
│   │   ├── Register.test.jsx
│   │   └── Product.test.jsx
│   ├── App.js              # Main App component với routing
│   └── index.js            # Entry point
├── package.json
└── README.md
```

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Backend API

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với địa chỉ backend của bạn:

```
REACT_APP_API_URL=http://localhost:8080/api
```

### 3. Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### 4. Chạy Tests

```bash
npm test
```

### 5. Build cho Production

```bash
npm run build
```

## 🧪 Testing

Dự án sử dụng **React Testing Library** và **Jest** để testing.

### Test Coverage:

#### Login Tests (`Login.test.jsx`):
- ✅ Render form đúng
- ✅ Validation email và password
- ✅ Xử lý đăng nhập thành công
- ✅ Xử lý lỗi đăng nhập
- ✅ Disable button khi đang loading
- ✅ Clear error khi user nhập

#### Register Tests (`Register.test.jsx`):
- ✅ Render form đúng
- ✅ Validation tất cả các trường
- ✅ Kiểm tra mật khẩu khớp
- ✅ Xử lý đăng ký thành công
- ✅ Xử lý lỗi đăng ký
- ✅ Disable button khi đang loading

#### Product Tests (`Product.test.jsx`):
- ✅ Hiển thị danh sách sản phẩm
- ✅ Thêm sản phẩm mới
- ✅ Sửa sản phẩm
- ✅ Xóa sản phẩm
- ✅ Validation form
- ✅ Loading state
- ✅ Error handling

### Chạy test với coverage:

```bash
npm test -- --coverage
```

## 🛠️ Công nghệ Sử dụng

- **React 18+** - Framework JavaScript
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Testing Library** - Testing cho React
- **Jest** - Testing framework
- **CSS3** - Styling với animations

## 📝 Validation Rules

### Email:
- Bắt buộc
- Phải đúng định dạng email

### Password:
- Bắt buộc
- Tối thiểu 6 ký tự

### Username:
- Bắt buộc
- Tối thiểu 3 ký tự
- Tối đa 50 ký tự

### Product Name:
- Bắt buộc
- Tối thiểu 2 ký tự
- Tối đa 100 ký tự

### Price:
- Bắt buộc
- Phải là số
- Không được âm
- Tối đa 1 tỷ

### Quantity:
- Bắt buộc
- Phải là số nguyên
- Không được âm
- Tối đa 1 triệu

## 🔐 Protected Routes

Ứng dụng sử dụng Protected Routes để bảo vệ các trang yêu cầu đăng nhập:
- `/products` - Yêu cầu token trong localStorage
- Tự động redirect về `/` (login) nếu chưa đăng nhập

## 📱 Responsive Design

Giao diện responsive, hoạt động tốt trên:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 📚 API Endpoints (chưa cos)

### Authentication:
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Products:
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
