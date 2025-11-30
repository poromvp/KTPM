// cypress/e2e/pages/LoginPage.js

class LoginPage {
  // --- Selectors ---
  get usernameInput() {
    return cy.get('[data-testid="email-input"]');
  }
  get passwordInput() {
    return cy.get('[data-testid="password-input"]');
  }
  get submitButton() {
    return cy.get('[data-testid="submit-button"]');
  }

  // Errors
  get usernameError() {
    return cy.get('[data-testid="userName-error"]');
  }
  get passwordError() {
    return cy.get('[data-testid="password-error"]');
  }
  get apiError() {
    return cy.get('[data-testid="api-error"]');
  }

  // --- Actions ---
  visit() {
    cy.visit("/");
    cy.clearLocalStorage();
  }

  fillUsername(username) {
    if (username) this.usernameInput.clear().type(username);
    else this.usernameInput.clear();
  }

  fillPassword(password) {
    if (password) this.passwordInput.clear().type(password);
    else this.passwordInput.clear();
  }

  clickSubmit() {
    this.submitButton.click();
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickSubmit();
  }

  // --- Assertions ---
  verifyPlaceholder(element, text) {
    element.should("have.attr", "placeholder", text);
  }

  verifyInputHasClass(element, className) {
    element.should("have.class", className);
  }

  verifyInputNotHasClass(element, className) {
    element.should("not.have.class", className);
  }

  verifySubmitButtonDisabled() {
    this.submitButton.should("be.disabled");
  }

  // Validation Checks
  verifyUsernameErrorText(text) {
    this.usernameError.should("be.visible").and("contain", text);
  }

  verifyPasswordErrorText(text) {
    this.passwordError.should("be.visible").and("contain", text);
  }

  verifyApiErrorText(text) {
    this.apiError.should("be.visible").and("contain", text);
  }

  verifyApiErrorNotExist() {
    this.apiError.should("not.exist");
  }

  // --- Redirect Logic ---

  // Kiểm tra đã qua trang Products
  verifyProductPageVisible() {
    // Timeout 10s để chờ Mock load xong
    cy.url({ timeout: 10000 }).should("include", "/products");
  }

  // Kiểm tra vẫn ở lại trang Login
  verifyStayOnLoginPage() {
    cy.url().should("not.include", "/products");
  }

  verifyLocalStorageHasToken() {
    cy.window().then((window) => {
      expect(window.localStorage.getItem("token")).to.exist;
    });
  }
}

export default LoginPage;
