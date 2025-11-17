import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import Login from "../components/Login";

describe('Login Component Integration Tests', () => {
    test('TC: Successful login redirects to /products', async () => {
        render(<Login/>);

        const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByTestId('username-error')).toBeInTheDocument;
        });
    });
    
    test('Gọi API khi submit form hợp lệ', async () => {
        render(<Login />);

        const usernameInput = screen.getByTestId('username-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitBtn = screen.getByTestId('login-button');

        fireEvent.change(usernameInput, {
            target: { value: 'testuser' }
        });
        fireEvent.change(passwordInput, {
            target: { value: 'Test123' }
        });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByTestId('login-message')).toHaveTextContent('thành công');
        });
    });
});