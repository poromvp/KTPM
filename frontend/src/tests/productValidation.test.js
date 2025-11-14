// ============================================
// CÂU 2.2: PRODUCT - FRONTEND UNIT TESTS (5 điểm)
// ============================================

import {
  validateProductName,
  validatePrice,
  validateQuantity
} from '../utils/validation';

describe('Product Validation Tests', () => {
  
  // ============================================
  // a) validateProduct() - 3 điểm (5 test cases)
  // ============================================
  
  // Test 1: Product name validation
  describe('validateProductName()', () => {
    
    test('TC1: Product name rỗng - nên trả về lỗi', () => {
      expect(validateProductName('')).toBe('Tên sản phẩm là bắt buộc');
      expect(validateProductName(null)).toBe('Tên sản phẩm là bắt buộc');
    });
    
    test('TC1b: Product name quá ngắn - nên trả về lỗi', () => {
      expect(validateProductName('a')).toBe('Tên sản phẩm phải có ít nhất 2 ký tự');
    });
    
    test('TC1c: Product name quá dài - nên trả về lỗi', () => {
      expect(validateProductName('a'.repeat(101))).toBe('Tên sản phẩm không được vượt quá 100 ký tự');
    });
    
    test('TC1d: Product name hợp lệ - không có lỗi', () => {
      expect(validateProductName('Laptop')).toBe(null);
      expect(validateProductName('Gaming Mouse')).toBe(null);
      expect(validateProductName('ab')).toBe(null); // 2 ký tự
      expect(validateProductName('a'.repeat(100))).toBe(null); // 100 ký tự
    });
  });
  
  // Test 2: Price validation (boundary tests)
  describe('validatePrice()', () => {
    
    test('TC2: Price rỗng - nên trả về lỗi', () => {
      expect(validatePrice('')).toBe('Giá là bắt buộc');
      expect(validatePrice(null)).toBe('Giá là bắt buộc');
      expect(validatePrice(undefined)).toBe('Giá là bắt buộc');
    });
    
    test('TC2b: Price âm - nên trả về lỗi', () => {
      expect(validatePrice(-1000)).toBe('Giá không được là số âm');
      expect(validatePrice(-0.01)).toBe('Giá không được là số âm');
    });
    
    test('TC2c: Price bằng 0 - hợp lệ', () => {
      expect(validatePrice(0)).toBe(null);
    });
    
    test('TC2d: Price không phải số - nên trả về lỗi', () => {
      expect(validatePrice('abc')).toBe('Giá phải là số');
      // '10abc' sẽ được parseFloat thành 10 nên pass
    });
    
    test('TC2e: Price quá lớn - nên trả về lỗi', () => {
      expect(validatePrice(1000000001)).toBe('Giá không được vượt quá 1 tỷ');
    });
    
    test('TC2f: Price hợp lệ (boundary tests) - không có lỗi', () => {
      expect(validatePrice(1)).toBe(null);
      expect(validatePrice(0.01)).toBe(null); // Decimal
      expect(validatePrice(100)).toBe(null);
      expect(validatePrice(1000000)).toBe(null); // Large number
      expect(validatePrice('1000')).toBe(null); // String number
      expect(validatePrice(1000000000)).toBe(null); // Max valid: 1 tỷ
    });
  });
  
  // Test 3: Quantity validation
  describe('validateQuantity()', () => {
    
    test('TC3: Quantity rỗng - nên trả về lỗi', () => {
      expect(validateQuantity('')).toBe('Số lượng là bắt buộc');
      expect(validateQuantity(null)).toBe('Số lượng là bắt buộc');
      expect(validateQuantity(undefined)).toBe('Số lượng là bắt buộc');
    });
    
    test('TC3b: Quantity âm - nên trả về lỗi', () => {
      expect(validateQuantity(-1)).toBe('Số lượng không được là số âm');
      expect(validateQuantity(-100)).toBe('Số lượng không được là số âm');
    });
    
    test('TC3c: Quantity không phải số - nên trả về lỗi', () => {
      expect(validateQuantity('abc')).toBe('Số lượng phải là số nguyên');
    });
    
    test('TC3d: Quantity không phải số nguyên - nên trả về lỗi', () => {
      expect(validateQuantity(10.5)).toBe('Số lượng phải là số nguyên');
    });
    
    test('TC3e: Quantity quá lớn - nên trả về lỗi', () => {
      expect(validateQuantity(1000001)).toBe('Số lượng không được vượt quá 1 triệu');
    });
    
    test('TC3f: Quantity bằng 0 - hợp lệ (không âm)', () => {
      expect(validateQuantity(0)).toBe(null);
    });
    
    test('TC3g: Quantity hợp lệ - không có lỗi', () => {
      expect(validateQuantity(1)).toBe(null);
      expect(validateQuantity(10)).toBe(null);
      expect(validateQuantity(1000)).toBe(null);
      expect(validateQuantity('50')).toBe(null); // String number
      expect(validateQuantity(1000000)).toBe(null); // Max valid: 1 triệu
    });
  });
  
});

