// CÂU 2.1: LOGIN - Frontend unit tests

import {
  validateEmail,
  validatePassword,
  validateUsername
} from '../utils/validation';

describe('Login Validation Tests', () => {
  describe('validateUsername()', () => {

    //Tc1: Username rỗng
    test('TC1: Username rỗng - nên trả về lỗi', () => {
      expect(validateUsername('')).toBe('Tên người dùng là bắt buộc');
    });
    
    //Tc2: Username quá ngắn dài
    test('TC2: Username quá ngắn - nên trả về lỗi', () => {
      expect(validateUsername('ab')).toBe('Tên người dùng phải có ít nhất 3 ký tự');
    });
    
    test('TC2b: Username quá dài - nên trả về lỗi', () => {
      expect(validateUsername('a'.repeat(51))).toBe('Tên người dùng không được vượt quá 50 ký tự');
    });
    
    //Tc3: Username ký tự đặc biệt không hợp lệ (nếu có validate)
    test('TC3: Username với ký tự hợp lệ', () => {
      expect(validateUsername('user123')).toBe(null);
    });
    
    //Tc4: Username hợp lệ
    test('TC4: Username hợp lệ - không có lỗi', () => {
      expect(validateUsername('validuser')).toBe(null);
      expect(validateUsername('user123')).toBe(null);
      expect(validateUsername('abc')).toBe(null); // 3 ký tự
      expect(validateUsername('a'.repeat(50))).toBe(null); // 50 ký tự
    });
  });
  

  // b) validatePassword() - 2 điểm
  describe('validatePassword()', () => {  
    //Tc1: Password rỗng
    test('TC1: Password rỗng - nên trả về lỗi', () => {
      expect(validatePassword('')).toBe('Mật khẩu là bắt buộc');
      expect(validatePassword(null)).toBe('Mật khẩu là bắt buộc');
      expect(validatePassword(undefined)).toBe('Mật khẩu là bắt buộc');
    });
    
    //Tc2: Password quá ngắn dài
    test('TC2: Password quá ngắn - nên trả về lỗi', () => {
      expect(validatePassword('12345')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
      expect(validatePassword('lap')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
      expect(validatePassword('1')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
    });
    
    // Test 3: Password không có chữ hoặc số (nếu có validate phức tạp)
    test('TC3: Password đủ dài nhưng yếu', () => {
      // Hiện tại validation.js chỉ check length, nên test case này sẽ pass
      expect(validatePassword('123456')).toBe(null);
      expect(validatePassword('aaaaaa')).toBe(null);
    });
    
    // Test 4: Password hợp lệ
    test('TC4: Password hợp lệ - không có lỗi', () => {
      expect(validatePassword('123456')).toBe(null);
      expect(validatePassword('password123')).toBe(null);
      expect(validatePassword('StrongP@ss123')).toBe(null);
      expect(validatePassword('a'.repeat(50))).toBe(null); // Dài
    });
  });
  
  // ============================================
  // Bonus: validateEmail() - Thêm để đầy đủ
  // ============================================
  describe('validateEmail()', () => {
    
    test('Email rỗng - nên trả về lỗi', () => {
      expect(validateEmail('')).toBe('Email là bắt buộc');
    });
    
    test('Email không hợp lệ - thiếu @', () => {
      expect(validateEmail('invalidemail.com')).toBe('Email không hợp lệ');
    });
    
    test('Email không hợp lệ - thiếu domain', () => {
      expect(validateEmail('test@')).toBe('Email không hợp lệ');
    });
    
    test('Email không hợp lệ - thiếu extension', () => {
      expect(validateEmail('test@domain')).toBe('Email không hợp lệ');
    });
    
    test('Email hợp lệ - không có lỗi', () => {
      expect(validateEmail('test@example.com')).toBe(null);
      expect(validateEmail('user123@gmail.com')).toBe(null);
      expect(validateEmail('admin@company.co.uk')).toBe(null);
    });
  });
  
});
