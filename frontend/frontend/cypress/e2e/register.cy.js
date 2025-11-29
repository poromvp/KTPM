// cypress/e2e/register.cy.js

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

describe("Register Page Tests", () => {
  const registerPage = new RegisterPage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    registerPage.visit();
  });

  describe("UI Elements Display", () => {
    it("should display all register form elements correctly", () => {
      registerPage.verifyHeadingText("Đăng Ký");
      registerPage.verifyUsernameInputVisible();
      registerPage.verifyEmailInputVisible();
      registerPage.verifyPasswordInputVisible();
      registerPage.verifyConfirmPasswordInputVisible();
      registerPage.verifySubmitButtonVisible();
      registerPage.verifySubmitButtonText("Đăng Ký");
      registerPage.verifyHasAccountTextVisible();
      registerPage.verifyLoginLinkVisible();
    });

    it("should have correct input placeholders", () => {
      registerPage.verifyUsernamePlaceholder("Nhập tên người dùng");
      registerPage.verifyEmailPlaceholder("Nhập email của bạn");
      registerPage.verifyPasswordPlaceholder("Nhập mật khẩu");
      registerPage.verifyConfirmPasswordPlaceholder("Nhập lại mật khẩu");
    });

    it("should navigate to login page when clicking login link", () => {
      registerPage.clickLoginLink();
      registerPage.verifyUrlNotInclude("/register");
      registerPage.verifyHeadingText("Đăng Nhập");
    });
  });

  describe("Username Validation", () => {
    it("should show error when username is empty", () => {
      registerPage.fillEmail("test@example.com");
      registerPage.fillPassword("test123");
      registerPage.fillConfirmPassword("test123");
      registerPage.clickSubmit();

      registerPage.verifyUsernameErrorVisible();
      registerPage.verifyUsernameErrorText("Không được để trống username");
    });

    it("should show error when username is too short", () => {
      registerPage.register("ab", "test@example.com", "test123", "test123");

      registerPage.verifyUsernameErrorVisible();
      registerPage.verifyUsernameErrorText("Username phải có ít nhất 3 ký tự");
    });

    it("should show error when username is too long", () => {
      registerPage.register(
        "a".repeat(51),
        "test@example.com",
        "test123",
        "test123"
      );

      registerPage.verifyUsernameErrorVisible();
      registerPage.verifyUsernameErrorText(
        "Username không được vượt quá 50 ký tự"
      );
    });

    it("should show error when username contains special characters", () => {
      registerPage.register(
        "test@user",
        "test@example.com",
        "test123",
        "test123"
      );

      registerPage.verifyUsernameErrorVisible();
      registerPage.verifyUsernameErrorText(
        "Username không được chứa ký tự đặc biệt"
      );
    });

    it("should accept valid username with letters, numbers and underscore", () => {
      registerPage.fillUsername("test_user123");
      registerPage.clickSubmit();
      registerPage.verifyUsernameErrorNotExist();
    });
  });

  describe("Email Validation", () => {
    it("should show error when email is empty", () => {
      registerPage.fillUsername("testuser");
      registerPage.fillPassword("test123");
      registerPage.fillConfirmPassword("test123");
      registerPage.clickSubmit();

      registerPage.verifyEmailErrorVisible();
      registerPage.verifyEmailErrorText("Email là bắt buộc");
    });

    it("should show error when email format is invalid", () => {
      registerPage.register("testuser", "invalid-email", "test123", "test123");

      registerPage.verifyEmailErrorVisible();
      registerPage.verifyEmailErrorText("Email không hợp lệ");
    });
  });

  describe("Password Validation", () => {
    it("should show error when password is empty", () => {
      registerPage.fillUsername("testuser");
      registerPage.fillEmail("test@example.com");
      registerPage.fillConfirmPassword("test123");
      registerPage.clickSubmit();

      registerPage.verifyPasswordErrorVisible();
      registerPage.verifyPasswordErrorText("Mật khẩu không được để trống");
    });

    it("should show error when password is too short", () => {
      registerPage.register("testuser", "test@example.com", "abc12", "abc12");

      registerPage.verifyPasswordErrorVisible();
      registerPage.verifyPasswordErrorText("Mật khẩu phải có ít nhất 6 ký tự");
    });

    it("should show error when password is too long", () => {
      const longPassword = "a".repeat(21) + "1";
      registerPage.register(
        "testuser",
        "test@example.com",
        longPassword,
        longPassword
      );

      registerPage.verifyPasswordErrorVisible();
      registerPage.verifyPasswordErrorText(
        "Mật khẩu không được vượt quá 20 ký tự"
      );
    });

    it("should show error when password has no letters", () => {
      registerPage.register("testuser", "test@example.com", "123456", "123456");

      registerPage.verifyPasswordErrorVisible();
      registerPage.verifyPasswordErrorText(
        "Mật khẩu phải chứa cả chữ cái và số"
      );
    });

    it("should show error when password has no numbers", () => {
      registerPage.register("testuser", "test@example.com", "abcdef", "abcdef");

      registerPage.verifyPasswordErrorVisible();
      registerPage.verifyPasswordErrorText(
        "Mật khẩu phải chứa cả chữ cái và số"
      );
    });
  });

  describe("Confirm Password Validation", () => {
    it("should show error when confirm password is empty", () => {
      registerPage.fillUsername("testuser");
      registerPage.fillEmail("test@example.com");
      registerPage.fillPassword("test123");
      registerPage.clickSubmit();

      registerPage.verifyConfirmPasswordErrorVisible();
      registerPage.verifyConfirmPasswordErrorText("Vui lòng xác nhận mật khẩu");
    });

    it("should show error when passwords do not match", () => {
      registerPage.register(
        "testuser",
        "test@example.com",
        "test123",
        "test456"
      );

      registerPage.verifyConfirmPasswordErrorVisible();
      registerPage.verifyConfirmPasswordErrorText(
        "Mật khẩu xác nhận không khớp"
      );
    });
  });

  describe("Successful Registration", () => {
    it("should register successfully with valid data", () => {
      const timestamp = Date.now();
      const username = `newuser${timestamp}`;
      const email = `newuser${timestamp}@example.com`;

      registerPage.register(username, email, "test123", "test123");

      // Kiểm tra button loading state
      registerPage.verifySubmitButtonDisabled();
      registerPage.verifySubmitButtonText("Đang đăng ký...");

      // Kiểm tra alert thành công
      registerPage.setupAlertStub("Đăng ký thành công");

      // Kiểm tra chuyển hướng về trang login
      registerPage.verifyUrlNotInclude("/register");
      registerPage.verifyHeadingText("Đăng Nhập");
    });
  });

  describe("Failed Registration", () => {
    it("should show error when email already exists", () => {
      registerPage.register(
        "testuser",
        "test@example.com",
        "test123",
        "test123"
      );

      registerPage.verifyApiErrorVisible();
      registerPage.verifyApiErrorText("Email đã được sử dụng");

      // Đảm bảo vẫn ở trang register
      registerPage.verifyUrlInclude("/register");
    });

    it("should clear API error when user types", () => {
      registerPage.register(
        "testuser",
        "test@example.com",
        "test123",
        "test123"
      );

      registerPage.verifyApiErrorVisible();

      registerPage.fillUsername("newuser");
      registerPage.verifyApiErrorNotExist();
    });
  });

  describe("Form Interaction", () => {
    it("should clear field errors when user starts typing", () => {
      registerPage.clickSubmit();

      registerPage.verifyUsernameErrorVisible();
      registerPage.usernameInput.type("t");
      registerPage.verifyUsernameErrorNotExist();

      registerPage.verifyEmailErrorVisible();
      registerPage.emailInput.type("t");
      registerPage.verifyEmailErrorNotExist();
    });

    it("should apply error class to inputs with validation errors", () => {
      registerPage.clickSubmit();

      registerPage.verifyUsernameInputHasClass("error");
      registerPage.verifyEmailInputHasClass("error");
      registerPage.verifyPasswordInputHasClass("error");
      registerPage.verifyConfirmPasswordInputHasClass("error");
    });

    it("should enable/disable submit button based on loading state", () => {
      registerPage.verifySubmitButtonNotDisabled();

      const timestamp = Date.now();
      registerPage.register(
        `user${timestamp}`,
        `user${timestamp}@example.com`,
        "test123",
        "test123"
      );

      registerPage.verifySubmitButtonDisabled();
    });
  });

  describe("Complete Registration Flow", () => {
    it("should complete full registration and login flow", () => {
      const timestamp = Date.now();
      const username = `flowuser${timestamp}`;
      const email = `flowuser${timestamp}@example.com`;
      const password = "test123";

      // Bước 1: Đăng ký
      registerPage.register(username, email, password, password);

      // Bước 2: Chuyển về trang login
      registerPage.verifyUrlNotInclude("/register");
      registerPage.verifyHeadingText("Đăng Nhập");

      // Bước 3: Đăng nhập với tài khoản vừa tạo
      loginPage.login(email, password);

      // Bước 4: Kiểm tra đã vào trang products
      loginPage.verifyUrlInclude("/products");
      loginPage.verifyProductPageVisible();
    });
  });
});
