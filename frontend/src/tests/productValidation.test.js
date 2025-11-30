import { validateProduct } from '../utils/validationProducts';

describe('Product Validation Tests', () => {
  
  // TC_PRODUCT_001: Happy Path - Tất cả fields hợp lệ
  describe('TC_PRODUCT_001: Happy Path Tests', () => {
    test('Sản phẩm với tất cả fields hợp lệ', () => {
      const errors = validateProduct({
        name: 'Samsung Galaxy S24',
        price: 25000000,
        quantity: 50,
        category: 'iphone'
      });
      expect(errors).toBe(null);
    });
  });

  // TC_PRODUCT_002-004: Negative Tests
  describe('Negative Tests', () => {
    test('TC_PRODUCT_002: Giá âm', () => {
      const errors = validateProduct({
        name: 'Laptop',
        price: -500000,
        quantity: 10,
        category: 'macbook'
      });
      expect(errors.price).toBe('Giá không được là số âm');
    });

    test('TC_PRODUCT_003: Cập nhật sản phẩm hợp lệ', () => {
      const errors = validateProduct({
        name: 'Updated Product',
        price: 2000,
        quantity: 20,
        category: 'ipad'
      });
      expect(errors).toBe(null);
    });

    test('TC_PRODUCT_004: Tên quá ngắn', () => {
      const errors = validateProduct({
        name: 'TV',
        price: 1000,
        quantity: 5,
        category: 'iphone'
      });
      expect(errors.name).toBe('Tên sản phẩm phải có ít nhất 3 ký tự');
    });
  });

  // Validate Product Name
  describe('validateProduct() - Name field', () => {
    test('Empty/Null name', () => {
      let errors = validateProduct({ name: '', price: 1000, quantity: 5, category: 'iphone' });
      expect(errors.name).toBe('Tên sản phẩm là bắt buộc, không được để trống');
      
      errors = validateProduct({ name: null, price: 1000, quantity: 5, category: 'iphone' });
      expect(errors.name).toBe('Tên sản phẩm là bắt buộc, không được để trống');
    });

    test('Boundary values', () => {
      let errors = validateProduct({ name: 'abc', price: 1000, quantity: 5, category: 'iphone' });
      expect(errors).toBe(null); // Min: 3
      
      errors = validateProduct({ name: 'a'.repeat(100), price: 1000, quantity: 5, category: 'iphone' });
      expect(errors).toBe(null); // Max: 100
      
      errors = validateProduct({ name: 'ab', price: 1000, quantity: 5, category: 'iphone' });
      expect(errors.name).toBeTruthy(); // < 3
      
      errors = validateProduct({ name: 'a'.repeat(101), price: 1000, quantity: 5, category: 'iphone' });
      expect(errors.name).toBe('Tên sản phẩm không được vượt quá 100 ký tự');
    });
  });

  // Validate Price
  describe('validateProduct() - Price field', () => {
    test('Empty/Invalid price', () => {
      let errors = validateProduct({ name: 'Product', price: '', quantity: 5, category: 'iphone' });
      expect(errors.price).toBe('Giá là bắt buộc');
      
      errors = validateProduct({ name: 'Product', price: null, quantity: 5, category: 'iphone' });
      expect(errors.price).toBe('Giá là bắt buộc');
      
      errors = validateProduct({ name: 'Product', price: 'abc', quantity: 5, category: 'iphone' });
      expect(errors.price).toBe('Giá phải là số');
    });

    test('Valid price', () => {
      let errors = validateProduct({ name: 'Product', price: 0, quantity: 5, category: 'iphone' });
      expect(errors).toBe(null);
      
      errors = validateProduct({ name: 'Product', price: '1000', quantity: 5, category: 'iphone' });
      expect(errors).toBe(null);
      
      errors = validateProduct({ name: 'Product', price: 1000000000, quantity: 5, category: 'iphone' });
      expect(errors).toBe(null); // Max: 1 tỷ
    });

    test('Invalid range', () => {
      let errors = validateProduct({ name: 'Product', price: -1, quantity: 5, category: 'iphone' });
      expect(errors.price).toBeTruthy();
      
      errors = validateProduct({ name: 'Product', price: 1000000001, quantity: 5, category: 'iphone' });
      expect(errors.price).toBe('Giá không được vượt quá 1 tỷ');
    });
  });

  // Validate Quantity
  describe('validateProduct() - Quantity field', () => {
    test('Empty/Invalid quantity', () => {
      let errors = validateProduct({ name: 'Product', price: 1000, quantity: '', category: 'iphone' });
      expect(errors.quantity).toBe('Số lượng là bắt buộc');
      
      errors = validateProduct({ name: 'Product', price: 1000, quantity: 'abc', category: 'iphone' });
      expect(errors.quantity).toBe('Số lượng phải là số nguyên');
      
      errors = validateProduct({ name: 'Product', price: 1000, quantity: 10.5, category: 'iphone' });
      expect(errors.quantity).toBe('Số lượng phải là số nguyên');
    });

    test('Valid quantity', () => {
      let errors = validateProduct({ name: 'Product', price: 1000, quantity: 0, category: 'iphone' });
      expect(errors).toBe(null);
      
      errors = validateProduct({ name: 'Product', price: 1000, quantity: '50', category: 'iphone' });
      expect(errors).toBe(null);
      
      errors = validateProduct({ name: 'Product', price: 1000, quantity: 1000000, category: 'iphone' });
      expect(errors).toBe(null); // Max: 1 triệu
    });

    test('Invalid range', () => {
      let errors = validateProduct({ name: 'Product', price: 1000, quantity: -1, category: 'iphone' });
      expect(errors.quantity).toBe('Số lượng không được là số âm');
      
      errors = validateProduct({ name: 'Product', price: 1000, quantity: 1000001, category: 'iphone' });
      expect(errors.quantity).toBe('Số lượng không được vượt quá 1 triệu');
    });
  });

  // Validate Category
  describe('validateProduct() - Category field', () => {
    test('Empty category', () => {
      let errors = validateProduct({ name: 'Product', price: 1000, quantity: 5, category: '' });
      expect(errors.category).toBe('Danh mục là bắt buộc');
      
      errors = validateProduct({ name: 'Product', price: 1000, quantity: 5, category: null });
      expect(errors.category).toBe('Danh mục là bắt buộc');
    });

    test('Invalid category', () => {
      const errors = validateProduct({ name: 'Product', price: 1000, quantity: 5, category: 'invalid-category' });
      expect(errors.category).toBe('Danh mục không hợp lệ');
    });

    test('Valid categories', () => {
      const validCategories = ['iphone', 'ipad', 'macbook', 'imac', 'airpod', 'airmax', 'applewatch'];
      validCategories.forEach(cat => {
        const errors = validateProduct({ name: 'Product', price: 1000, quantity: 5, category: cat });
        expect(errors).toBe(null);
      });
    });
  });
  
});

