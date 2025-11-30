// cypress/e2e/login.cy.js
import LoginPage from "./pages/LoginPage";

describe("Login Page Tests", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  // --- 1. TEST UI INTERACTIONS ---

  describe("UI Interactions", () => {
    it("should interact with UI elements correctly", () => {
      loginPage.verifyPlaceholder(
        loginPage.usernameInput,
        "Nhập username của bạn"
      );

      // Check hiển thị lỗi khi submit form trống
      loginPage.clickSubmit();
      loginPage.verifyInputHasClass(loginPage.usernameInput, "error");

      // Check xóa lỗi khi bắt đầu nhập
      loginPage.fillUsername("admin");
      loginPage.verifyInputNotHasClass(loginPage.usernameInput, "error");
    });
  });

  // --- 2. TEST VALIDATION LOGIC  ---

  describe("Validation Logic", () => {
    // A. Username Validation
    describe("Username Validation", () => {
      it("should show error when Username is empty", () => {
        loginPage.fillPassword("Admin123");
        loginPage.clickSubmit();
        loginPage.verifyUsernameErrorText("Không được để trống username");
      });

      it("should show error when Username is too short (< 3 chars)", () => {
        loginPage.fillUsername("ab");
        loginPage.clickSubmit();
        loginPage.verifyUsernameErrorText("Username phải có ít nhất 3 ký tự");
      });

      it("should show error when Username is too long (> 50 chars)", () => {
        loginPage.fillUsername("a".repeat(51));
        loginPage.clickSubmit();
        loginPage.verifyUsernameErrorText(
          "Username không được vượt quá 50 ký tự"
        );
      });

      it("should show error when Username contains invalid characters", () => {
        loginPage.fillUsername("user@name");
        loginPage.clickSubmit();
        loginPage.verifyUsernameErrorText(
          "Username chỉ được chứa chữ, số và ký tự ._-"
        );
      });
    });

    // B. Password Validation

    describe("Password Validation", () => {
      it("should show error when Password is empty", () => {
        loginPage.fillUsername("admin");
        loginPage.clickSubmit();
        loginPage.verifyPasswordErrorText("Mật khẩu không được để trống");
      });

      it("should show error when Password is too short (< 6 chars)", () => {
        loginPage.fillUsername("admin");
        loginPage.fillPassword("12345");
        loginPage.clickSubmit();
        loginPage.verifyPasswordErrorText("Mật khẩu phải có ít nhất 6 ký tự");
      });

      it("should show error when Password is too long (> 100 chars)", () => {
        loginPage.fillUsername("admin");
        loginPage.fillPassword("a".repeat(101));
        loginPage.clickSubmit();
        loginPage.verifyPasswordErrorText(
          "Mật khẩu không được vượt quá 100 ký tự"
        );
      });

      it("should show error when Password lacks complexity", () => {
        loginPage.fillUsername("admin");
        loginPage.fillPassword("12345678"); // Chỉ có số
        loginPage.clickSubmit();
        loginPage.verifyPasswordErrorText(
          "Mật khẩu phải chứa cả chữ cái và số"
        );
      });
    });
  });

  // --- 3. TEST ERROR FLOWS  ---

  describe("Error Flows", () => {
    it("should show API error and NOT redirect when login fails", () => {
      // Nhập username đúng
      loginPage.fillUsername("admin");
      // Nhập password sai (nhưng đúng format để qua validation)
      loginPage.fillPassword("WrongPass1");

      loginPage.clickSubmit();

      loginPage.verifyApiErrorText("Username hoặc mật khẩu không đúng");
      loginPage.verifyStayOnLoginPage();
    });
  });

  // --- 4. TEST COMPLETE LOGIN FLOW  ---

  describe("Complete Login Flow", () => {
    it("should login successfully and redirect to products page", () => {
      // 1. Nhập Username
      loginPage.fillUsername("admin");

      // 2. Nhập Password (Đã thêm đầy đủ)
      loginPage.fillPassword("Admin123");

      // 3. Click Đăng nhập
      loginPage.clickSubmit();

      // 4. Kiểm tra nút disable (loading)
      loginPage.verifySubmitButtonDisabled();

      // 5. Kiểm tra CHUYỂN TRANG thành công
      loginPage.verifyProductPageVisible();

      // 6. Kiểm tra Token
      loginPage.verifyLocalStorageHasToken();
    });
  });
});
