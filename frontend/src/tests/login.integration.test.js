// Câu 3.1: Login - Frontend integration tests

import { render, screen, fireEvent, waitFor } from "@testing-library/react";  // các utilities từ testing-library
import { BrowserRouter } from "react-router-dom";                             // để cung cấp context routing
import Login from "../components/Login";                                      // component Login cần test
import * as authService from "../services/authService";                       // để mock api calls 

// Mock authService
jest.mock("../services/authService");

// Mock useNavigate
// Mock = tạo phiên bản giả của authService để kiểm soát hành vi trong tests
// auth được thay thế bằng mock để không gọi api thật trong quá trình test
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),  // lấy react-router-dom gốc để giữ lại BrowserRouter và các exports khác
  useNavigate: () => mockNavigate,            // mock useNavigate để theo dõi các lần gọi
}));

describe("Login Component Integration Tests", () => {
  // reset mocks và localStorage trước mỗi test case
  beforeEach(() => {
    jest.clearAllMocks(); // xóa lịch sử gọi của tất cả mocks
    localStorage.clear(); // xóa all data trong localStorage
  });

  // hàm Helper để render Login component trong BrowserRouter
  // Cần BrowserRouter vì Login sử dụng react-router
  const MockLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  // a. Test rendering và user interactions
  describe("Rendering và User Interactions", () => {
    test("TC1: Hiển thị đầy đủ các elements của Login form", () => {
      MockLogin();

      //Kiểm tra các elements hiển thị
      const emailInput = screen.getByPlaceholderText(/email/i);
      expect(emailInput).toBeInTheDocument();
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      expect(passwordInput).toBeInTheDocument();
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });
      expect(submitButton).toBeInTheDocument();
      const registerLink = screen.getByText(/chưa có tài khoản/i);
      expect(registerLink).toBeInTheDocument();
    });

    test("TC2: User có thể nhập vào email input", () => {
      // Arrange
      MockLogin();

      // Act
      const emailInput = screen.getByPlaceholderText(/email/i);
      fireEvent.change(emailInput, {                             // giả lập sự kiện: user nhập email
        target: { value: "test@example.com" } 
      });

      // Assert
      expect(emailInput.value).toBe("test@example.com");
    });

    test("TC3: User có thể nhập vào password input", () => {
      // Arrange
      MockLogin();

      // Act
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);

      fireEvent.change(passwordInput, {
        target: { value: "test123" }
      });

      // Assert
      expect(passwordInput.value).toBe("test123");
    });

    test("TC4: Hiển thị lỗi khi submit form rỗng", async () => {          // tc bất đồng bộ
      // Arrange
      MockLogin();

      // Act
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {          // chờ đợi các assertions bên trong được thỏa
        expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
        expect(screen.getByText(/mật khẩu không được để trống/i)).toBeInTheDocument();
      });
    });

    test("TC5: Xóa lỗi khi user sửa input", async () => {
      MockLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      // Submit form rỗng để có lỗi
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
      });

      // Nhập email hợp lệ
      fireEvent.change(emailInput, { target: { value: "test@example.com" } }); // giả lập user nhập email đúng
      fireEvent.blur(emailInput);                                              // giả lập user rời khỏi input để kích hoạt validation

      // Lỗi email phải biến mất
      await waitFor(() => {
        expect(screen.queryByText(/email là bắt buộc/i)).not.toBeInTheDocument();
        // hoặc 
        // expect(screen.queryByText(/email là bắt buộc/i)).toBeNull();
      });
    });
  });

  
  // b. Test form submission và api calls
  describe("Form Submission và API Calls", () => {
    
    test("TC6: Gọi authService.login() khi submit form hợp lệ", async () => {
      // Mock api response thành công
      authService.login.mockResolvedValue({   // giả lập hàm login trả về thành công với data giả
        token: "mock-token-123",
        user: {
          id: 1,
          username: "testuser",
          email: "test@example.com"
        }
      });

      // Arrange
      MockLogin();

      // Act
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      // Nhập thông tin hợp lệ
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "test123" } });
      fireEvent.click(submitButton);

      // Assert
      // Kiểm tra authService.login được gọi với đúng params
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({     //toBeCalledWith: kiểm tra hàm mock được gọi với các đối số cụ thể
          email: "test@example.com",
          password: "test123"
        });
      });
    });

    test("TC7: Lưu token và user vào localStorage khi login thành công", async () => {
      const mockResponse = {
        token: "mock-token-456",
        user: {
          id: 2,
          username: "john",
          email: "john@example.com"
        }
      };

      authService.login.mockResolvedValue(mockResponse);

      MockLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "john123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Kiểm tra localStorage được cập nhật
        expect(localStorage.getItem("token")).toBe("mock-token-456");
        expect(localStorage.getItem("user")).toBe(JSON.stringify(mockResponse.user)); // so sánh chuỗi JSON
      });
    });

    test("TC8: Redirect đến /products sau khi login thành công", async () => {
      authService.login.mockResolvedValue({
        token: "token",
        user: { id: 1, username: "test", email: "test@example.com" }
      });

      MockLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "test123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/products");
      });
    });

    test("TC9: Không gọi API nếu validation fail", async () => {
      MockLogin();

      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });
      
      // Submit với email không hợp lệ
      const emailInput = screen.getByPlaceholderText(/email/i);
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email không hợp lệ/i)).toBeInTheDocument();
      });

      // API không được gọi vì validation fail
      expect(authService.login).not.toHaveBeenCalled();
    });
  });


  // c. Test error handling và success messages
  describe("Error Handling và Success Messages", () => {    
    test("TC10: Hiển thị error message khi API trả về lỗi", async () => {
      // Mock api response lỗi
      authService.login.mockRejectedValue({    // giả lập hàm login trả về lỗi với message cụ thể
        response: {
          data: {
            message: "Email hoặc mật khẩu không đúng"
          }
        }
      });

      MockLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: "saitaikhoan@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "saitaikhoan123" } }); // Password hợp lệ để qua validation
      fireEvent.click(submitButton);

      // Kiểm tra error message hiển thị
      await waitFor(() => {
        expect(screen.getByText(/email hoặc mật khẩu không đúng/i)).toBeInTheDocument();
      });

      // Không redirect khi có lỗi
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("TC11: Hiển thị error message khi network error", async () => {
      // Mock network error
      authService.login.mockRejectedValue({
        message: "Network Error"
      });

      MockLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "test123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/đăng nhập thất bại/i)).toBeInTheDocument();
      });
    });

    test("TC12: Disable submit button khi đang xử lý request", async () => {
      // Mock api với delay
      authService.login.mockImplementation(() =>          // giả lập hàm login với delay, mockImplementation: định nghĩa hành vi cụ thể cho mock 
        new Promise(resolve => setTimeout(() => resolve({ // Tạo Promise delay 100ms
          token: "token",
          user: { id: 1, username: "test", email: "test@example.com" }
        }), 100))
      );

      MockLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "test123" } });
      fireEvent.click(submitButton);

      // Button phải disabled khi đang submit
      expect(submitButton).toBeDisabled();

      // Đợi api hoàn thành
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/products");
      });
    });
  });
});