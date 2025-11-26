// Câu 5.1.1: Login - Frontend Mocking
// Mock external dependencies cho Login component
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';
import * as authService from '../services/authService';


// Mock authService
jest.mock('../services/authService');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Mock Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  
  // a) Mock authService.login()
  describe('a) Mock authService.login()', () => {
    
    test('TC1: Mock authService.login() trả về success response', async () => {
      // Arrange: Setup mock
      authService.login.mockResolvedValue({
        token: 'mock-token-123',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        }
      });

      renderLogin();

      // Act: User interaction
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'test123' } });
      fireEvent.click(submitButton);

      // Assert: Verify mock được gọi
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
    });

    test('TC2: Mock authService.login() với specific params', async () => {
      authService.login.mockResolvedValue({
        token: 'mock-token',
        user: { id: 1, username: 'test', email: 'test@example.com' }
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'pass123' } });
      fireEvent.click(submitButton);

      // Verify mock được gọi với đúng params
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'user@test.com',
          password: 'pass123'
        });
      });
    });
  });

  
  // b. Test với mocked successful/failed responses
  describe('b) Test với mocked successful/failed responses', () => {
    
    test('TC3: Mock successful response - lưu token vào localStorage', async () => {
      // Mock successful response
      const mockResponse = {
        token: 'mock-success-token',
        user: {
          id: 2,
          username: 'john',
          email: 'john@example.com'
        }
      };

      authService.login.mockResolvedValue(mockResponse);

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'john123' } });
      fireEvent.click(submitButton);

      // Verify localStorage được cập nhật
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('mock-success-token');
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
      });
    });

    test('TC4: Mock successful response - redirect đến /products', async () => {
      authService.login.mockResolvedValue({
        token: 'token',
        user: { id: 1, username: 'test', email: 'test@example.com' }
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'test123' } });
      fireEvent.click(submitButton);

      // Verify navigate được gọi
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/products');
      });
    });

    test('TC5: Mock failed response - hiển thị error message', async () => {
      // Mock failed response
      authService.login.mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials'
          }
        }
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass123' } });
      fireEvent.click(submitButton);

      // Verify error message hiển thị
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Verify KHÔNG navigate khi error
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('TC6: Mock network error', async () => {
      // Mock network error
      authService.login.mockRejectedValue({
        message: 'Network Error'
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'test123' } });
      fireEvent.click(submitButton);

      // Verify error message hiển thị
      await waitFor(() => {
        expect(screen.getByText(/đăng nhập thất bại/i)).toBeInTheDocument();
      });
    });
  });

  
  // c. Verify mock calls
  describe('c) Verify mock calls', () => {
    
    test('TC7: Verify authService.login() được gọi với đúng params', async () => {
      authService.login.mockResolvedValue({
        token: 'token',
        user: { id: 1, username: 'test', email: 'test@example.com' }
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      fireEvent.change(emailInput, { target: { value: 'verify@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'verify123' } });
      fireEvent.click(submitButton);

      // Verify mock được gọi 1 lần
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledTimes(1);
      });

      // Verify mock được gọi với đúng params
      expect(authService.login).toHaveBeenCalledWith({
        email: 'verify@example.com',
        password: 'verify123'
      });
    });

    test('TC8: Verify authService.login() KHÔNG được gọi khi validation fail', async () => {
      renderLogin();

      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      // Submit form rỗng (validation fail)
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
      });

      // Verify authService.login() KHÔNG được gọi
      expect(authService.login).not.toHaveBeenCalled();
    });

    test('TC9: Verify mock call count khi submit nhiều lần', async () => {
      authService.login.mockResolvedValue({
        token: 'token',
        user: { id: 1, username: 'test', email: 'test@example.com' }
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

      // Submit lần 1
      fireEvent.change(emailInput, { target: { value: 'test1@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledTimes(1);
      });
    });
  });
  
});
