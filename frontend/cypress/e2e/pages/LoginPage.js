// cypress/e2e/pages/LoginPage.js

class LoginPage {
  // Selectors
  get heading() {
    return cy.get("h2");
  }

  get emailInput() {
    return cy.get('[data-testid="email-input"]');
  }

  get passwordInput() {
    return cy.get('[data-testid="password-input"]');
  }

  get submitButton() {
    return cy.get('[data-testid="submit-button"]');
  }

  get emailError() {
    return cy.get('[data-testid="email-error"]');
  }

  get passwordError() {
    return cy.get('[data-testid="password-error"]');
  }

  get apiError() {
    return cy.get('[data-testid="api-error"]');
  }

  get registerLink() {
    return cy.contains("Đăng ký ngay");
  }

  get noAccountText() {
    return cy.contains("Chưa có tài khoản?");
  }

  // Actions
  visit() {
    cy.visit("/");
    cy.clearLocalStorage();
  }

  fillEmail(email) {
    this.emailInput.clear().type(email);
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
  }

  clickSubmit() {
    this.submitButton.click();
  }

  clickRegisterLink() {
    this.registerLink.click();
  }

  login(email, password) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.clickSubmit();
  }

  // Assertions
  verifyHeadingText(text) {
    this.heading.should("contain", text);
  }

  verifyEmailInputVisible() {
    this.emailInput.should("be.visible");
  }

  verifyPasswordInputVisible() {
    this.passwordInput.should("be.visible");
  }

  verifySubmitButtonVisible() {
    this.submitButton.should("be.visible");
  }

  verifySubmitButtonText(text) {
    this.submitButton.should("contain", text);
  }

  verifyNoAccountTextVisible() {
    this.noAccountText.should("be.visible");
  }

  verifyRegisterLinkVisible() {
    this.registerLink.should("be.visible");
  }

  verifyEmailPlaceholder(placeholder) {
    this.emailInput.should("have.attr", "placeholder", placeholder);
  }

  verifyEmailType(type) {
    this.emailInput.should("have.attr", "type", type);
  }

  verifyPasswordPlaceholder(placeholder) {
    this.passwordInput.should("have.attr", "placeholder", placeholder);
  }

  verifyPasswordType(type) {
    this.passwordInput.should("have.attr", "type", type);
  }

  verifyEmailErrorVisible() {
    this.emailError.should("be.visible");
  }

  verifyEmailErrorText(text) {
    this.emailError.should("contain", text);
  }

  verifyEmailErrorNotExist() {
    this.emailError.should("not.exist");
  }

  verifyPasswordErrorVisible() {
    this.passwordError.should("be.visible");
  }

  verifyPasswordErrorText(text) {
    this.passwordError.should("contain", text);
  }

  verifyPasswordErrorNotExist() {
    this.passwordError.should("not.exist");
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

  verifySubmitButtonDisabled() {
    this.submitButton.should("be.disabled");
  }

  verifySubmitButtonNotDisabled() {
    this.submitButton.should("not.be.disabled");
  }

  verifyEmailInputHasClass(className) {
    this.emailInput.should("have.class", className);
  }

  verifyEmailInputNotHasClass(className) {
    this.emailInput.should("not.have.class", className);
  }

  verifyPasswordInputHasClass(className) {
    this.passwordInput.should("have.class", className);
  }

  verifyPasswordInputNotHasClass(className) {
    this.passwordInput.should("not.have.class", className);
  }

  verifyEmailInputValue(value) {
    this.emailInput.should("have.value", value);
  }

  verifyUrlNotInclude(path) {
    cy.url().should("not.include", path);
  }

  verifyUrlInclude(path) {
    cy.url().should("include", path);
  }

  verifyLocalStorageHasToken() {
    cy.window().then((window) => {
      expect(window.localStorage.getItem("token")).to.exist;
    });
  }

  verifyLocalStorageHasUser() {
    cy.window().then((window) => {
      expect(window.localStorage.getItem("user")).to.exist;
    });
  }

  verifyLocalStorageUserEmail(email) {
    cy.window().then((window) => {
      cy.wrap(window.localStorage.getItem("user")).should("not.be.null");
      const user = JSON.parse(window.localStorage.getItem("user"));
      expect(user).to.have.property("email", email);
    });
  }

  verifyProductPageVisible() {
    cy.contains("Sản Phẩm").should("be.visible");
  }
}

export default LoginPage;
