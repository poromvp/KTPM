package com.ktpm.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.backend.entity.Product;
import com.ktpm.backend.entity.enums.Category;
import com.ktpm.backend.exception.ProductNotFoundException;
import com.ktpm.backend.service.ProductService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static jdk.jfr.internal.jfc.model.Constraint.any;
import static org.springframework.http.ResponseEntity.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/test.properties")
@Slf4j
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private UUID productId;
    private Product sampleProduct;
    private Product updateData;
    private Page<Product> samplePage;

    @BeforeEach
    void init() {
        productId = UUID.randomUUID();

        sampleProduct = Product.builder()
                .id(productId)
                .productName("Old Name")
                .price(50)
                .quantity(5)
                .description("Old Desc")
                .category(Category.SMARTPHONE)
                .build();

        updateData = Product.builder()
                .id(productId)
                .productName("New Name")
                .price(100)
                .quantity(10)
                .description("New Desc")
                .category(Category.LAPTOPS)
                .build();

        samplePage = new PageImpl<>(List.of(sampleProduct));
    }

    /* ---------------- GET /api/products ---------------- */
    @Test
    void testGetAllProducts() throws Exception {
        when(productService.getAll(any(Pageable.class))).thenReturn(samplePage);

        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/products")
                                .param("page", "0")
                                .param("limit", "10")
                                .param("sortBy", "id")
                                .param("sortDir", "asc")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(1000))
                .andExpect(jsonPath("$.data.content[0].id").value(productId.toString()))
                .andExpect(jsonPath("$.data.content[0].productName").value("Old Name"));
    }

    /* ---------------- GET /api/products/{id} ---------------- */
    @Test
    void testGetProduct_Success() throws Exception {
        when(productService.getProduct(productId)).thenReturn(Optional.of(sampleProduct));

        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/products/{id}", productId)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(1000))
                .andExpect(jsonPath("$.data.id").value(productId.toString()))
                .andExpect(jsonPath("$.data.productName").value("Old Name"));
    }

    @Test
    void testGetProduct_NotFound() throws Exception {
        when(productService.getProduct(productId))
                .thenThrow(new ProductNotFoundException("Not found"));

        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/products/{id}", productId)
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    /* ---------------- POST /api/products ---------------- */
    @Test
    void testCreateProduct_Success() throws Exception {
        String json = objectMapper.writeValueAsString(sampleProduct);

        when(productService.createProduct(any(Product.class))).thenReturn(sampleProduct);

        mockMvc.perform(
                        MockMvcRequestBuilders.post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(1000))
                .andExpect(jsonPath("$.data.id").value(productId.toString()))
                .andExpect(jsonPath("$.data.productName").value("Old Name"));
    }

    /* ---------------- PUT /api/products/{id} ---------------- */
    @Test
    void testUpdateProduct_Success() throws Exception {
        String json = objectMapper.writeValueAsString(updateData);

        when(productService.updateProduct(any(UUID.class), any(Product.class)))
                .thenReturn(updateData);

        mockMvc.perform(
                        MockMvcRequestBuilders.put("/api/products/{id}", productId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(1000))
                .andExpect(jsonPath("$.data.productName").value("New Name"))
                .andExpect(jsonPath("$.data.price").value(100.0));
    }

    @Test
    void testUpdateProduct_NotFound() throws Exception {
        String json = objectMapper.writeValueAsString(updateData);

        when(productService.updateProduct(any(UUID.class), any(Product.class)))
                .thenThrow(new ProductNotFoundException("Not found"));

        mockMvc.perform(
                        MockMvcRequestBuilders.put("/api/products/{id}", productId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    /* ---------------- DELETE /api/products/{id} ---------------- */
    @Test
    void testDeleteProduct_Success() throws Exception {
        Mockito.doNothing().when(productService).deleteProduct(productId);

        mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/products/{id}", productId)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(1000));
    }

    @Test
    void testDeleteProduct_NotFound() throws Exception {
        Mockito.doThrow(new ProductNotFoundException("Not found"))
                .when(productService).deleteProduct(productId);

        mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/products/{id}", productId)
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
