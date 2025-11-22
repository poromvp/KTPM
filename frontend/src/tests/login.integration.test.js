//Câu 3.1: Login - Integration Testing (10 điểm)

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import Login from "../components/Login"
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom"

const MockTest = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
            <Login />
        </BrowserRouter>
    )
}

describe("Test login integration", () => {
    test("Appear error when submit and let input is blank", async () => {
        render(<MockTest />);

        const submitButton = screen.getByTestId("submit-button");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByTestId("email-error")).toBeInTheDocument();
        })
    })

    test("Test login integration success", async () => {
        render(<MockTest />);

        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(emailInput, {
            target: { value: "test@example.com" }
        })
        fireEvent.change(passwordInput, {
            target: { value: "123456" }
        })
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Success")).toBeInTheDocument();
            expect(window.location.href).toContain("/products");
        })
    })
})