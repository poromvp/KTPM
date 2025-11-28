package com.ktpm.ktpm.controller;

import com.ktpm.ktpm.dto.request.ProductCreationRequest;
import com.ktpm.ktpm.dto.request.ProductUpdateRequest;
import com.ktpm.ktpm.dto.response.ApiResponse;
import com.ktpm.ktpm.dto.response.ProductResponse;
import com.ktpm.ktpm.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

    ProductService productService;

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductCreationRequest request) {
        ProductResponse response = productService.createProduct(request);
        return new ApiResponse<>(response, "Create product successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable String id) {
        ProductResponse response = productService.getProductById(id);
        return new ApiResponse<>(response, "Get product successfully");
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> responseList = productService.getAllProducts();
        return new ApiResponse<>(responseList, "Get all products successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable String id, @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return new ApiResponse<>(response, "Update product successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return new ApiResponse<>(null, "Delete product successfully");
    }
}
