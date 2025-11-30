// cypress/e2e/product.cy.js
import ProductPage from "./pages/ProductPage";

describe("Product CRUD Operations Tests", () => {
  const productPage = new ProductPage();

  beforeEach(() => {
    // Login trước mỗi test
    productPage.login();
  });

  // ========================================
  // A. TEST CREATE PRODUCT
  // ========================================

  describe("Create Product", () => {
    it("should create a new product successfully with valid data", () => {
      // Click nút Thêm Mới
      productPage.clickAddButton();
      productPage.verifyModalVisible();

      // Điền thông tin sản phẩm hợp lệ
      const newProduct = {
        name: "iPhone 16 Pro",
        category: "iphone",
        description: "Sản phẩm mới nhất từ Apple",
        price: 29999000,
        quantity: 15,
      };

      productPage.fillProductForm(newProduct);

      // Stub alert để verify
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Thêm sản phẩm thành công");
      });

      // Submit form
      productPage.submitForm();

      // Verify modal đóng và sản phẩm xuất hiện trong danh sách
      cy.wait(1000);
      productPage.verifyModalNotVisible();
      productPage.verifyProductExists(newProduct.name);
    });

    it("should show validation errors when creating product with empty required fields", () => {
      productPage.clickAddButton();

      // Submit form trống
      productPage.submitForm();

      // Verify các lỗi validation hiển thị
      productPage.verifyNameErrorText("Tên sản phẩm là bắt buộc");
      productPage.verifyCategoryErrorText("Danh mục là bắt buộc");
      productPage.verifyPriceErrorText("Giá là bắt buộc");
      productPage.verifyQuantityErrorText("Số lượng là bắt buộc");
    });

    it("should show error when product name is too short", () => {
      productPage.clickAddButton();

      productPage.fillProductForm({
        name: "IP", // Chỉ 2 ký tự
        category: "iphone",
        price: 10000,
        quantity: 5,
      });

      productPage.submitForm();
      productPage.verifyNameErrorText("Tên sản phẩm phải có ít nhất 3 ký tự");
    });

    it("should show error when price is negative", () => {
      productPage.clickAddButton();

      productPage.fillProductForm({
        name: "Test Product",
        category: "iphone",
        price: -1000,
        quantity: 5,
      });

      productPage.submitForm();
      productPage.verifyPriceErrorText("Giá không được là số âm");
    });

    it("should show error when quantity is not an integer", () => {
      productPage.clickAddButton();

      productPage.fillProductForm({
        name: "Test Product",
        category: "iphone",
        price: 10000,
        quantity: 5.5, // Số thập phân
      });

      productPage.submitForm();
      productPage.verifyQuantityErrorText("Số lượng phải là số nguyên");
    });
  });

  // ========================================
  // B. TEST READ/LIST PRODUCTS
  // ========================================

  describe("Read/List Products", () => {
    it("should display all products on page load", () => {
      // Verify có sản phẩm hiển thị (từ mock data)
      productPage.productCards.should("have.length.at.least", 3);
    });

    it("should display product details correctly", () => {
      // Verify thông tin sản phẩm đầu tiên từ mock
      productPage.verifyProductExists("Laptop Dell XPS 15");
      productPage.productCards.first().within(() => {
        cy.contains("Laptop Dell XPS 15").should("be.visible");
        cy.contains("macbook").should("be.visible");
        cy.contains("SL: 5").should("be.visible");
      });
    });

    it("should show empty state when no products match filter", () => {
      // Search với keyword không tồn tại
      productPage.searchProduct("ProductNotExists12345");
      cy.contains("Không tìm thấy sản phẩm").should("be.visible");
    });
  });

  // ========================================
  // C. TEST UPDATE PRODUCT (0.5 điểm)
  // ========================================

  describe("Update Product", () => {
    it("should update product successfully with valid data", () => {
      // Click nút Sửa của sản phẩm đầu tiên (id = 1)
      productPage.clickEditButton(1);
      productPage.verifyModalVisible();

      // Verify form được điền sẵn dữ liệu cũ
      productPage.nameInput.should("have.value", "Laptop Dell XPS 15");

      // Sửa thông tin
      const updatedProduct = {
        name: "Laptop Dell XPS 15 Updated",
        price: 38000000,
        quantity: 8,
      };

      productPage.fillProductForm(updatedProduct);

      cy.on("window:alert", (text) => {
        expect(text).to.contains("Cập nhật sản phẩm thành công");
      });

      productPage.submitForm();

      // Verify sản phẩm được cập nhật
      cy.wait(1000);
      productPage.verifyModalNotVisible();
      productPage.verifyProductExists(updatedProduct.name);
    });

    it("should show validation error when updating with invalid name length", () => {
      productPage.clickEditButton(1);

      // Nhập tên quá dài (> 100 ký tự)
      productPage.fillProductForm({
        name: "a".repeat(101),
      });

      productPage.submitForm();
      productPage.verifyNameErrorText(
        "Tên sản phẩm không được vượt quá 100 ký tự"
      );
    });

    it("should show error when updating price exceeds maximum", () => {
      productPage.clickEditButton(1);

      productPage.fillProductForm({
        price: 1000000001, // > 1 tỷ
      });

      productPage.submitForm();
      productPage.verifyPriceErrorText("Giá không được vượt quá 1 tỷ");
    });

    it("should close modal without saving when clicking close button", () => {
      productPage.clickEditButton(1);
      productPage.verifyModalVisible();

      // Sửa tên
      productPage.fillProductForm({
        name: "This should not be saved",
      });

      // Đóng modal
      productPage.closeModal();
      productPage.verifyModalNotVisible();

      // Verify sản phẩm không thay đổi
      productPage.verifyProductNotExists("This should not be saved");
      productPage.verifyProductExists("Laptop Dell XPS 15");
    });
  });

  // ========================================
  // D. TEST DELETE PRODUCT (0.5 điểm)
  // ========================================

  describe("Delete Product", () => {
    it("should delete product successfully when confirmed", () => {
      // Lấy tên sản phẩm trước khi xóa
      const productToDelete = "iPhone 15 Pro Max";

      productPage.verifyProductExists(productToDelete);

      // Stub confirm dialog
      productPage.confirmDelete();

      // Stub alert
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Xóa sản phẩm thành công");
      });

      // Click delete button (id = 2)
      productPage.clickDeleteButton(2);

      // Verify sản phẩm đã bị xóa khỏi danh sách
      cy.wait(1000);
      productPage.verifyProductNotExists(productToDelete);
    });

    it("should NOT delete product when user cancels confirmation", () => {
      const productName = "Samsung Galaxy S24";

      productPage.verifyProductExists(productName);

      // User chọn Cancel trong confirm dialog
      productPage.cancelDelete();

      productPage.clickDeleteButton(3);

      // Verify sản phẩm vẫn còn
      productPage.verifyProductExists(productName);
    });
  });

  // ========================================
  // E. TEST SEARCH/FILTER FUNCTIONALITY (0.5 điểm)
  // ========================================

  describe("Search and Filter", () => {
    it("should filter products by search term", () => {
      // Search "iPhone"
      productPage.searchProduct("iPhone");

      // Verify chỉ hiển thị sản phẩm có chứa "iPhone"
      productPage.productCards.each(($card) => {
        cy.wrap($card).should("contain", "iPhone");
      });

      // Verify sản phẩm không chứa "iPhone" bị ẩn
      productPage.verifyProductNotExists("Laptop Dell XPS 15");
    });

    it("should filter products by category", () => {
      // Filter theo category "iphone"
      productPage.filterByCategory("iphone");

      // Verify chỉ hiển thị sản phẩm thuộc category iphone
      productPage.productCards.each(($card) => {
        cy.wrap($card)
          .find(".product-category strong")
          .should("contain", "iphone");
      });
    });

    it("should combine search and category filter", () => {
      // Search "Samsung" và filter category "iphone"
      productPage.searchProduct("Samsung");
      productPage.filterByCategory("iphone");

      // Verify kết quả thỏa cả 2 điều kiện
      productPage.verifyProductExists("Samsung Galaxy S24");
      productPage.verifyProductNotExists("Laptop Dell XPS 15");
      productPage.verifyProductNotExists("iPhone 15 Pro Max");
    });

    it("should show all products when search is cleared", () => {
      // Search trước
      productPage.searchProduct("iPhone");
      productPage.verifyProductCount(1);

      // Clear search
      productPage.searchInput.clear();

      // Verify tất cả sản phẩm hiển thị lại
      productPage.productCards.should("have.length.at.least", 3);
    });

    it("should filter case-insensitive", () => {
      // Search với chữ hoa/thường khác nhau
      productPage.searchProduct("IPHONE");

      // Verify vẫn tìm được sản phẩm
      productPage.verifyProductExists("iPhone 15 Pro Max");
    });

    it("should reset to show all products when category filter is set to 'Tất cả'", () => {
      // Filter theo category trước
      productPage.filterByCategory("iphone");
      productPage.productCards.should("have.length", 2);

      // Reset về "Tất cả"
      productPage.filterByCategory("");

      // Verify tất cả sản phẩm hiển thị
      productPage.productCards.should("have.length.at.least", 3);
    });
  });
});
