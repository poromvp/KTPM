// Validation cho username
// Rules:
// 1. Độ dài: 3-50 ký tự
// 2. Chỉ chứa: a-z, A-Z, 0-9
// 3. Ký tự đặc biệt cho phép: - . _

export function validateUsername(username) {
  if (!username || username.trim() ==='') {
    return "Không được để trống username";
  }
  
  if (username.length < 3) {
    return "Username phải có ít nhất 3 ký tự";
  }
  
  if (username.length > 50) {
    return "Username không được vượt quá 50 ký tự";
  }
  
  const regex = /^[a-zA-Z0-9._-]+$/;
  if (!regex.test(username)) {
    return "Username chỉ được chứa chữ, số và ký tự ._-";
  }
  return "";
}

// Validation cho password
// Rules:
// 1. Độ dài: 6-100 ký tự
// 2. Phải chứa CẢ chữ VÀ số
export function validatePassword(password) {
  if (!password || password.trim() === '') {
    return "Mật khẩu không được để trống";
  }
  
  if (password.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự";
  }
  
  if (password.length > 100) {
    return "Mật khẩu không được vượt quá 100 ký tự";
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return "Mật khẩu phải chứa cả chữ cái và số";
  }

  return "";
}
