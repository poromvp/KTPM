// cypress/e2e/pages/RegisterPage.js

class RegisterPage {
  // Selectors
  get heading() {
    return cy.get("h2");
  }

  get usernameInput() {
    return cy.get('[data-testid="username-input"]');
  }

  get emailInput() {
    return cy.get('[data-testid="email-input"]');
  }

  get passwordInput() {
    return cy.get('[data-testid="password-input"]');
  }

  get confirmPasswordInput() {
    return cy.get('[data-testid="confirmPassword-input"]');
  }

  get submitButton() {
    return cy.get('[data-testid="submit-button"]');
  }

  get usernameError() {
    return cy.get('[data-testid="username-error"]');
  }

  get emailError() {
    return cy.get('[data-testid="email-error"]');
  }

  get passwordError() {
    return cy.get('[data-testid="password-error"]');
  }

  get confirmPasswordError() {
    return cy.get('[data-testid="confirmPassword-error"]');
  }

  get apiError() {
    return cy.get('[data-testid="api-error"]');
  }

  get loginLink() {
    return cy.contains("Đăng nhập");
  }

  get hasAccountText() {
    return cy.contains("Đã có tài khoản?");
  }

  // Actions
  visit() {
    cy.visit("/register");
    cy.clearLocalStorage();
  }

  fillUsername(username) {
    this.usernameInput.clear().type(username);
  }

  fillEmail(email) {
    this.emailInput.clear().type(email);
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
  }

  fillConfirmPassword(confirmPassword) {
    this.confirmPasswordInput.clear().type(confirmPassword);
  }

  clickSubmit() {
    this.submitButton.click();
  }

  clickLoginLink() {
    this.loginLink.click();
  }

  register(username, email, password, confirmPassword) {
    this.fillUsername(username);
    this.fillEmail(email);
    this.fillPassword(password);
    this.fillConfirmPassword(confirmPassword);
    this.clickSubmit();
  }

  // Assertions
  verifyHeadingText(text) {
    this.heading.should("contain", text);
  }

  verifyUsernameInputVisible() {
    this.usernameInput.should("be.visible");
  }

  verifyEmailInputVisible() {
    this.emailInput.should("be.visible");
  }

  verifyPasswordInputVisible() {
    this.passwordInput.should("be.visible");
  }

  verifyConfirmPasswordInputVisible() {
    this.confirmPasswordInput.should("be.visible");
  }

  verifySubmitButtonVisible() {
    this.submitButton.should("be.visible");
  }

  verifySubmitButtonText(text) {
    this.submitButton.should("contain", text);
  }

  verifyHasAccountTextVisible() {
    this.hasAccountText.should("be.visible");
  }

  verifyLoginLinkVisible() {
    this.loginLink.should("be.visible");
  }

  verifyUsernamePlaceholder(placeholder) {
    this.usernameInput.should("have.attr", "placeholder", placeholder);
  }

  verifyEmailPlaceholder(placeholder) {
    this.emailInput.should("have.attr", "placeholder", placeholder);
  }

  verifyPasswordPlaceholder(placeholder) {
    this.passwordInput.should("have.attr", "placeholder", placeholder);
  }

  verifyConfirmPasswordPlaceholder(placeholder) {
    this.confirmPasswordInput.should("have.attr", "placeholder", placeholder);
  }

  verifyUsernameErrorVisible() {
    this.usernameError.should("be.visible");
  }

  verifyUsernameErrorText(text) {
    this.usernameError.should("contain", text);
  }

  verifyUsernameErrorNotExist() {
    this.usernameError.should("not.exist");
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

  verifyConfirmPasswordErrorVisible() {
    this.confirmPasswordError.should("be.visible");
  }

  verifyConfirmPasswordErrorText(text) {
    this.confirmPasswordError.should("contain", text);
  }

  verifyConfirmPasswordErrorNotExist() {
    this.confirmPasswordError.should("not.exist");
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

  verifyUsernameInputHasClass(className) {
    this.usernameInput.should("have.class", className);
  }

  verifyEmailInputHasClass(className) {
    this.emailInput.should("have.class", className);
  }

  verifyPasswordInputHasClass(className) {
    this.passwordInput.should("have.class", className);
  }

  verifyConfirmPasswordInputHasClass(className) {
    this.confirmPasswordInput.should("have.class", className);
  }

  verifyUrlNotInclude(path) {
    cy.url().should("not.include", path);
  }

  verifyUrlInclude(path) {
    cy.url().should("include", path);
  }

  verifyProductPageVisible() {
    cy.contains("Sản Phẩm").should("be.visible");
  }

  setupAlertStub(expectedText) {
    cy.on("window:alert", (text) => {
      expect(text).to.contains(expectedText);
    });
  }
}

export default RegisterPage;
