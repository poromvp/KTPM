import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../services/productService';
import ProductForm from './ProductForm';
import './Product.css';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        alert('Xóa sản phẩm thành công!');
      } catch (err) {
        alert('Xóa sản phẩm thất bại!');
        console.error(err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <div className="loading" data-testid="loading">Đang tải...</div>;
  }

  return (
    <div className="product-container">
      <div className="product-header">
        <h1>Quản Lý Sản Phẩm</h1>
        <div className="header-actions">
          <button 
            className="btn-add" 
            onClick={handleAdd}
            data-testid="add-button"
          >
            + Thêm Sản Phẩm
          </button>
          <button 
            className="btn-logout" 
            onClick={handleLogout}
            data-testid="logout-button"
          >
            Đăng Xuất
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <div className="product-grid" data-testid="product-list">
        {products.length === 0 ? (
          <div className="empty-state" data-testid="empty-state">
            Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card" data-testid={`product-${product.id}`}>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">
                  Giá: {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(product.price)}
                </p>
                <p className="product-quantity">Số lượng: {product.quantity}</p>
              </div>
              <div className="product-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEdit(product)}
                  data-testid={`edit-button-${product.id}`}
                >
                  Sửa
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(product.id)}
                  data-testid={`delete-button-${product.id}`}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
