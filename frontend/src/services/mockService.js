// Mock Service - Dùng tạm cho testing khi chưa có backend
// File này sẽ giả lập API responses

const MOCK_USERS = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123' // Password hợp lệ: có cả chữ và số, từ 6-100 ký tự
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123'
  }
];

const MOCK_PRODUCTS = [
  { id: 1, productName: 'Laptop Dell XPS 15', description: 'Laptop cao cấp cho developer', price: 35000000, amount: 5, category: 'macbook' },
  { id: 2, productName: 'iPhone 15 Pro Max', description: 'Điện thoại flagship Apple', price: 30000000, amount: 10, category: 'iphone' },
  { id: 3, productName: 'Samsung Galaxy S24', description: 'Flagship Android', price: 25000000, amount: 8, category: 'iphone' },
];

let nextProductId = 4;

// Helper function để tạo error giống axios
const createMockError = (message) => {
  const error = new Error(message);
  error.response = {
    data: {
      message: message
    }
  };
  return error;
};

// Mock Auth Functions
export const mockLogin = async (credentials) => {
  // Giả lập delay của API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Hỗ trợ cả userName và email để login
  const user = MOCK_USERS.find(
    u => (u.username === credentials.userName || u.email === credentials.userName) 
         && u.password === credentials.password
  );
  
  if (user) {
    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    };
  } else {
    throw createMockError('Username hoặc mật khẩu không đúng');
  }
};

export const mockRegister = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Kiểm tra email đã tồn tại
  const existingUser = MOCK_USERS.find(u => u.email === userData.email);
  if (existingUser) {
    throw createMockError('Email đã được sử dụng');
  }
  
  // Thêm user mới
  const newUser = {
    id: MOCK_USERS.length + 1,
    ...userData
  };
  MOCK_USERS.push(newUser);
  
  return {
    message: 'Đăng ký thành công',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  };
};

// Mock Product Functions
export const mockGetAllProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { data: [...MOCK_PRODUCTS] }; // Wrap trong object data để match với API response
};

export const mockGetProductById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
  if (!product) {
    throw createMockError('Không tìm thấy sản phẩm');
  }
  return product;
};

export const mockCreateProduct = async (productData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newProduct = {
    id: nextProductId++,
    ...productData
  };
  MOCK_PRODUCTS.push(newProduct);
  return newProduct;
};

export const mockUpdateProduct = async (id, productData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_PRODUCTS.findIndex(p => p.id === parseInt(id));
  if (index === -1) {
    throw createMockError('Không tìm thấy sản phẩm');
  }
  MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
  return MOCK_PRODUCTS[index];
};

export const mockDeleteProduct = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_PRODUCTS.findIndex(p => p.id === parseInt(id));
  if (index === -1) {
    throw createMockError('Không tìm thấy sản phẩm');
  }
  MOCK_PRODUCTS.splice(index, 1);
  return { message: 'Xóa thành công' };
};
