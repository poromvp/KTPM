package com.ktpm.ktpm.seviceTest;

import com.ktpm.ktpm.constant.Category;
import com.ktpm.ktpm.dto.request.ProductCreationRequest;
import com.ktpm.ktpm.dto.request.ProductUpdateRequest;
import com.ktpm.ktpm.dto.response.ProductResponse;
import com.ktpm.ktpm.entity.ProductEntity;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.repository.ProductRepository;
import com.ktpm.ktpm.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@SpringBootTest
@TestPropertySource("/test.properties")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ActiveProfiles("test")
class ProductServiceTest {

    @MockitoBean
    ProductRepository productRepository;

    @Autowired
    ProductService productService;

    ProductEntity productEntity;
    ProductCreationRequest productCreationRequest;
    ProductUpdateRequest productUpdateRequest;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        productEntity = ProductEntity.builder()
                .id("P01")
                .productName("Test Product")
                .description("Test Description")
                .price(new BigDecimal("100"))
                .amount(10)
                .category(Category.ipad)
                .build();

        productCreationRequest = ProductCreationRequest.builder()
                .productName("Test Product")
                .description("Test Description")
                .price(new BigDecimal("100"))
                .amount(10)
                .category("ipad")
                .build();

        productUpdateRequest = ProductUpdateRequest.builder()
                .productName("update Test Product")
                .description("update Test Description")
                .price(new BigDecimal("100"))
                .amount(100)
                .category("iphone")
                .build();
    }

//    CREATE
    @Test
    @DisplayName("createProduct_success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_success() {
        Mockito.when(productRepository.save(any())).thenReturn(productEntity);

        ProductResponse result = productService.createProduct(productCreationRequest);

        assertNotNull(result);
        assertEquals("P01", result.getId());
        Mockito.verify(productRepository, Mockito.times(1))
                .save(any(ProductEntity.class));
    }

//    GET
    @Test
    @DisplayName("getAllProducts_success")
    void getAllProducts_success() {
        Mockito.when(productRepository.findAll()).thenReturn(List.of(productEntity));

        List<ProductResponse> result = productService.getAllProducts();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("P01", result.get(0).getId());
        Mockito.verify(productRepository, Mockito.times(1))
                .findAll();
    }

    @Test
    @DisplayName("getProductById_success")
    void getProductById_success() {
        Mockito.when(productRepository.findById("P01")).thenReturn(Optional.of(productEntity));

        ProductResponse result = productService.getProductById("P01");

        assertNotNull(result);
        assertEquals("P01", result.getId());
        Mockito.verify(productRepository, Mockito.times(1))
                .findById("P01");
    }

    @Test
    @DisplayName("getAllProductsPaginated_success")
    void getAllProductsPaginated_success() {
        Page<ProductEntity> page = new PageImpl<>(List.of(productEntity));
        Mockito.when(productRepository.findAll(any(Pageable.class))).thenReturn(page);

        List<ProductResponse> result = productService.getAllProductsPaginated(0, 10);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("P01", result.get(0).getId());
        assertEquals("Test Product", result.get(0).getProductName());
        Mockito.verify(productRepository, Mockito.times(1))
                .findAll(any(Pageable.class));
    }

    // ---------------- UPDATE PRODUCT ----------------
    @Test
    @DisplayName("updateProduct_success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_success() {
        Mockito.when(productRepository.findById("P01")).thenReturn(Optional.of(productEntity));
        Mockito.when(productRepository.save(any())).thenReturn(productEntity);

        ProductResponse result = productService.updateProduct("P01", productUpdateRequest);

        assertNotNull(result);
        assertEquals("P01", result.getId());
        assertEquals("update Test Product", result.getProductName());
        Mockito.verify(productRepository, Mockito.times(1))
                .findById("P01");

        Mockito.verify(productRepository, Mockito.times(1))
                .save(any(ProductEntity.class));
    }

    // ---------------- DELETE PRODUCT ----------------
    @Test
    @DisplayName("deleteProduct_success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteProduct_success() {
        Mockito.when(productRepository.existsById("P01")).thenReturn(true);
        Mockito.doNothing().when(productRepository).deleteById("P01");

        assertDoesNotThrow(() -> productService.deleteProduct("P01"));

        Mockito.verify(productRepository, Mockito.times(1)).deleteById("P01");
    }

    @Test
    @DisplayName("deleteProduct_fail_productNotFound")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteProduct_fail_productNotFound() {
        Mockito.when(productRepository.existsById("P01")).thenReturn(false);

        AppException exception = assertThrows(
                AppException.class,
                () -> productService.deleteProduct("P01")
        );
        assertEquals(ErrorType.NOT_FOUND, exception.getErrorType());

        Mockito.verify(productRepository, Mockito.times(1)).existsById("P01");
        Mockito.verify(productRepository, Mockito.never()).deleteById(Mockito.anyString());
    }

    @Test
    @DisplayName("getProductById_fail_notFound")
    void getProductById_fail_notFound() {
        Mockito.when(productRepository.findById("P01"))
                .thenReturn(Optional.empty());

        AppException exception = assertThrows(
                AppException.class,
                () -> productService.getProductById("P01")
        );

        assertEquals(ErrorType.NOT_FOUND, exception.getErrorType());
        Mockito.verify(productRepository, Mockito.times(1))
                .findById("P01");
    }

    @Test
    @DisplayName("updateProduct_fail_notFound")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_fail_notFound() {

        Mockito.when(productRepository.findById("P01"))
                .thenReturn(Optional.empty());

        AppException exception = assertThrows(
                AppException.class,
                () -> productService.updateProduct("P01", productUpdateRequest)
        );

        assertEquals(ErrorType.NOT_FOUND, exception.getErrorType());
        Mockito.verify(productRepository, Mockito.times(1))
                .findById("P01");

        Mockito.verify(productRepository, Mockito.never())
                .save(any());
    }
}
