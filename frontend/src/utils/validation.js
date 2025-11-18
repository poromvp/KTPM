// Validation cho username
export function validateUsername(username) {
  if(!username)
    return "Không được để trống username";
  if(username.length < 3)
    return "Username phải có ít nhất 3 ký tự";
  if(username .length > 50)
    return "Username không được vượt quá 50 ký tự";
  const regex = /^[a-zA-Z0-9_]+$/;
  if(!regex.test(username))
    return "Username không được chứa ký tự đặc biệt";

  return "";
}

// Validation cho password
export function validatePassword(password) {
  if(!password)
    return "Mật khẩu không được để trống";
  if(password.length < 6)
    return "Mật khẩu phải có ít nhất 6 ký tự";
  if(password.length > 20)
    return "Mật khẩu không được vượt quá 20 ký tự";
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if(!hasLetter || !hasNumber) {
    return "Mật khẩu phải chứa cả chữ cái và số";
  }

  return "";
}

//Thêm các validation khác
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
