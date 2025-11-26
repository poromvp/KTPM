describe("Register Page Tests", () => {
  beforeEach(() => {
    cy.visit("/register");
    cy.clearLocalStorage();
  });

  describe("UI Elements Display", () => {
    it("should display all register form elements correctly", () => {
      cy.get("h2").should("contain", "Đăng Ký");
      cy.get('[data-testid="username-input"]').should("be.visible");
      cy.get('[data-testid="email-input"]').should("be.visible");
      cy.get('[data-testid="password-input"]').should("be.visible");
      cy.get('[data-testid="confirmPassword-input"]').should("be.visible");
      cy.get('[data-testid="submit-button"]')
        .should("be.visible")
        .and("contain", "Đăng Ký");
      cy.contains("Đã có tài khoản?").should("be.visible");
      cy.contains("Đăng nhập").should("be.visible");
    });

    it("should have correct input placeholders", () => {
      cy.get('[data-testid="username-input"]').should(
        "have.attr",
        "placeholder",
        "Nhập tên người dùng"
      );
      cy.get('[data-testid="email-input"]').should(
        "have.attr",
        "placeholder",
        "Nhập email của bạn"
      );
      cy.get('[data-testid="password-input"]').should(
        "have.attr",
        "placeholder",
        "Nhập mật khẩu"
      );
      cy.get('[data-testid="confirmPassword-input"]').should(
        "have.attr",
        "placeholder",
        "Nhập lại mật khẩu"
      );
    });

    it("should navigate to login page when clicking login link", () => {
      cy.contains("Đăng nhập").click();
      cy.url().should("not.include", "/register");
      cy.get("h2").should("contain", "Đăng Nhập");
    });
  });

  describe("Username Validation", () => {
    it("should show error when username is empty", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="username-error"]')
        .should("be.visible")
        .and("contain", "Không được để trống username");
    });

    it("should show error when username is too short", () => {
      cy.get('[data-testid="username-input"]').type("ab");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="username-error"]')
        .should("be.visible")
        .and("contain", "Username phải có ít nhất 3 ký tự");
    });

    it("should show error when username is too long", () => {
      cy.get('[data-testid="username-input"]').type("a".repeat(51));
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="username-error"]')
        .should("be.visible")
        .and("contain", "Username không được vượt quá 50 ký tự");
    });

    it("should show error when username contains special characters", () => {
      cy.get('[data-testid="username-input"]').type("test@user");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="username-error"]')
        .should("be.visible")
        .and("contain", "Username không được chứa ký tự đặc biệt");
    });

    it("should accept valid username with letters, numbers and underscore", () => {
      cy.get('[data-testid="username-input"]').type("test_user123");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="username-error"]').should("not.exist");
    });
  });

  describe("Email Validation", () => {
    it("should show error when email is empty", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="email-error"]')
        .should("be.visible")
        .and("contain", "Email là bắt buộc");
    });

    it("should show error when email format is invalid", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("invalid-email");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="email-error"]')
        .should("be.visible")
        .and("contain", "Email không hợp lệ");
    });
  });

  describe("Password Validation", () => {
    it("should show error when password is empty", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu không được để trống");
    });

    it("should show error when password is too short", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("abc12");
      cy.get('[data-testid="confirmPassword-input"]').type("abc12");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu phải có ít nhất 6 ký tự");
    });

    it("should show error when password is too long", () => {
      const longPassword = "a".repeat(21) + "1";
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type(longPassword);
      cy.get('[data-testid="confirmPassword-input"]').type(longPassword);
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu không được vượt quá 20 ký tự");
    });

    it("should show error when password has no letters", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("123456");
      cy.get('[data-testid="confirmPassword-input"]').type("123456");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu phải chứa cả chữ cái và số");
    });

    it("should show error when password has no numbers", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("abcdef");
      cy.get('[data-testid="confirmPassword-input"]').type("abcdef");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu phải chứa cả chữ cái và số");
    });
  });

  describe("Confirm Password Validation", () => {
    it("should show error when confirm password is empty", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="confirmPassword-error"]')
        .should("be.visible")
        .and("contain", "Vui lòng xác nhận mật khẩu");
    });

    it("should show error when passwords do not match", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test456");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="confirmPassword-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu xác nhận không khớp");
    });
  });

  describe("Successful Registration", () => {
    it("should register successfully with valid data", () => {
      const timestamp = Date.now();
      const username = `newuser${timestamp}`;
      const email = `newuser${timestamp}@example.com`;

      cy.get('[data-testid="username-input"]').type(username);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      // Kiểm tra button loading state
      cy.get('[data-testid="submit-button"]')
        .should("be.disabled")
        .and("contain", "Đang đăng ký...");

      // Kiểm tra alert thành công (có thể cần stub window.alert)
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Đăng ký thành công");
      });

      // Kiểm tra chuyển hướng về trang login
      cy.url().should("not.include", "/register");
      cy.get("h2").should("contain", "Đăng Nhập");
    });
  });

  describe("Failed Registration", () => {
    it("should show error when email already exists", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="api-error"]')
        .should("be.visible")
        .and("contain", "Email đã được sử dụng");

      // Đảm bảo vẫn ở trang register
      cy.url().should("include", "/register");
    });

    it("should clear API error when user types", () => {
      cy.get('[data-testid="username-input"]').type("testuser");
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="api-error"]').should("be.visible");

      cy.get('[data-testid="username-input"]').clear().type("newuser");
      cy.get('[data-testid="api-error"]').should("not.exist");
    });
  });

  describe("Form Interaction", () => {
    it("should clear field errors when user starts typing", () => {
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="username-error"]').should("be.visible");
      cy.get('[data-testid="username-input"]').type("t");
      cy.get('[data-testid="username-error"]').should("not.exist");

      cy.get('[data-testid="email-error"]').should("be.visible");
      cy.get('[data-testid="email-input"]').type("t");
      cy.get('[data-testid="email-error"]').should("not.exist");
    });

    it("should apply error class to inputs with validation errors", () => {
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="username-input"]').should("have.class", "error");
      cy.get('[data-testid="email-input"]').should("have.class", "error");
      cy.get('[data-testid="password-input"]').should("have.class", "error");
      cy.get('[data-testid="confirmPassword-input"]').should(
        "have.class",
        "error"
      );
    });

    it("should enable/disable submit button based on loading state", () => {
      cy.get('[data-testid="submit-button"]').should("not.be.disabled");

      const timestamp = Date.now();
      cy.get('[data-testid="username-input"]').type(`user${timestamp}`);
      cy.get('[data-testid="email-input"]').type(
        `user${timestamp}@example.com`
      );
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="confirmPassword-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="submit-button"]').should("be.disabled");
    });
  });

  describe("Complete Registration Flow", () => {
    it("should complete full registration and login flow", () => {
      const timestamp = Date.now();
      const username = `flowuser${timestamp}`;
      const email = `flowuser${timestamp}@example.com`;
      const password = "test123";

      // Bước 1: Đăng ký
      cy.get('[data-testid="username-input"]').type(username);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="password-input"]').type(password);
      cy.get('[data-testid="confirmPassword-input"]').type(password);
      cy.get('[data-testid="submit-button"]').click();

      // Bước 2: Chuyển về trang login
      cy.url().should("not.include", "/register");
      cy.get("h2").should("contain", "Đăng Nhập");

      // Bước 3: Đăng nhập với tài khoản vừa tạo
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="password-input"]').type(password);
      cy.get('[data-testid="submit-button"]').click();

      // Bước 4: Kiểm tra đã vào trang products
      cy.url().should("include", "/products");
      cy.contains("Sản Phẩm").should("be.visible");
    });
  });
});
