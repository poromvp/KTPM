// cypress/support/e2e.js

// KHÔNG CẦN import cypress-mochawesome-reporter nếu dùng mochawesome trực tiếp
// import 'cypress-mochawesome-reporter/register';

// Clear test data before each test
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Screenshot on failure
afterEach(function () {
  if (this.currentTest && this.currentTest.state === "failed") {
    const testName = this.currentTest.title.replace(/\s+/g, "_");
    cy.screenshot(`FAILED_${testName}`, { capture: "fullPage" });
  }
});

// Handle uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  if (err.message.includes("ResizeObserver")) {
    return false;
  }
  return true;
});
