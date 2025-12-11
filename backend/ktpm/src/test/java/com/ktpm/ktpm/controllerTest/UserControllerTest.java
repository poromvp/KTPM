package com.ktpm.ktpm.controllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.ktpm.controller.UserController;
import com.ktpm.ktpm.dto.request.UserCreationRequest;
import com.ktpm.ktpm.dto.response.UserResponse;
import com.ktpm.ktpm.entity.UserEntity;
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
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/test.properties")
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    UserService userService;

    @Autowired
    ObjectMapper objectMapper;

    UserCreationRequest userCreationRequest;
    UserResponse userResponse;

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
        Mockito.verify(userService, Mockito.times(1))
                .createUser(any(UserCreationRequest.class));
    }

// ---------------- CREATE USER - FAIL VALIDATION ----------------

    @Test
    @DisplayName("POST /user - fail validation: empty username")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failEmptyUsername() throws Exception {
        userCreationRequest.setUsername(""); // invalid username

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(userService, Mockito.never()).createUser(any());
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
        Mockito.verify(userService, Mockito.never()).createUser(any());
    }

    @Test
    @DisplayName("POST /user - fail validation: long username")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failLongUsername() throws Exception {
        userCreationRequest.setUsername("a".repeat(51));

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(userService, Mockito.never()).createUser(any());
    }

    @Test
    @DisplayName("POST /user - fail validation: password missing uppercase")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failPasswordMissingUppercase() throws Exception {
        userCreationRequest.setPassword("password123!");

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(userService, Mockito.never()).createUser(any());
    }

    @Test
    @DisplayName("POST /user - fail validation: password missing lowercase")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failPasswordMissingLowercase() throws Exception {
        userCreationRequest.setPassword("PASSWORD123!");

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(userService, Mockito.never()).createUser(any());
    }

    @Test
    @DisplayName("POST /user - fail validation: password missing number")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failPasswordMissingNumber() throws Exception {
        userCreationRequest.setPassword("Password!");

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(userService, Mockito.never()).createUser(any());
    }

    @Test
    @DisplayName("POST /user - fail validation: password missing special character")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failPasswordMissingSpecialChar() throws Exception {
        userCreationRequest.setPassword("Password123");

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(userService, Mockito.never()).createUser(any());
    }

    @Test
    @DisplayName("POST /user - fail validation: password too short")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void createUser_failPasswordTooShort() throws Exception {
        userCreationRequest.setPassword("Pa1!");

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(userService, Mockito.never()).createUser(any());
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
        Mockito.verify(userService, Mockito.times(1)).getUserById("U01");
    }

    @Test
    @DisplayName("GET /user/{id} - not found")
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void getUserById_notFound() throws Exception {
        Mockito.when(userService.getUserById("U01")).thenThrow(new AppException(ErrorType.NOT_FOUND));

        mockMvc.perform(get("/user/U01"))
                .andExpect(status().is4xxClientError());
        Mockito.verify(userService, Mockito.times(1)).getUserById("U01");
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
        Mockito.verify(userService, Mockito.times(1)).getAllUsers();
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
        Mockito.verify(userService, Mockito.times(1))
                .updateUser(eq("U01"), any(UserCreationRequest.class));
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
        Mockito.verify(userService, Mockito.times(1)).deleteUser("U01");
    }
}
