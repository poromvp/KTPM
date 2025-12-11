package com.ktpm.ktpm.integrationTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.ktpm.constant.Category;
import com.ktpm.ktpm.dto.request.ProductCreationRequest;
import com.ktpm.ktpm.dto.request.ProductUpdateRequest;
import com.ktpm.ktpm.entity.ProductEntity;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.repository.ProductRepository;
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
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
class ProductIntegrationTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    ProductRepository productRepository;

    @Container
    static final MySQLContainer<?> MYSQL =
            new MySQLContainer<>("mysql:8.0.33");

    // Dynamic datasource config
    @DynamicPropertySource
    static void configureDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
        registry.add("spring.datasource.username", MYSQL::getUsername);
        registry.add("spring.datasource.password", MYSQL::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
    }

    ProductCreationRequest creationRequest;
    ProductUpdateRequest updateRequest;
    String productId;

    @BeforeEach
    void init() {
        productRepository.deleteAll();

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

        ProductEntity productEntity = productRepository.save(
                ProductEntity.builder()
                        .productName("Test Product 2")
                        .description("Test Description")
                        .price(BigDecimal.valueOf(100))
                        .amount(10)
                        .category(Category.iphone)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        productId = productEntity.getId();
    }

    // ---------------- CREATE PRODUCT ----------------
    @Test
    @DisplayName("POST /product - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_success() throws Exception {
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.productName").value("Test Product"))
                .andExpect(jsonPath("$.message").value("Create product successfully"));
    }

    // ---------------- GET PRODUCT BY ID ----------------
    @Test
    @DisplayName("GET /product/{id} - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getProductById_success() throws Exception {
        mockMvc.perform(get("/product/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.productName").value("Test Product 2"))
                .andExpect(jsonPath("$.message").value("Get product successfully"));
    }

    // ---------------- GET ALL PRODUCTS ----------------
    @Test
    @DisplayName("GET /product - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAllProducts_success() throws Exception {
        mockMvc.perform(get("/product"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(productId)) // sửa lại
                .andExpect(jsonPath("$.data[0].productName").value("Test Product 2"))
                .andExpect(jsonPath("$.message").value("Get all products successfully"));
    }

    // ---------------- UPDATE PRODUCT ----------------
    @Test
    @DisplayName("PUT /product/{id} - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_success() throws Exception {
        mockMvc.perform(put("/product/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.productName").value("Updated Product")) // sửa lại
                .andExpect(jsonPath("$.message").value("Update product successfully"));
    }

    // ---------------- DELETE PRODUCT ----------------
    @Test
    @DisplayName("DELETE /product/{id} - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteProduct_success() throws Exception {
        mockMvc.perform(delete("/product/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Delete product successfully"));
    }

//    INVALID VALIDATION

    //    FAIL VALIDATION
    //    CREATE
    @Test
    @DisplayName("POST /product - fail validation: blank productName")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_blankName() throws Exception {
        creationRequest.setProductName("");
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /product - fail validation: productName too short")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_nameTooShort() throws Exception {
        creationRequest.setProductName("ab");
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /product - fail validation: productName too long")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_nameTooLong() throws Exception {
        creationRequest.setProductName("a".repeat(101));
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /product - fail validation: description too long")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_longDescription() throws Exception {
        creationRequest.setDescription("a".repeat(501));
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
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
    }

    @Test
    @DisplayName("POST /product - fail validation: category invalid")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_failValidation_invalidCategory() throws Exception {
        creationRequest.setCategory("invalidCategory");
        mockMvc.perform(post("/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(creationRequest)))
                .andExpect(status().isBadRequest());
    }

    //    UPDATE
    @Test
    @DisplayName("PUT /product/{id} - fail: product not found")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_fail_productNotFound() throws Exception {
        mockMvc.perform(put("/product/FAKE_ID")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value(404));
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: blank productName")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_blankName() throws Exception {
        updateRequest.setProductName("");
        mockMvc.perform(put("/product/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: price <= 0")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_price() throws Exception {
        updateRequest.setPrice(BigDecimal.valueOf(0));
        mockMvc.perform(put("/product/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: productName too short")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_nameTooShort() throws Exception {
        updateRequest.setProductName("a"); // < 2
        mockMvc.perform(put("/product/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: productName too short")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_nameTooLong() throws Exception {
        updateRequest.setProductName("a".repeat(101));
        mockMvc.perform(put("/product/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: negative amount")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_negativeAmount() throws Exception {
        updateRequest.setAmount(-5);
        mockMvc.perform(put("/product/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /product/{id} - fail validation: invalid category")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProduct_failValidation_category() throws Exception {
        updateRequest.setCategory("nonexistent");
        mockMvc.perform(put("/product/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    //    DELETE
    @Test
    @DisplayName("PUT /product/{id} - success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void delelteProduct_fail_product_notFound() throws Exception {
        mockMvc.perform(delete("/product/FAKE"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value(404));
    }

//    GET

    @Test
    @DisplayName("GET /product/{id} - fail: product not found")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getProductById_fail_productNotFound() throws Exception {
        mockMvc.perform(get("/product/FAKE_ID"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value(404));
    }

}
