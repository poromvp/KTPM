//Câu 3.2: Product - Integration Testing

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import ProductForm from "../components/ProductForm"
import { BrowserRouter } from "react-router-dom"
import ProductList from "../components/ProductList"

describe("Test Product Integration", () => {
    test("Add product success", async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
                <ProductForm />
            </BrowserRouter>
        )
        window.alert = jest.fn();
        const addAlert = jest.spyOn(window, 'alert');

        expect(screen.getByText("Tên sản phẩm *")).toBeInTheDocument();

        const nameInput = screen.getByTestId("name-input");
        const descriptionInput = screen.getByTestId("description-input");
        const priceInput = screen.getByTestId("price-input");
        const quantityInput = screen.getByTestId("quantity-input");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(nameInput, {
            target: { value: "ab" }
        })
        fireEvent.change(descriptionInput, {
            target: { value: "ab" }
        })
        fireEvent.change(priceInput, {
            target: { value: 1000 }
        })
        fireEvent.change(quantityInput, {
            target: { value: 1 }
        })
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(addAlert).toHaveBeenCalledTimes(1);
            expect(addAlert).toHaveBeenCalledWith("Thêm sản phẩm thành công!");
            expect(screen.getByText("ab")).toBeInTheDocument();
        })
    })

    test("Update product success", async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
                <ProductList />
            </BrowserRouter>
        )
        screen.debug();
        const updateAlert = jest.spyOn(window, 'alert');
        updateAlert.mockImplementation(jest.fn(() => true));

        await waitFor(async () => {
            expect(screen.getByText("Samsung Galaxy S24")).toBeInTheDocument();

            const editButton = screen.getByTestId("edit-button-3");
            fireEvent.click(editButton);

            expect(screen.getByText("Sửa Sản Phẩm")).toBeInTheDocument();
            const nameInput = screen.getByTestId("name-input");
            const descriptionInput = screen.getByTestId("description-input");
            const priceInput = screen.getByTestId("price-input");
            const quantityInput = screen.getByTestId("quantity-input");
            const submitButton = screen.getByTestId("submit-button");

            fireEvent.change(nameInput, {
                target: { value: "abc" }
            })
            fireEvent.change(descriptionInput, {
                target: { value: "abc" }
            })
            fireEvent.change(priceInput, {
                target: { value: 2000 }
            })
            fireEvent.change(quantityInput, {
                target: { value: 2 }
            })
            fireEvent.click(submitButton);

            expect(screen.getByText("abc")).toBeInTheDocument();
            await waitFor(() => {
                expect(updateAlert).toHaveBeenCalledTimes(1);
                expect(updateAlert).toHaveBeenCalledWith("Cập nhật sản phẩm thành công!");
            })
        })
    })

    test("Delete product succes", async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
                <ProductList />
            </BrowserRouter>
        )
        screen.debug();
        const confirmSyp = jest.spyOn(window, 'confirm');
        const deleteAlert = jest.spyOn(window, 'alert');
        confirmSyp.mockImplementation(jest.fn(() => true));
        deleteAlert.mockImplementation(jest.fn(() => true));

        await waitFor(async () => {
            expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();

            const deleteButton = screen.getByTestId("delete-button-2")
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(confirmSyp).toHaveBeenCalledTimes(1)
                expect(confirmSyp).toHaveBeenCalledWith("Bạn có chắc muốn xóa sản phẩm này?");
                expect(deleteAlert).toHaveBeenCalledTimes(1);
                expect(deleteAlert).toHaveBeenCalledWith("Xóa sản phẩm thành công!");
            })
        })
    })
})