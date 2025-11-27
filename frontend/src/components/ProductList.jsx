import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../services/productService";
import ProductForm from "./ProductForm";
import "./Product.css";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
        alert("Xóa sản phẩm thành công!");
      } catch (err) {
        alert("Xóa sản phẩm thất bại!");
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">📦 Quản lý</div>
        <ul className="sidebar-menu">
          <li className="menu-item active">
            <span>Trang chủ </span>
          </li>
          {/* <li className="menu-item">
            <span>Analytics</span>
          </li> */}
          {/* <li className="menu-item">
            <span>Cài đặt</span>
          </li> */}
        </ul>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="top-bar">
          <div className="page-title">
            <h1>Sản Phẩm</h1>
            <span>Quản lý kho hàng của bạn</span>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="btn-add" onClick={handleAdd}>
              + Thêm Mới
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <div className="empty-state">Không tìm thấy sản phẩm.</div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {/* --- PHẦN ĐƯỢC SỬA: Dùng Flexbox để tách Tên và Badge --- */}
                  <div className="card-header-flex">
                    <div className="product-info">
                      <h3>{product.name}</h3>
                    </div>
                    {product.quantity < 10 ? (
                      <span className="status-badge status-low">Hết hàng</span>
                    ) : (
                      <span className="status-badge status-ok">Còn hàng</span>
                    )}
                  </div>
                  {/* ------------------------------------------------------- */}

                  <p className="product-description">
                    {product.description || "Chưa có mô tả"}
                  </p>

                  <div className="product-meta">
                    <span className="product-price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </span>
                    <span className="product-quantity">
                      SL: {product.quantity}
                    </span>
                  </div>

                  <div className="product-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(product)}
                      data-testid={`edit-button-${product.id}`}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn-action btn-delete"
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
        )}

        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </main>
    </div>
  );
};

export default ProductList;
