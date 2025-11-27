describe("Login Page Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  describe("UI Elements Display", () => {
    it("should display all login form elements correctly", () => {
      cy.get("h2").should("contain", "Đăng Nhập");
      cy.get('[data-testid="email-input"]').should("be.visible");
      cy.get('[data-testid="password-input"]').should("be.visible");
      cy.get('[data-testid="submit-button"]')
        .should("be.visible")
        .and("contain", "Đăng Nhập");
      cy.contains("Chưa có tài khoản?").should("be.visible");
      cy.contains("Đăng ký ngay").should("be.visible");
    });

    it("should have correct input placeholders", () => {
      cy.get('[data-testid="email-input"]')
        .should("have.attr", "placeholder", "Nhập email của bạn")
        .and("have.attr", "type", "email");
      cy.get('[data-testid="password-input"]')
        .should("have.attr", "placeholder", "Nhập mật khẩu")
        .and("have.attr", "type", "password");
    });

    it("should navigate to register page when clicking register link", () => {
      cy.contains("Đăng ký ngay").click();
      cy.url().should("include", "/register");
      cy.get("h2").should("contain", "Đăng Ký");
    });
  });

  describe("Email Validation", () => {
    it("should show error when email is empty", () => {
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="email-error"]')
        .should("be.visible")
        .and("contain", "Email là bắt buộc");
    });

    it("should show error when email format is invalid", () => {
      cy.get('[data-testid="email-input"]').type("invalid-email");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="email-error"]')
        .should("be.visible")
        .and("contain", "Email không hợp lệ");
    });

    it("should show error for email without domain", () => {
      cy.get('[data-testid="email-input"]').type("test@");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="email-error"]').should("be.visible");
    });

    it("should clear email error when user starts typing", () => {
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="email-error"]').should("be.visible");
      cy.get('[data-testid="email-input"]').type("t");
      cy.get('[data-testid="email-error"]').should("not.exist");
    });
  });

  describe("Password Validation", () => {
    it("should show error when password is empty", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu không được để trống");
    });

    it("should show error when password is too short", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("12345");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu phải có ít nhất 6 ký tự");
    });

    it("should show error when password is too long", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("a".repeat(21) + "1");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu không được vượt quá 20 ký tự");
    });

    it("should show error when password has no letters", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("123456");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu phải chứa cả chữ cái và số");
    });

    it("should show error when password has no numbers", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("abcdef");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="password-error"]')
        .should("be.visible")
        .and("contain", "Mật khẩu phải chứa cả chữ cái và số");
    });

    it("should clear password error when user starts typing", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="password-error"]').should("be.visible");
      cy.get('[data-testid="password-input"]').type("t");
      cy.get('[data-testid="password-error"]').should("not.exist");
    });
  });

  describe("Successful Login", () => {
    it("should login successfully with correct credentials", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      // Kiểm tra button loading state
      cy.get('[data-testid="submit-button"]')
        .should("be.disabled")
        .and("contain", "Đang đăng nhập...");

      // Kiểm tra chuyển hướng đến trang products
      cy.url().should("include", "/products");

      // Kiểm tra localStorage có token và user
      cy.window().then((window) => {
        expect(window.localStorage.getItem("token")).to.exist;
        expect(window.localStorage.getItem("user")).to.exist;
      });

      // Kiểm tra hiển thị trang products
      cy.contains("Sản Phẩm").should("be.visible");
    });

    it("should save user data to localStorage after successful login", () => {
      // 1. Nhập liệu
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");

      // Kiểm tra chắc chắn input đã nhận giá trị (tránh lỗi UI validation đỏ như trong hình)
      cy.get('[data-testid="email-input"]').should(
        "have.value",
        "test@example.com"
      );

      // 2. Click đăng nhập
      cy.get('[data-testid="submit-button"]').click();

      // 3. QUAN TRỌNG: Chờ chuyển trang thành công trước
      // Dòng này đảm bảo việc login đã xong thì mới kiểm tra localStorage
      cy.url().should("include", "/products");

      // 4. Kiểm tra LocalStorage
      cy.window().then((window) => {
        // Chờ một chút để đảm bảo React đã kịp setItem (đôi khi cần thiết)
        cy.wrap(window.localStorage.getItem("user")).should("not.be.null");

        const user = JSON.parse(window.localStorage.getItem("user"));
        expect(user).to.have.property("email", "test@example.com");
        // expect(user).to.have.property("username"); // Chỉ bật nếu chắc chắn backend trả về username
      });
    });
  });

  describe("Failed Login", () => {
    it("should show error with incorrect credentials", () => {
      cy.get('[data-testid="email-input"]').type("wrong@example.com");
      cy.get('[data-testid="password-input"]').type("wrong123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="api-error"]')
        .should("be.visible")
        .and("contain", "Email hoặc mật khẩu không đúng");

      // Đảm bảo vẫn ở trang login
      cy.url().should("not.include", "/products");
    });

    it("should clear API error when user types", () => {
      cy.get('[data-testid="email-input"]').type("wrong@example.com");
      cy.get('[data-testid="password-input"]').type("wrong123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="api-error"]').should("be.visible");

      cy.get('[data-testid="email-input"]').clear().type("new@example.com");
      cy.get('[data-testid="api-error"]').should("not.exist");
    });
  });

  describe("Form Interaction", () => {
    it("should enable/disable submit button based on loading state", () => {
      cy.get('[data-testid="submit-button"]').should("not.be.disabled");

      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="password-input"]').type("test123");
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="submit-button"]').should("be.disabled");
    });

    it("should apply error class to inputs with validation errors", () => {
      cy.get('[data-testid="submit-button"]').click();

      cy.get('[data-testid="email-input"]').should("have.class", "error");
      cy.get('[data-testid="password-input"]').should("have.class", "error");
    });

    it("should remove error class when error is cleared", () => {
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="email-input"]').should("have.class", "error");

      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="email-input"]').should("not.have.class", "error");
    });
  });
});
