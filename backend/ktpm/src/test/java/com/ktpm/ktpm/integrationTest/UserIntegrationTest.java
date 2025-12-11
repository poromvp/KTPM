package com.ktpm.ktpm.integrationTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.ktpm.dto.request.UserCreationRequest;
import com.ktpm.ktpm.dto.response.UserResponse;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.service.UserService;
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
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@Testcontainers
class UserIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    UserService userService;

    @Autowired
    ObjectMapper objectMapper;

    UserCreationRequest userCreationRequest;
    UserResponse userResponse;

    @Container
    static final MySQLContainer<?> MY_SQL_CONTAINER = new MySQLContainer<>("mysql:8.0.33");

    @DynamicPropertySource
    static void configureDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MY_SQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.user", MY_SQL_CONTAINER::getUsername);
        registry.add("spring.datasource.password", MY_SQL_CONTAINER::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
    }

    @BeforeEach
    void init() {
        userCreationRequest = UserCreationRequest.builder()
                .username("testuser")
                .password("Password123!")
                .build();

        userResponse = UserResponse.builder()
                .id("U01")
                .username("testuser")
                .build();
    }

    // ---------------- CREATE USER ----------------
    @Test
    @DisplayName("POST /user - success")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_success() throws Exception {
        Mockito.when(userService.createUser(any())).thenReturn(userResponse);

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("U01"))
                .andExpect(jsonPath("$.data.username").value("testuser"))
                .andExpect(jsonPath("$.message").value("Create user successfully"));
    }

    // ---------------- VALIDATION FAIL CASES ----------------
    @Test
    @DisplayName("POST /user - fail validation: empty username")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failEmptyUsername() throws Exception {
        userCreationRequest.setUsername("");
        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /user - fail validation: short username")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failShortUsername() throws Exception {
        userCreationRequest.setUsername("ab");
        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
    }


    // ---------------- GET USER BY ID ----------------
    @Test
    @DisplayName("GET /user/{id} - success")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void getUserById_success() throws Exception {
        Mockito.when(userService.getUserById("U01")).thenReturn(userResponse);

        mockMvc.perform(get("/user/U01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("U01"))
                .andExpect(jsonPath("$.data.username").value("testuser"));
    }

    @Test
    @DisplayName("GET /user/{id} - not found")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void getUserById_notFound() throws Exception {
        Mockito.when(userService.getUserById("U01")).thenThrow(new AppException(ErrorType.NOT_FOUND));

        mockMvc.perform(get("/user/U01"))
                .andExpect(status().is4xxClientError());
    }

    // ---------------- GET ALL USERS ----------------
    @Test
    @DisplayName("GET /user - success")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void getAllUsers_success() throws Exception {
        Mockito.when(userService.getAllUsers()).thenReturn(List.of(userResponse));

        mockMvc.perform(get("/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value("U01"))
                .andExpect(jsonPath("$.data[0].username").value("testuser"))
                .andExpect(jsonPath("$.message").value("List of users"));
    }

    // ---------------- UPDATE USER ----------------
    @Test
    @DisplayName("PUT /user/{id} - success")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void updateUser_success() throws Exception {
        Mockito.when(userService.updateUser(any(), any())).thenReturn(userResponse);

        mockMvc.perform(put("/user/U01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("U01"))
                .andExpect(jsonPath("$.data.username").value("testuser"))
                .andExpect(jsonPath("$.message").value("User updated successfully"));
    }

    // ---------------- DELETE USER ----------------
    @Test
    @DisplayName("DELETE /user/{id} - success")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void deleteUser_success() throws Exception {
        doNothing().when(userService).deleteUser("U01");

        mockMvc.perform(delete("/user/U01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully"));
    }
}