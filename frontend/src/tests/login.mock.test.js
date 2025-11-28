// Câu 5.1.1: Login - Frontend Mocking
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';
import * as authService from '../services/authService';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock authService
jest.mock('../services/authService');

describe('Login Mock Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  describe('a. Mock authService.loginUser()', () => {
    test('TC_LOGIN_001: Đăng nhập thành công và hợp lệ', async () => {
      const mockResponse = {
        token: 'mock-token-success',
        user: { username: 'admin1234@gmail.com', name: 'Admin User' }
      };

      
      authService.login.mockResolvedValue(mockResponse);
      renderLogin();

      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'admin1234@gmail.com' }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: 'admin123' }
      });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledTimes(1);
        expect(authService.login).toHaveBeenCalledWith({
          email: 'admin1234@gmail.com',
          password: 'admin123'
        });
      });

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('mock-token-success');
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/products');
      });
    });
  });

  describe('b. Test với mocked successful/failed responses', () => {
    test('TC_LOGIN_002: Đăng nhập không thành công với username trống', async () => {
      renderLogin();

      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: '' }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: 'admin123' }
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
      });

      expect(authService.login).not.toHaveBeenCalled();
    });

    test('TC_LOGIN_003: Đăng nhập không thành công với password trống', async () => {
      renderLogin();

      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'admin1234@gmail.com' }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: '' }
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByText(/mật khẩu không được để trống/i)).toBeInTheDocument();
      });

      expect(authService.login).not.toHaveBeenCalled();
    });

    test('TC_LOGIN_004: Đăng nhập không thành công với password sai', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Sai mật khẩu'
          }
        }
      };

      authService.login.mockRejectedValue(mockError);
      renderLogin();

      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'admin1234@gmail.com' }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: 'admin123' }
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByText(/sai mật khẩu/i)).toBeInTheDocument();
      });

      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    test('TC_LOGIN_005: Đăng nhập không thành công với password chỉ chứa số', async () => {
      renderLogin();

      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'admin1234@gmail.com' }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: '123456' }
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByText(/mật khẩu phải chứa cả chữ cái và số/i)).toBeInTheDocument();
      });

      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('c) Verify mock calls', () => {
    test('Verify authService.login() được gọi với đúng params', async () => {
      const mockResponse = {
        token: 'verify-token',
        user: { username: 'testuser@gmail.com', name: 'Test User' }
      };

      authService.login.mockResolvedValue(mockResponse);
      renderLogin();

      const testUsername = 'testuser@gmail.com';
      const testPassword = 'test123';

      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: testUsername }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: testPassword }
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledTimes(1);
        expect(authService.login).toHaveBeenCalledWith({
          email: testUsername,
          password: testPassword
        });
      });
    });

    test('Verify authService.login() KHÔNG được gọi khi validation fail', async () => {
      renderLogin();

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
      });

      expect(authService.login).not.toHaveBeenCalled();
    });

    test('Verify mock được reset giữa các test', async () => {
      expect(authService.login).not.toHaveBeenCalled();
      expect(authService.login.mock.calls.length).toBe(0);
    });
  });
});