// Product Form Integration Tests
describe('Product Form Validation Integration', () => {

  test('TC_FORM_001: Form hợp lệ', () => {
    const errors = validateProduct({
      name: 'Samsung Galaxy S24',
      price: 25000000,
      quantity: 50,
      category: 'iphone'
    });
    expect(errors).toBe(null);
  });

  test('TC_FORM_002: Form với giá âm', () => {
    const errors = validateProduct({
      name: 'Laptop Gaming',
      price: -500000,
      quantity: 10,
      category: 'macbook'
    });
    expect(errors.price).toBe('Giá không được là số âm');
    expect(errors.name).toBeUndefined();
  });

  test('TC_FORM_003: Form với nhiều lỗi', () => {
    const errors = validateProduct({
      name: 'TV',
      price: -1000,
      quantity: -5,
      category: ''
    });
    expect(errors.name).toBeTruthy();
    expect(errors.price).toBeTruthy();
    expect(errors.quantity).toBeTruthy();
    expect(errors.category).toBeTruthy();
  });

  test('TC_FORM_004: Form update hợp lệ', () => {
    const errors = validateProduct({
      name: 'Updated Product',
      price: 2000,
      quantity: 20,
      category: 'ipad'
    });
    expect(errors).toBe(null);
  });

  // Boundary Tests
  test('TC_BOUNDARY: Min/Max values', () => {
    let errors = validateProduct({ name: 'abc', price: 0, quantity: 0, category: 'iphone' });
    expect(errors).toBe(null);
    
    errors = validateProduct({ name: 'a'.repeat(100), price: 1000000000, quantity: 1000000, category: 'iphone' });
    expect(errors).toBe(null);
  });

  test('TC_BOUNDARY: Beyond limits', () => {
    let errors = validateProduct({ name: 'ab', price: 1000, quantity: 5, category: 'iphone' });
    expect(errors.name).toBeTruthy();
    
    errors = validateProduct({ name: 'a'.repeat(101), price: 1000, quantity: 5, category: 'iphone' });
    expect(errors.name).toBeTruthy();
    
    errors = validateProduct({ name: 'Product', price: -1, quantity: 5, category: 'iphone' });
    expect(errors.price).toBeTruthy();
    
    errors = validateProduct({ name: 'Product', price: 1000000001, quantity: 5, category: 'iphone' });
    expect(errors.price).toBeTruthy();
    
    errors = validateProduct({ name: 'Product', price: 1000, quantity: -1, category: 'iphone' });
    expect(errors.quantity).toBeTruthy();
    
    errors = validateProduct({ name: 'Product', price: 1000, quantity: 1000001, category: 'iphone' });
    expect(errors.quantity).toBeTruthy();
  });

  test('TC_EDGE: String numbers', () => {
    const errors = validateProduct({ name: 'Product', price: '1000', quantity: '50', category: 'iphone' });
    expect(errors).toBe(null);
  });
});

