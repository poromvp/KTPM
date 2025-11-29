Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="submit-button"]').click();
});

// Lệnh đăng ký nhanh
Cypress.Commands.add("register", (username, email, password) => {
  cy.visit("/register");
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="confirmPassword-input"]').type(password);
  cy.get('[data-testid="submit-button"]').click();
});

// Lệnh kiểm tra localStorage
Cypress.Commands.add("checkAuthStorage", () => {
  cy.window().then((window) => {
    expect(window.localStorage.getItem("token")).to.exist;
    expect(window.localStorage.getItem("user")).to.exist;
  });
});

// Lệnh xóa localStorage
Cypress.Commands.add("clearAuth", () => {
  cy.clearLocalStorage();
  cy.window().then((window) => {
    window.localStorage.clear();
  });
});

// Lệnh đợi và kiểm tra navigation
Cypress.Commands.add("waitForNavigation", (url) => {
  cy.url().should("include", url);
});

Cypress.Commands.add("loginByApi", () => {
  cy.window().then((window) => {
    // Fake token và user như thật
    window.localStorage.setItem("token", "fake-jwt-token-123456");
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        email: "test@example.com",
        name: "Tester",
      })
    );
  });
});
