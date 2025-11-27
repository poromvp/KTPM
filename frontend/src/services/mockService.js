// Mock Service - Dùng tạm cho testing khi chưa có backend
// File này sẽ giả lập API responses

const MOCK_USERS = [
  {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    password: "test123", // Password hợp lệ: có cả chữ và số
  },
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Macbook Pro M3",
    description: "Laptop cao cấp cho developer",
    price: 35000000,
    quantity: 5,
    category: "macbook",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    description: "Điện thoại flagship Apple",
    price: 30000000,
    quantity: 10,
    category: "iphone",
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    description: "Tai nghe chống ồn",
    price: 5000000,
    quantity: 8,
    category: "airpod",
  },
];

let nextProductId = 4;

// Helper function để tạo error giống axios
const createMockError = (message) => {
  const error = new Error(message);
  error.response = {
    data: {
      message: message,
    },
  };
  return error;
};

// Mock Auth Functions
export const mockLogin = async (credentials) => {
  // Giả lập delay của API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (user) {
    return {
      token: "mock-jwt-token-" + Date.now(),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  } else {
    throw createMockError("Email hoặc mật khẩu không đúng");
  }
};

export const mockRegister = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Kiểm tra email đã tồn tại
  const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
  if (existingUser) {
    throw createMockError("Email đã được sử dụng");
  }

  // Thêm user mới
  const newUser = {
    id: MOCK_USERS.length + 1,
    ...userData,
  };
  MOCK_USERS.push(newUser);

  return {
    message: "Đăng ký thành công",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  };
};

// Mock Product Functions
export const mockGetAllProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...MOCK_PRODUCTS];
};

export const mockGetProductById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const product = MOCK_PRODUCTS.find((p) => p.id === parseInt(id));
  if (!product) {
    throw createMockError("Không tìm thấy sản phẩm");
  }
  return product;
};

export const mockCreateProduct = async (productData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newProduct = {
    id: nextProductId++,
    ...productData,
  };
  MOCK_PRODUCTS.push(newProduct);
  return newProduct;
};

export const mockUpdateProduct = async (id, productData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === parseInt(id));
  if (index === -1) {
    throw createMockError("Không tìm thấy sản phẩm");
  }
  MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
  return MOCK_PRODUCTS[index];
};

export const mockDeleteProduct = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === parseInt(id));
  if (index === -1) {
    throw createMockError("Không tìm thấy sản phẩm");
  }
  MOCK_PRODUCTS.splice(index, 1);
  return { message: "Xóa thành công" };
};
