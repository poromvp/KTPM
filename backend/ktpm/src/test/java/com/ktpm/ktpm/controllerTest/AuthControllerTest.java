package com.ktpm.ktpm.controllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.ktpm.controller.AuthController;
import com.ktpm.ktpm.dto.request.AuthRequest;
import com.ktpm.ktpm.dto.request.IntrospectRequest;
import com.ktpm.ktpm.dto.request.LogoutRequest;
import com.ktpm.ktpm.dto.response.AuthResponse;
import com.ktpm.ktpm.dto.response.IntrospectResponse;
import com.ktpm.ktpm.service.AuthService;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/test.properties")
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthService authService;

    @Autowired
    ObjectMapper objectMapper;

    AuthRequest authRequest;
    AuthResponse authResponse;
    LogoutRequest logoutRequest;

    @BeforeEach
    void init() {
        authRequest = AuthRequest.builder()
                .userName("testuser")
                .password("Password123!")
                .build();

        authResponse = AuthResponse.builder()
                .authenticated(true)
                .token("dummyToken")
                .build();

        logoutRequest = LogoutRequest.builder()
                .token("dummyToken")
                .build();
    }

    //    INTROSPECT
    @Test
    @DisplayName("POST /auth/introspect - success")
    void introspect_success() throws Exception {

        IntrospectRequest introspectRequest = IntrospectRequest.builder()
                .token("dummyToken")
                .build();

        IntrospectResponse introspectResponse = IntrospectResponse.builder()
                .valid(true)
                .build();

        Mockito.when(authService.introspect(any()))
                .thenReturn(introspectResponse);

        mockMvc.perform(post("/auth/introspect")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(introspectRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.valid").value(true))
                .andExpect(jsonPath("$.message").value("Introspect successfully"));
        Mockito.verify(authService, Mockito.times(1))
                .introspect(any());
    }

    // ---------------- LOGIN ----------------
    @Test
    @DisplayName("POST /auth/login - success")
    void login_success() throws Exception {
        Mockito.when(authService.authenticate(any())).thenReturn(authResponse);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.authenticated").value(true))
                .andExpect(jsonPath("$.data.token").value("dummyToken"))
                .andExpect(jsonPath("$.message").value("login successfully"));
        Mockito.verify(authService, Mockito.times(1))
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: username blank")
    void login_fail_validation_usernameBlank() throws Exception {
        authRequest.setUserName("");
        authRequest.setPassword("Password123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: username too short")
    void login_fail_validation_usernameTooShort() throws Exception {
        authRequest.setUserName("ab"); // < 3
        authRequest.setPassword("Password123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: username too long")
    void login_fail_validation_usernameTooLong() throws Exception {
        authRequest.setUserName("a".repeat(51)); // > 50
        authRequest.setPassword("Password123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: username contains special chars")
    void login_fail_validation_usernameInvalidChars() throws Exception {
        authRequest.setUserName("invalid@name"); // sai vì chứa @
        authRequest.setPassword("Password123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: password blank")
    void login_fail_validation_passwordBlank() throws Exception {
        authRequest.setPassword("");
        authRequest.setUserName("testuser");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: password too short")
    void login_fail_validation_passwordTooShort() throws Exception {
        authRequest.setPassword("Ab1!"); // < 8
        authRequest.setUserName("testuser");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: password too long")
    void login_fail_validation_passwordTooLong() throws Exception {
        authRequest.setPassword("A1!" + "a".repeat(200)); // > 100
        authRequest.setUserName("testuser");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: password missing uppercase")
    void login_fail_validation_passwordNoUppercase() throws Exception {
        authRequest.setPassword("password123!");
        authRequest.setUserName("testuser");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: password missing lowercase")
    void login_fail_validation_passwordNoLowercase() throws Exception {
        authRequest.setPassword("PASSWORD123!");
        authRequest.setUserName("testuser");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: password missing number")
    void login_fail_validation_passwordNoNumber() throws Exception {
        authRequest.setPassword("Password!!!");
        authRequest.setUserName("testuser");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    @Test
    @DisplayName("POST /auth/login - fail validation: password missing special char")
    void login_fail_validation_passwordNoSpecialChar() throws Exception {
        authRequest.setPassword("Password123");
        authRequest.setUserName("testuser");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());

        Mockito.verify(authService, Mockito.never())
                .authenticate(any());
    }

    // ---------------- LOGOUT ----------------
    @Test
    @DisplayName("POST /auth/logout - success")
    void logout_success() throws Exception {
        Mockito.doNothing().when(authService).logout(any());

        mockMvc.perform(post("/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successfully"));

        Mockito.verify(authService, Mockito.times(1))
                .logout(any());
    }

    @Test
    @DisplayName("POST /auth/logout - fail validation")
    void logout_failValidation() throws Exception {
        logoutRequest.setToken("");

        mockMvc.perform(post("/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isBadRequest());
        Mockito.verify(authService, Mockito.never())
                .logout(any());
    }
}