// ============================================
// Tổng hợp Validation Tests cho Product Form
// ============================================
describe('Product Form Validation Integration', () => {
  
  test('TC: Form với tất cả fields hợp lệ - không có lỗi', () => {
    const product = {
      name: 'Laptop Dell XPS 13',
      price: 25000000,
      quantity: 10
    };
    
    const nameError = validateProductName(product.name);
    const priceError = validatePrice(product.price);
    const quantityError = validateQuantity(product.quantity);
    
    expect(nameError).toBe(null);
    expect(priceError).toBe(null);
    expect(quantityError).toBe(null);
  });
  
  test('TC: Form với nhiều lỗi - nên trả về tất cả lỗi', () => {
    const product = {
      name: '',
      price: -1000,
      quantity: -5
    };
    
    const nameError = validateProductName(product.name);
    const priceError = validatePrice(product.price);
    const quantityError = validateQuantity(product.quantity);
    
    expect(nameError).toBeTruthy();
    expect(priceError).toBeTruthy();
    expect(quantityError).toBeTruthy();
  });
  
  test('TC: Form với một số fields hợp lệ - chỉ trả lỗi cho field không hợp lệ', () => {
    const product = {
      name: 'Valid Product',
      price: 1000,
      quantity: -1 // Invalid
    };
    
    const nameError = validateProductName(product.name);
    const priceError = validatePrice(product.price);
    const quantityError = validateQuantity(product.quantity);
    
    expect(nameError).toBe(null);
    expect(priceError).toBe(null);
    expect(quantityError).toBe('Số lượng không được là số âm');
  });
  
  // Boundary tests
  test('TC: Boundary values - minimum valid values', () => {
    expect(validateProductName('ab')).toBe(null); // Min 2 chars
    expect(validatePrice(0)).toBe(null); // Min >= 0
    expect(validateQuantity(0)).toBe(null); // Min >= 0
  });
  
  test('TC: Boundary values - maximum valid values', () => {
    expect(validateProductName('a'.repeat(100))).toBe(null); // Max 100 chars
    expect(validatePrice(1000000000)).toBe(null); // Max 1 tỷ
    expect(validateQuantity(1000000)).toBe(null); // Max 1 triệu
  });
  
  test('TC: Boundary values - just beyond limits', () => {
    expect(validateProductName('a')).toBeTruthy(); // 1 char (< 2)
    expect(validateProductName('a'.repeat(101))).toBeTruthy(); // 101 chars (> 100)
    expect(validatePrice(-1)).toBeTruthy(); // -1 (< 0)
    expect(validatePrice(1000000001)).toBeTruthy(); // > 1 tỷ
    expect(validateQuantity(-1)).toBeTruthy(); // -1 (< 0)
    expect(validateQuantity(1000001)).toBeTruthy(); // > 1 triệu
  });
});

// ============================================
// c) Coverage >= 90% cho validation module
// Chạy: npm test -- --coverage --watchAll=false
// ============================================
