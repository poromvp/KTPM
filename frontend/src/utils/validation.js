// Validation cho email
export const validateEmail = (email) => {
  if (!email) {
    return 'Email là bắt buộc';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email không hợp lệ';
  }
  
  return null;
};

// Validation cho password
export const validatePassword = (password) => {
  if (!password) {
    return 'Mật khẩu là bắt buộc';
  }
  
  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  return null;
};

// Validation cho username
export const validateUsername = (username) => {
  if (!username) {
    return 'Tên người dùng là bắt buộc';
  }
  
  if (username.length < 3) {
    return 'Tên người dùng phải có ít nhất 3 ký tự';
  }
  
  if (username.length > 50) {
    return 'Tên người dùng không được vượt quá 50 ký tự';
  }
  
  return null;
};

// Validation cho tên sản phẩm
export const validateProductName = (name) => {
  if (!name) {
    return 'Tên sản phẩm là bắt buộc';
  }
  
  if (name.trim().length < 2) {
    return 'Tên sản phẩm phải có ít nhất 2 ký tự';
  }
  
  if (name.length > 100) {
    return 'Tên sản phẩm không được vượt quá 100 ký tự';
  }
  
  return null;
};

// Validation cho giá
export const validatePrice = (price) => {
  if (!price && price !== 0) {
    return 'Giá là bắt buộc';
  }
  
  const priceNum = parseFloat(price);
  
  if (isNaN(priceNum)) {
    return 'Giá phải là số';
  }
  
  if (priceNum < 0) {
    return 'Giá không được là số âm';
  }
  
  if (priceNum > 1000000000) {
    return 'Giá không được vượt quá 1 tỷ';
  }
  
  return null;
};

// Validation cho số lượng
export const validateQuantity = (quantity) => {
  if (!quantity && quantity !== 0) {
    return 'Số lượng là bắt buộc';
  }
  
  const quantityNum = parseInt(quantity);
  
  if (isNaN(quantityNum)) {
    return 'Số lượng phải là số nguyên';
  }
  
  if (quantityNum < 0) {
    return 'Số lượng không được là số âm';
  }
  
  if (!Number.isInteger(parseFloat(quantity))) {
    return 'Số lượng phải là số nguyên';
  }
  
  if (quantityNum > 1000000) {
    return 'Số lượng không được vượt quá 1 triệu';
  }
  
  return null;
};
