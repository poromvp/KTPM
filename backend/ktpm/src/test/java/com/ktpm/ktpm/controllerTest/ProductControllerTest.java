package com.ktpm.ktpm.controllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.ktpm.constant.Category;
import com.ktpm.ktpm.controller.ProductController;
import com.ktpm.ktpm.dto.request.ProductCreationRequest;
import com.ktpm.ktpm.dto.request.ProductUpdateRequest;
import com.ktpm.ktpm.dto.response.ProductResponse;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.service.ProductService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/test.properties")
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@ActiveProfiles("test")
class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ProductService productService;

    @Autowired
    ObjectMapper objectMapper;

    ProductCreationRequest creationRequest;
    ProductUpdateRequest updateRequest;
    ProductResponse productResponse;

    @BeforeEach
    void init() {
        creationRequest = ProductCreationRequest.builder()
                .productName("Test Product")
                .description("Test Description")
                .price(BigDecimal.valueOf(100))
                .amount(10)
                .category("ipad")
                .build();

        updateRequest = ProductUpdateRequest.builder()
                .productName("Updated Product")
                .description("Updated Description")
                .price(BigDecimal.valueOf(120))
                .amount(15)
                .category("iphone")
                .build();

        productResponse = ProductResponse.builder()
                .id("P01")
                .productName("Test Product")
                .description("Test Description")
                .price(BigDecimal.valueOf(100))
                .amount(10)
                .createdAt(LocalDateTime.now())
                .category(Category.iphone)
                .build();
    }

    // ---------------- CREATE PRODUCT ----------------
    @Test
    @DisplayName("POST /product - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_success() throws Exception {
        Mockito.when(productService.createProduct(any())).thenReturn(productResponse);

        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("P01"))
                .andExpect(jsonPath("$.data.productName").value("Test Product"))
                .andExpect(jsonPath("$.message").value("Create product successfully"));
        verify(productService, times(1)).createProduct(any());
    }

    // ---------------- GET PRODUCT BY ID ----------------
    @Test
    @DisplayName("GET /product/{id} - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getProductById_success() throws Exception {
        Mockito.when(productService.getProductById("P01")).thenReturn(productResponse);

        mockMvc.perform(get("/product/P01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("P01"))
                .andExpect(jsonPath("$.data.productName").value("Test Product"))
                .andExpect(jsonPath("$.message").value("Get product successfully"));
        verify(productService, times(1)).getProductById("P01");
    }

    @Test
    @DisplayName("GET /product/{id} - fail: product not found")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getProductById_fail_productNotFound() throws Exception {
        Mockito.when(productService.getProductById("P99"))
                .thenThrow(new AppException(ErrorType.NOT_FOUND));

        mockMvc.perform(get("/product/P99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value(404));
        verify(productService, times(1)).getProductById("P99");
    }


    // ---------------- GET ALL PRODUCTS ----------------
    @Test
    @DisplayName("GET /product - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAllProducts_success() throws Exception {
        Mockito.when(productService.getAllProducts()).thenReturn(List.of(productResponse));

        mockMvc.perform(get("/product"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value("P01"))
                .andExpect(jsonPath("$.data[0].productName").value("Test Product"))
                .andExpect(jsonPath("$.message").value("Get all products successfully"));
        verify(productService, times(1)).getAllProducts();
    }

    @Test
    @DisplayName("GET /product/paginate - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAllProductsPaginated_success() throws Exception {
        List<ProductResponse> mockList = List.of(productResponse);

        Mockito.when(productService.getAllProductsPaginated(0, 10))
                .thenReturn(mockList);

        mockMvc.perform(get("/product/paginate?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value("P01"))
                .andExpect(jsonPath("$.data[0].productName").value("Test Product"))
                .andExpect(jsonPath("$.message").value("Get all products successfully"));
        verify(productService, times(1)).getAllProductsPaginated(0, 10);
    }

    // ---------------- UPDATE PRODUCT ----------------
    @Test
    @DisplayName("PUT /product/{id} - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_success() throws Exception {
        Mockito.when(productService.updateProduct(any(), any())).thenReturn(productResponse);

        mockMvc.perform(put("/product/P01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("P01"))
                .andExpect(jsonPath("$.data.productName").value("Test Product"))
                .andExpect(jsonPath("$.message").value("Update product successfully"));
        verify(productService, times(1)).updateProduct(any(), any());
    }

    // ---------------- DELETE PRODUCT ----------------
    @Test
    @DisplayName("DELETE /product/{id} - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteProduct_success() throws Exception {
        doNothing().when(productService).deleteProduct("P01");

        mockMvc.perform(delete("/product/P01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Delete product successfully"));
        verify(productService, times(1)).deleteProduct("P01");
    }

    @Test
    @DisplayName("PUT /product/{id} - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void delelteProduct_fail_product_notFound() throws Exception {
        Mockito.doThrow(new AppException(ErrorType.NOT_FOUND))
                .when(productService).deleteProduct("P01");

        mockMvc.perform(delete("/product/P01"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value(404));
        verify(productService, times(1)).deleteProduct("P01");
    }

    //    FAIL VALIDATION
    //    CREATE
    @Test
    @DisplayName("POST /product - fail validation: blank productName")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_blankName() throws Exception {
        creationRequest.setProductName(""); // invalid
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("POST /product - fail validation: productName too short")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_nameTooShort() throws Exception {
        creationRequest.setProductName("ab"); // < 3
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("POST /product - fail validation: productName too long")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_nameTooLong() throws Exception {
        creationRequest.setProductName("a".repeat(101)); // > 100
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("POST /product - fail validation: description too long")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_longDescription() throws Exception {
        creationRequest.setDescription("a".repeat(501)); // > 500 chars
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("POST /product - fail validation: price invalid")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_invalidPrice() throws Exception {
        creationRequest.setPrice(BigDecimal.valueOf(0));
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());

        creationRequest.setPrice(BigDecimal.valueOf(1_000_000_000L));
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("POST /product - fail validation: amount invalid")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_invalidAmount() throws Exception {
        creationRequest.setAmount(-1);
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());

        creationRequest.setAmount(100_000);
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("POST /product - fail validation: category invalid")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_invalidCategory() throws Exception {
        creationRequest.setCategory("invalidCategory"); // not in enum
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    //    UPDATE
    @Test
    @DisplayName("PUT /product/{id} - fail: product not found")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_fail_productNotFound() throws Exception {
        Mockito.when(productService.updateProduct(any(), any()))
                .thenThrow(new AppException(ErrorType.NOT_FOUND));

        mockMvc.perform(put("/product/P99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value(404));
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: blank productName")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_blankName() throws Exception {
        updateRequest.setProductName("");
        mockMvc.perform(put("/product/P01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: price <= 0")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_price() throws Exception {
        updateRequest.setPrice(BigDecimal.valueOf(0));
        mockMvc.perform(put("/product/P01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: productName too short")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_nameTooShort() throws Exception {
        updateRequest.setProductName("a"); // < 2
        mockMvc.perform(put("/product/P01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: productName too short")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_nameTooLong() throws Exception {
        updateRequest.setProductName("a".repeat(101));
        mockMvc.perform(put("/product/P01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: negative amount")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_negativeAmount() throws Exception {
        updateRequest.setAmount(-5);
        mockMvc.perform(put("/product/P01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: invalid category")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_category() throws Exception {
        updateRequest.setCategory("nonexistent");
        mockMvc.perform(put("/product/P01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
        verify(productService, never()).createProduct(any());
    }

    //    GET ALL
    @Test
    @DisplayName("GET /product/paginate - auto correct negative page")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAllProductsPaginated_fixNegativePage() throws Exception {
        List<ProductResponse> mockList = List.of(productResponse);

        Mockito.when(productService.getAllProductsPaginated(0, 10))
                .thenReturn(mockList);

        mockMvc.perform(get("/product/paginate?page=-5&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value("P01"))
                .andExpect(jsonPath("$.message").value("Get all products successfully"));
        verify(productService, never()).createProduct(any());
    }

    @Test
    @DisplayName("GET /product/paginate - auto correct invalid size")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAllProductsPaginated_fixInvalidSize() throws Exception {
        List<ProductResponse> mockList = List.of(productResponse);

        Mockito.when(productService.getAllProductsPaginated(0, 10))
                .thenReturn(mockList);

        mockMvc.perform(get("/product/paginate?page=0&size=0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value("P01"))
                .andExpect(jsonPath("$.message").value("Get all products successfully"));
        verify(productService, never()).createProduct(any());
    }
}
