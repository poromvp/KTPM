class ProductPage {
  // Navigation & Header
  get logoutButton() {
    return cy.get(".btn-logout");
  }

  get addButton() {
    return cy.get(".btn-add");
  }

  get searchInput() {
    return cy.get('.search-box input[type="text"]');
  }

  get categoryFilter() {
    return cy.get(".category-filter");
  }

  // Product Cards
  get productCards() {
    return cy.get(".product-card");
  }

  getProductCard(productId) {
    return cy
      .get(`[data-testid="edit-button-${productId}"]`)
      .closest(".product-card");
  }

  getEditButton(productId) {
    return cy.get(`[data-testid="edit-button-${productId}"]`);
  }

  getDeleteButton(productId) {
    return cy.get(`[data-testid="delete-button-${productId}"]`);
  }

  // Modal Form Elements
  get modal() {
    return cy.get('[data-testid="product-form-modal"]');
  }

  get closeButton() {
    return cy.get('[data-testid="close-button"]');
  }

  get nameInput() {
    return cy.get('[data-testid="name-input"]');
  }

  get categorySelect() {
    return cy.get('[data-testid="category-select"]');
  }

  get descriptionInput() {
    return cy.get('[data-testid="description-input"]');
  }

  get priceInput() {
    return cy.get('[data-testid="price-input"]');
  }

  get quantityInput() {
    return cy.get('[data-testid="quantity-input"]');
  }

  get submitButton() {
    return cy.get('[data-testid="submit-button"]');
  }

  // Error Messages
  get nameError() {
    return cy.get('[data-testid="name-error"]');
  }

  get categoryError() {
    return cy.get('[data-testid="category-error"]');
  }

  get priceError() {
    return cy.get('[data-testid="price-error"]');
  }

  get quantityError() {
    return cy.get('[data-testid="quantity-error"]');
  }

  get apiError() {
    return cy.get('[data-testid="api-error"]');
  }

  // --- Actions ---

  visit() {
    cy.visit("/products");
  }

  login() {
    cy.visit("/");
    cy.clearLocalStorage();
    cy.get('[data-testid="email-input"]').type("admin");
    cy.get('[data-testid="password-input"]').type("Admin123");
    cy.get('[data-testid="submit-button"]').click();
    cy.url({ timeout: 10000 }).should("include", "/products");
  }

  clickAddButton() {
    this.addButton.click();
  }

  clickEditButton(productId) {
    this.getEditButton(productId).click();
  }

  clickDeleteButton(productId) {
    this.getDeleteButton(productId).click();
  }

  fillProductForm(productData) {
    if (productData.name !== undefined) {
      this.nameInput.clear().type(productData.name);
    }
    if (productData.category) {
      this.categorySelect.select(productData.category);
    }
    if (productData.description !== undefined) {
      this.descriptionInput.clear();
      if (productData.description) {
        this.descriptionInput.type(productData.description);
      }
    }
    if (productData.price !== undefined) {
      this.priceInput.clear().type(productData.price.toString());
    }
    if (productData.quantity !== undefined) {
      this.quantityInput.clear().type(productData.quantity.toString());
    }
  }

  submitForm() {
    this.submitButton.click();
  }

  closeModal() {
    this.closeButton.click();
  }

  searchProduct(searchTerm) {
    this.searchInput.clear().type(searchTerm);
  }

  filterByCategory(category) {
    this.categoryFilter.select(category);
  }

  confirmDelete() {
    cy.on("window:confirm", () => true);
  }

  cancelDelete() {
    cy.on("window:confirm", () => false);
  }

  // --- Assertions ---

  verifyProductExists(productName) {
    this.productCards.should("contain", productName);
  }

  verifyProductNotExists(productName) {
    this.productCards.should("not.contain", productName);
  }

  verifyProductCount(count) {
    this.productCards.should("have.length", count);
  }

  verifyModalVisible() {
    this.modal.should("be.visible");
  }

  verifyModalNotVisible() {
    this.modal.should("not.exist");
  }

  verifyProductDetails(productData) {
    if (productData.name) {
      this.productCards.should("contain", productData.name);
    }
    if (productData.price) {
      const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(productData.price);
      this.productCards.should("contain", formattedPrice);
    }
    if (productData.quantity) {
      this.productCards.should("contain", `SL: ${productData.quantity}`);
    }
  }

  verifyNameErrorText(text) {
    this.nameError.should("be.visible").and("contain", text);
  }

  verifyCategoryErrorText(text) {
    this.categoryError.should("be.visible").and("contain", text);
  }

  verifyPriceErrorText(text) {
    this.priceError.should("be.visible").and("contain", text);
  }

  verifyQuantityErrorText(text) {
    this.quantityError.should("be.visible").and("contain", text);
  }

  verifyAlertShown(message) {
    cy.on("window:alert", (text) => {
      expect(text).to.contains(message);
    });
  }
}

export default ProductPage;
