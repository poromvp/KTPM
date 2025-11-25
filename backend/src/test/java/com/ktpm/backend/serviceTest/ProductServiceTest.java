package com.ktpm.backend.serviceTest;

import com.ktpm.backend.entity.Product;
import com.ktpm.backend.entity.enums.Category;
import com.ktpm.backend.exception.ProductNotFoundException;
import com.ktpm.backend.repository.ProductRepository;
import com.ktpm.backend.service.ProductService;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.*;

import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@TestPropertySource("/test.properties")
class ProductServiceTest {

    /* ---------------------- FAKE DATA ---------------------- */

    private UUID productId;
    private Product sampleProduct;
    private Product updateData;
    private org.springframework.data.domain.Pageable pageable;
    private Page<Product> samplePage;

    /* ---------------------- MOCK & SERVICE ---------------------- */

    @MockitoBean
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    /* ---------------------- INIT DATA ---------------------- */
    @BeforeEach
    void initData() {

        productId = UUID.randomUUID();

        sampleProduct = Product.builder()
                .id(productId)
                .productName("test product")
                .price((int) 50.0)
                .quantity(5)
                .description("Old Desc")
                .category(Category.SMARTPHONE)
                .build();

        updateData = Product.builder()
                .productName("New test product")
                .price((int) 100.0)
                .quantity(10)
                .description("New Desc")
                .category(Category.SMARTPHONE)
                .build();

        pageable = PageRequest.of(0, 0);
        samplePage = new PageImpl<>(List.of(sampleProduct));
    }

    /* ------------------------- TEST getAll() ------------------------- */

    @Test
    void testGetAll() {
        when(productRepository.findAll(pageable)).thenReturn(samplePage);

        Page<Product> result = productService.getAll(pageable);

        assertEquals(1, result.getTotalElements());
        verify(productRepository).findAll(pageable);
    }

    /* ------------------------- TEST getProduct() ------------------------- */

    @Test
    void testGetProduct_Success() {
        when(productRepository.findById(productId)).thenReturn(Optional.of(sampleProduct));

        Optional<Product> result = productService.getProduct(productId);

        assertTrue(result.isPresent());
        assertEquals(productId, result.get().getId());
    }

    @Test
    void testGetProduct_NotFound() {
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class,
                () -> productService.getProduct(productId));
    }

    /* ------------------------- TEST createProduct() ------------------------- */

    @Test
    void testCreateProduct_Success() {
        when(productRepository.save(sampleProduct)).thenReturn(sampleProduct);

        Product result = productService.createProduct(sampleProduct);

        assertNotNull(result);
        verify(productRepository).save(sampleProduct);
    }

    @Test
    void testCreateProduct_Fail() {
        when(productRepository.save(sampleProduct)).thenThrow(new RuntimeException("DB error"));

        assertThrows(RuntimeException.class,
                () -> productService.createProduct(sampleProduct));
    }

    /* ------------------------- TEST updateProduct() ------------------------- */

    @Test
    void testUpdateProduct_Success() {
        when(productRepository.findById(productId)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(sampleProduct)).thenReturn(sampleProduct);

        Product updated = productService.updateProduct(productId, updateData);

        assertEquals("New test product", updated.getProductName());
        verify(productRepository).save(sampleProduct);
    }

    @Test
    void testUpdateProduct_NotFound() {
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class,
                () -> productService.updateProduct(productId, updateData));
    }

    /* ------------------------- TEST deleteProduct() ------------------------- */

    @Test
    void testDeleteProduct_Success() {
        when(productRepository.findById(productId)).thenReturn(Optional.of(sampleProduct));

        productService.deleteProduct(productId);

        verify(productRepository).delete(sampleProduct);
    }

    @Test
    void testDeleteProduct_NotFound() {
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class,
                () -> productService.deleteProduct(productId));
    }
}
