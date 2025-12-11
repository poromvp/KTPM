// Validation cho username
// Rules:
// Độ dài: 3-50 ký tự
// Chỉ chứa a-z, A-Z, 0-9
// Ký tự đặc biệt cho phép: - . _

export function validateUsername(username) {
  const value = (username || "").trim();

  if (!value) {
    return "Không được để trống username";
  }

  const len = value.length;

  if (len < 3) {
    return "Username phải có ít nhất 3 ký tự";
  }

  if (len > 50) {
    return "Username không được vượt quá 50 ký tự";
  }

  const regex = /^[a-zA-Z0-9._-]+$/;
  if (!regex.test(value)) {
    return "Username chỉ được chứa chữ, số và ký tự ._-";
  }

  return "";
}


// Validation cho password
// 1. Độ dài: 6-100 ký tự
// 2. Phải chứa cả chữ và số
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
