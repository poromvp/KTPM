package com.ktpm.backend.controllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.backend.controller.ProductController;
import com.ktpm.backend.entity.Product;
import com.ktpm.backend.entity.enums.Category;
import com.ktpm.backend.exception.ProductNotFoundException;
import com.ktpm.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@TestPropertySource("/test.properties")
class ProductControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
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

        /* ---------------- GET /products ---------------- */
        @Test
        void testGetAllProducts() throws Exception {
                when(productService.getAll(any(Pageable.class))).thenReturn(samplePage);

                mockMvc.perform(
                                MockMvcRequestBuilders.get("/products")
                                                .param("page", "0")
                                                .param("limit", "10")
                                                .param("sortBy", "id")
                                                .param("sortDir", "asc"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value(1000))
                                .andExpect(jsonPath("$.data.content[0].id").value(productId.toString()))
                                .andExpect(jsonPath("$.data.content[0].productName").value("Old Name"));
        }

        /* ---------------- GET /products/{id} ---------------- */
        @Test
        void testGetProduct_Success() throws Exception {
                when(productService.getProduct(productId)).thenReturn(Optional.of(sampleProduct));

                mockMvc.perform(
                                MockMvcRequestBuilders.get("/products/{id}", productId))
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
                                MockMvcRequestBuilders.get("/products/{id}", productId))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.status").value(404));
        }

        /* ---------------- POST /products ---------------- */
        @Test
        void testCreateProduct_Success() throws Exception {
                String json = objectMapper.writeValueAsString(sampleProduct);

                when(productService.createProduct(any(Product.class))).thenReturn(sampleProduct);

                mockMvc.perform(
                                MockMvcRequestBuilders.post("/products")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(json))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value(1000))
                                .andExpect(jsonPath("$.data.id").value(productId.toString()))
                                .andExpect(jsonPath("$.data.productName").value("Old Name"));
        }

        /* ---------------- PUT /products/{id} ---------------- */
        @Test
        void testUpdateProduct_Success() throws Exception {
                String json = objectMapper.writeValueAsString(updateData);

                when(productService.updateProduct(any(UUID.class), any(Product.class)))
                                .thenReturn(updateData);

                mockMvc.perform(
                                MockMvcRequestBuilders.put("/products/{id}", productId)
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(json))
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
                                MockMvcRequestBuilders.put("/products/{id}", productId)
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(json))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.status").value(404));
        }

        /* ---------------- DELETE /products/{id} ---------------- */
        @Test
        void testDeleteProduct_Success() throws Exception {
                Mockito.doNothing().when(productService).deleteProduct(productId);

                mockMvc.perform(
                                MockMvcRequestBuilders.delete("/products/{id}", productId))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value(1000));
        }

        @Test
        void testDeleteProduct_NotFound() throws Exception {
                Mockito.doThrow(new ProductNotFoundException("Not found"))
                                .when(productService).deleteProduct(productId);

                mockMvc.perform(
                                MockMvcRequestBuilders.delete("/products/{id}", productId))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.status").value(404));
        }
}
