import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../services/productService';
import { validateProductName, validatePrice, validateQuantity } from '../utils/validation';
import './Product.css';

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.productName ?? product.name ?? '',
        description: product.description ?? '',
        price: product.price != null ? String(product.price) : '',
        quantity:
          product.amount != null
            ? String(product.amount)
            : (product.quantity != null ? String(product.quantity) : '')
      });
    } else {
      // Reset form when no product (adding new)
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    const nameError = validateProductName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    // Validate price
    const priceError = validatePrice(formData.price);
    if (priceError) {
      newErrors.price = priceError;
    }

    // Validate quantity
    const quantityError = validateQuantity(formData.quantity);
    if (quantityError) {
      newErrors.quantity = quantityError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productData = {
        productName: formData.name ?? '',
        description: formData.description ?? '',
        price: parseFloat(formData.price) || 0,
        amount: parseInt(formData.quantity, 10) || 0
      };

      if (product) {
        await updateProduct(product.id, productData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await createProduct(productData);
        alert('Thêm sản phẩm thành công!');
      }

      onSuccess();
    } catch (error) {
      setApiError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modal-overlay" data-testid="product-form-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{product ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
          <button
            className="btn-close"
            onClick={onClose}
            data-testid="close-button"
          >
            ×
          </button>
        </div>

        {apiError && (
          <div className="error-message" data-testid="api-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Tên sản phẩm *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Nhập tên sản phẩm"
              data-testid="name-input"
            />
            {errors.name && (
              <span className="error-text" data-testid="name-error">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm"
              rows="3"
              data-testid="description-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
              placeholder="Nhập giá sản phẩm"
              min="0"
              step="0.01"
              data-testid="price-input"
            />
            {errors.price && (
              <span className="error-text" data-testid="price-error">
                {errors.price}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Số lượng *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? 'error' : ''}
              placeholder="Nhập số lượng"
              min="0"
              step="1"
              data-testid="quantity-input"
            />
            {errors.quantity && (
              <span className="error-text" data-testid="quantity-error">
                {errors.quantity}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              data-testid="submit-button"
            >
              {loading ? 'Đang xử lý...' : (product ? 'Cập Nhật' : 'Thêm Mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
