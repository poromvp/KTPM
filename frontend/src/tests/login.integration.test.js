//Câu 3.1: Login - Integration Testing

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import Login from "../components/Login"
import { BrowserRouter } from "react-router-dom"
// import ProductList from "../components/ProductList";
import userEvent from "@testing-library/user-event";
import * as authService from "../services/authService";

// Mock authService
jest.mock("../services/authService");

const MockTest = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
            <Login />
        </BrowserRouter>
    )
}

describe("Test login integration", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });
    test("Appear error when submit and let input is blank", async () => {
        render(<MockTest />);

        const submitButton = screen.getByTestId("submit-button");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByTestId("userName-error")).toBeInTheDocument();
        })
    })

    test("Test login integration success", async () => {
        // Mock successful login
        authService.login = jest.fn().mockResolvedValue({
            data: {
                token: 'test-token-123',
                user: { username: 'test@example.com', name: 'Test User' }
            }
        });

        render(<MockTest />);

        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(emailInput, {
            target: { value: "test@example.com" }
        })
        fireEvent.change(passwordInput, {
            target: { value: "test123" }
        })
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(authService.login).toHaveBeenCalledWith({
            userName: "test@example.com",
            password: "test123"
          });
          expect(localStorage.getItem('token')).toBe('test-token-123');
        }, { timeout: 3000 })
    })
})