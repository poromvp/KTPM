//Câu 3.2: Product - Integration Testing

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import ProductForm from "../components/ProductForm"
import { BrowserRouter } from "react-router-dom"
import ProductList from "../components/ProductList"
import * as productService from "../services/productService"

// Mock productService
jest.mock("../services/productService");

describe("Test Product Integration", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("Add product success", async () => {
        const mockOnClose = jest.fn();
        const mockOnSuccess = jest.fn();
        
        // Mock createProduct
        productService.createProduct = jest.fn().mockResolvedValue({
            id: 1,
            productName: "Test Product",
            description: "Test Description",
            price: 1000,
            amount: 1,
            category: "iphone"
        });
        
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
                <ProductForm onClose={mockOnClose} onSuccess={mockOnSuccess} />
            </BrowserRouter>
        )
        window.alert = jest.fn();
        const addAlert = jest.spyOn(window, 'alert');

        expect(screen.getByText("Tên sản phẩm *")).toBeInTheDocument();

        const nameInput = screen.getByTestId("name-input");
        const categorySelect = screen.getByTestId("category-select");
        const descriptionInput = screen.getByTestId("description-input");
        const priceInput = screen.getByTestId("price-input");
        const quantityInput = screen.getByTestId("quantity-input");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(nameInput, {
            target: { value: "Test Product" }
        })
        fireEvent.change(categorySelect, {
            target: { value: "iphone" }
        })
        fireEvent.change(descriptionInput, {
            target: { value: "Test Description" }
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
            expect(mockOnSuccess).toHaveBeenCalled();
        })
    })

    test("Update product success", async () => {
        const mockProducts = [
            { id: 1, productName: "iPhone 14 Pro", description: "Latest iPhone", price: 30000000, amount: 10, category: "iphone" },
            { id: 2, productName: "iPhone 15 Pro Max", description: "Newest iPhone", price: 35000000, amount: 5, category: "iphone" },
            { id: 3, productName: "AirPods Pro 2", description: "Active noise cancellation", price: 6000000, amount: 20, category: "airpod" }
        ];

        // Mock getAllProducts - PHẢI setup TRƯỚC khi render
        productService.getAllProducts = jest.fn().mockResolvedValue({ data: mockProducts });
        
        // Mock updateProduct
        productService.updateProduct = jest.fn().mockResolvedValue({
            id: 3,
            productName: "abc",
            description: "abc",
            price: 2000,
            amount: 2,
            category: "airpod"
        });

        const updateAlert = jest.spyOn(window, 'alert');
        updateAlert.mockImplementation(jest.fn(() => true));

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
                <ProductList />
            </BrowserRouter>
        )

        // Wait cho products load
        await waitFor(() => {
            expect(screen.getByText("AirPods Pro 2")).toBeInTheDocument();
        });

        const editButton = screen.getByTestId("edit-button-3");
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByText("Sửa Sản Phẩm")).toBeInTheDocument();
        });

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

        await waitFor(() => {
            expect(updateAlert).toHaveBeenCalledTimes(1);
            expect(updateAlert).toHaveBeenCalledWith("Cập nhật sản phẩm thành công!");
        })
    })

    test("Delete product succes", async () => {
        const mockProducts = [
            { id: 1, productName: "iPhone 14 Pro", description: "Latest iPhone", price: 30000000, amount: 10, category: "iphone" },
            { id: 2, productName: "iPhone 15 Pro Max", description: "Newest iPhone", price: 35000000, amount: 5, category: "iphone" },
            { id: 3, productName: "AirPods Pro 2", description: "Active noise cancellation", price: 6000000, amount: 20, category: "airpod" }
        ];

        // Mock getAllProducts - setup trước khi render
        productService.getAllProducts = jest.fn().mockResolvedValue({ data: mockProducts });
        
        // Mock deleteProduct
        productService.deleteProduct = jest.fn().mockResolvedValue({});

        const confirmSyp = jest.spyOn(window, 'confirm');
        const deleteAlert = jest.spyOn(window, 'alert');
        confirmSyp.mockImplementation(jest.fn(() => true));
        deleteAlert.mockImplementation(jest.fn(() => true));

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
                <ProductList />
            </BrowserRouter>
        )

        // Wait cho products load
        await waitFor(() => {
            expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId("delete-button-2");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(confirmSyp).toHaveBeenCalledTimes(1);
            expect(confirmSyp).toHaveBeenCalledWith("Bạn có chắc muốn xóa sản phẩm này?");
            expect(deleteAlert).toHaveBeenCalledTimes(1);
            expect(deleteAlert).toHaveBeenCalledWith("Xóa sản phẩm thành công!");
        })
    })
})