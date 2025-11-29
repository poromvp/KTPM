// cypress/e2e/login.cy.js

import LoginPage from "./pages/LoginPage";

describe("Login Page Tests", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  // --- PHẦN 1: KIỂM TRA GIAO DIỆN (UI) ---
  describe("UI Elements Display", () => {
    it("should display all login form elements correctly", () => {
      loginPage.verifyHeadingText("Đăng Nhập");
      loginPage.verifyEmailInputVisible();
      loginPage.verifyPasswordInputVisible();
      loginPage.verifySubmitButtonVisible();
      loginPage.verifySubmitButtonText("Đăng Nhập");
      loginPage.verifyNoAccountTextVisible();
      loginPage.verifyRegisterLinkVisible();
    });

    it("should have correct input placeholders", () => {
      loginPage.verifyEmailPlaceholder("Nhập email của bạn");
      loginPage.verifyEmailType("email");
      loginPage.verifyPasswordPlaceholder("Nhập mật khẩu");
      loginPage.verifyPasswordType("password");
    });

    it("should navigate to register page when clicking register link", () => {
      loginPage.clickRegisterLink();
      loginPage.verifyUrlInclude("/register");
      loginPage.verifyHeadingText("Đăng Ký");
    });
  });

  // --- PHẦN 2: KIỂM TRA VALIDATION (LỖI NHẬP LIỆU) ---
  describe("Email Validation", () => {
    it("should show error when email is empty", () => {
      loginPage.fillPassword("test123");
      loginPage.clickSubmit();
      loginPage.verifyEmailErrorVisible();
      loginPage.verifyEmailErrorText("Email là bắt buộc");
    });

    it("should show error when email format is invalid", () => {
      loginPage.fillEmail("invalid-email");
      loginPage.fillPassword("test123");
      loginPage.clickSubmit();
      loginPage.verifyEmailErrorVisible();
      loginPage.verifyEmailErrorText("Email không hợp lệ");
    });

    it("should show error for email without domain", () => {
      loginPage.fillEmail("test@");
      loginPage.fillPassword("test123");
      loginPage.clickSubmit();
      loginPage.verifyEmailErrorVisible();
    });

    it("should clear email error when user starts typing", () => {
      loginPage.clickSubmit();
      loginPage.verifyEmailErrorVisible();
      loginPage.emailInput.type("t");
      loginPage.verifyEmailErrorNotExist();
    });
  });

  describe("Password Validation", () => {
    it("should show error when password is empty", () => {
      loginPage.fillEmail("test@example.com");
      loginPage.clickSubmit();
      loginPage.verifyPasswordErrorVisible();
      loginPage.verifyPasswordErrorText("Mật khẩu không được để trống");
    });

    it("should show error when password is too short", () => {
      loginPage.fillEmail("test@example.com");
      loginPage.fillPassword("12345");
      loginPage.clickSubmit();
      loginPage.verifyPasswordErrorVisible();
      loginPage.verifyPasswordErrorText("Mật khẩu phải có ít nhất 6 ký tự");
    });

    it("should show error when password is too long", () => {
      loginPage.fillEmail("test@example.com");
      loginPage.fillPassword("a".repeat(21) + "1");
      loginPage.clickSubmit();
      loginPage.verifyPasswordErrorVisible();
      loginPage.verifyPasswordErrorText(
        "Mật khẩu không được vượt quá 20 ký tự"
      );
    });

    it("should show error when password has no letters", () => {
      loginPage.fillEmail("test@example.com");
      loginPage.fillPassword("123456");
      loginPage.clickSubmit();
      loginPage.verifyPasswordErrorVisible();
      loginPage.verifyPasswordErrorText("Mật khẩu phải chứa cả chữ cái và số");
    });

    it("should show error when password has no numbers", () => {
      loginPage.fillEmail("test@example.com");
      loginPage.fillPassword("abcdef");
      loginPage.clickSubmit();
      loginPage.verifyPasswordErrorVisible();
      loginPage.verifyPasswordErrorText("Mật khẩu phải chứa cả chữ cái và số");
    });

    it("should clear password error when user starts typing", () => {
      loginPage.fillEmail("test@example.com");
      loginPage.clickSubmit();
      loginPage.verifyPasswordErrorVisible();
      loginPage.passwordInput.type("t");
      loginPage.verifyPasswordErrorNotExist();
    });
  });

  // --- PHẦN 3: CÁC TRƯỜNG HỢP LỖI LOGIC & TƯƠNG TÁC FORM ---
  describe("Failed Login", () => {
    it("should show error with incorrect credentials", () => {
      loginPage.login("wrong@example.com", "wrong123");

      loginPage.verifyApiErrorVisible();
      loginPage.verifyApiErrorText("Email hoặc mật khẩu không đúng");

      // Đảm bảo vẫn ở trang login
      loginPage.verifyUrlNotInclude("/products");
    });

    it("should clear API error when user types", () => {
      loginPage.login("wrong@example.com", "wrong123");
      loginPage.verifyApiErrorVisible();

      loginPage.fillEmail("new@example.com");
      loginPage.verifyApiErrorNotExist();
    });
  });

  describe("Form Interaction", () => {
    it("should enable/disable submit button based on loading state", () => {
      loginPage.verifySubmitButtonNotDisabled();

      loginPage.login("test@example.com", "test123");
      loginPage.verifySubmitButtonDisabled();
    });

    it("should apply error class to inputs with validation errors", () => {
      loginPage.clickSubmit();

      loginPage.verifyEmailInputHasClass("error");
      loginPage.verifyPasswordInputHasClass("error");
    });

    it("should remove error class when error is cleared", () => {
      loginPage.clickSubmit();
      loginPage.verifyEmailInputHasClass("error");

      loginPage.fillEmail("test@example.com");
      loginPage.verifyEmailInputNotHasClass("error");
    });
  });

  // --- PHẦN 4: ĐĂNG NHẬP THÀNH CÔNG (CHUYỂN XUỐNG CUỐI) ---
  // Phần này chạy cuối cùng để giữ màn hình ở trang Product
  describe("Successful Login", () => {
    it("should save user data to localStorage after successful login", () => {
      // 1. Nhập liệu
      loginPage.fillEmail("test@example.com");
      loginPage.fillPassword("test123");

      // Kiểm tra chắc chắn input đã nhận giá trị
      loginPage.verifyEmailInputValue("test@example.com");

      // 2. Click đăng nhập
      loginPage.clickSubmit();

      // 3. QUAN TRỌNG: Chờ chuyển trang thành công trước
      loginPage.verifyUrlInclude("/products");

      // 4. Kiểm tra LocalStorage
      loginPage.verifyLocalStorageUserEmail("test@example.com");
    });

    it("should login successfully with correct credentials and stay on page", () => {
      loginPage.login("test@example.com", "test123");

      // Kiểm tra button loading state
      loginPage.verifySubmitButtonDisabled();
      loginPage.verifySubmitButtonText("Đang đăng nhập...");

      // Kiểm tra chuyển hướng đến trang products
      loginPage.verifyUrlInclude("/products");

      // Kiểm tra localStorage có token và user
      loginPage.verifyLocalStorageHasToken();
      loginPage.verifyLocalStorageHasUser();

      // Kiểm tra hiển thị trang products
      loginPage.verifyProductPageVisible();
    });
  });
});
