// cypress/e2e/pages/ProductPage.js

class ProductPage {
  // Main Page Selectors
  get pageTitle() {
    return cy.contains("h1", "Sản Phẩm");
  }

  get searchInput() {
    return cy.get('.search-box input[type="text"]');
  }

  get addButton() {
    return cy.contains("button", "+ Thêm Mới");
  }

  get logoutButton() {
    return cy.contains("button", "Đăng xuất");
  }

  get productCards() {
    return cy.get(".product-card");
  }

  get emptyState() {
    return cy.get(".empty-state");
  }

  get loadingState() {
    return cy.get(".loading");
  }

  get errorMessage() {
    return cy.get(".error-message");
  }

  // Product Card Selectors
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

  // Form Modal Selectors
  get formModal() {
    return cy.get('[data-testid="product-form-modal"]');
  }

  get formTitle() {
    return cy.get('[data-testid="product-form-modal"] h2');
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

  // Actions - Navigation
  visit() {
    cy.visit("/products");
  }

  clickAddButton() {
    this.addButton.click();
  }

  clickLogout() {
    this.logoutButton.click();
  }

  // Actions - Search
  searchProduct(searchTerm) {
    this.searchInput.clear().type(searchTerm);
  }

  clearSearch() {
    this.searchInput.clear();
  }

  // Actions - Product Card
  clickEdit(productId) {
    this.getEditButton(productId).click();
  }

  clickDelete(productId) {
    this.getDeleteButton(productId).click();
  }

  // Actions - Form
  fillName(name) {
    this.nameInput.clear().type(name);
  }

  selectCategory(category) {
    this.categorySelect.select(category);
  }

  fillDescription(description) {
    this.descriptionInput.clear().type(description);
  }

  fillPrice(price) {
    this.priceInput.clear().type(price);
  }

  fillQuantity(quantity) {
    this.quantityInput.clear().type(quantity);
  }

  clickSubmit() {
    this.submitButton.click();
  }

  clickClose() {
    this.closeButton.click();
  }

  fillProductForm(data) {
    if (data.name !== undefined) this.fillName(data.name);
    if (data.category) this.selectCategory(data.category);
    if (data.description !== undefined) this.fillDescription(data.description);
    if (data.price !== undefined) this.fillPrice(data.price);
    if (data.quantity !== undefined) this.fillQuantity(data.quantity);
  }

  submitProductForm(data) {
    this.fillProductForm(data);
    this.clickSubmit();
  }

  // Assertions - Page
  verifyPageTitleVisible() {
    this.pageTitle.should("be.visible");
  }

  verifyUrl() {
    cy.url().should("include", "/products");
  }

  verifySearchInputVisible() {
    this.searchInput.should("be.visible");
  }

  verifyAddButtonVisible() {
    this.addButton.should("be.visible");
  }

  verifyProductCardsCount(count) {
    this.productCards.should("have.length", count);
  }

  verifyProductCardsMinCount(minCount) {
    this.productCards.should("have.length.at.least", minCount);
  }

  verifyEmptyStateVisible() {
    this.emptyState.should("be.visible");
  }

  verifyEmptyStateText(text) {
    this.emptyState.should("contain", text);
  }

  verifyLoadingVisible() {
    this.loadingState.should("be.visible");
  }

  verifyLoadingNotVisible() {
    this.loadingState.should("not.exist");
  }

  // Assertions - Product Card
  verifyProductCardVisible(productId) {
    this.getProductCard(productId).should("be.visible");
  }

  verifyProductCardContainsText(productId, text) {
    this.getProductCard(productId).should("contain", text);
  }

  verifyProductCardNotExist(productName) {
    cy.contains(".product-card", productName).should("not.exist");
  }

  verifyProductExists(productName) {
    cy.contains(".product-card h3", productName).should("exist");
  }

  verifyProductPrice(productName, price) {
    cy.contains(".product-card", productName)
      .find(".product-price")
      .should("contain", price);
  }

  verifyProductQuantity(productName, quantity) {
    cy.contains(".product-card", productName)
      .find(".product-quantity")
      .should("contain", `SL: ${quantity}`);
  }

  verifyProductStatus(productName, status) {
    cy.contains(".product-card", productName)
      .find(".status-badge")
      .should("contain", status);
  }

  // Assertions - Form Modal
  verifyFormModalVisible() {
    this.formModal.should("be.visible");
  }

  verifyFormModalNotVisible() {
    this.formModal.should("not.exist");
  }

  verifyFormTitle(title) {
    this.formTitle.should("contain", title);
  }

  verifyNameInputValue(value) {
    this.nameInput.should("have.value", value);
  }

  verifyCategorySelectValue(value) {
    this.categorySelect.should("have.value", value);
  }

  verifyDescriptionInputValue(value) {
    this.descriptionInput.should("have.value", value);
  }

  verifyPriceInputValue(value) {
    this.priceInput.should("have.value", value);
  }

  verifyQuantityInputValue(value) {
    this.quantityInput.should("have.value", value);
  }

  verifySubmitButtonDisabled() {
    this.submitButton.should("be.disabled");
  }

  verifySubmitButtonNotDisabled() {
    this.submitButton.should("not.be.disabled");
  }

  verifySubmitButtonText(text) {
    this.submitButton.should("contain", text);
  }

  // Assertions - Validation Errors
  verifyNameErrorVisible() {
    this.nameError.should("be.visible");
  }

  verifyNameErrorText(text) {
    this.nameError.should("contain", text);
  }

  verifyNameErrorNotExist() {
    this.nameError.should("not.exist");
  }

  verifyCategoryErrorVisible() {
    this.categoryError.should("be.visible");
  }

  verifyCategoryErrorText(text) {
    this.categoryError.should("contain", text);
  }

  verifyCategoryErrorNotExist() {
    this.categoryError.should("not.exist");
  }

  verifyPriceErrorVisible() {
    this.priceError.should("be.visible");
  }

  verifyPriceErrorText(text) {
    this.priceError.should("contain", text);
  }

  verifyPriceErrorNotExist() {
    this.priceError.should("not.exist");
  }

  verifyQuantityErrorVisible() {
    this.quantityError.should("be.visible");
  }

  verifyQuantityErrorText(text) {
    this.quantityError.should("contain", text);
  }

  verifyQuantityErrorNotExist() {
    this.quantityError.should("not.exist");
  }

  verifyApiErrorVisible() {
    this.apiError.should("be.visible");
  }

  verifyApiErrorText(text) {
    this.apiError.should("contain", text);
  }

  verifyApiErrorNotExist() {
    this.apiError.should("not.exist");
  }

  verifyNameInputHasClass(className) {
    this.nameInput.should("have.class", className);
  }

  verifyCategorySelectHasClass(className) {
    this.categorySelect.should("have.class", className);
  }

  verifyPriceInputHasClass(className) {
    this.priceInput.should("have.class", className);
  }

  verifyQuantityInputHasClass(className) {
    this.quantityInput.should("have.class", className);
  }

  // Utilities
  setupConfirmStub(returnValue = true) {
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(returnValue);
    });
  }

  setupAlertStub() {
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertStub");
    });
  }

  verifyAlertCalled(message) {
    cy.get("@alertStub").should("have.been.calledWith", message);
  }

  verifyConfirmCalled(message) {
    cy.window().then((win) => {
      expect(win.confirm).to.have.been.calledWith(message);
    });
  }
}

export default ProductPage;
