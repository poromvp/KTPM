package com.ktpm.ktpm.integrationTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.ktpm.dto.request.AuthRequest;
import com.ktpm.ktpm.dto.request.LogoutRequest;
import com.ktpm.ktpm.repository.UserRepository;
import com.ktpm.ktpm.service.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
class AuthIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.0.33");

    @DynamicPropertySource
    static void configureDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
        registry.add("spring.datasource.username", MYSQL::getUsername);
        registry.add("spring.datasource.password", MYSQL::getPassword);
        registry.add("spring.datasource.driverClassName", () -> "com.mysql.cj.jdbc.Driver");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
        registry.add("spring.jpa.show-sql", () -> "true");
    }

    AuthRequest authRequest;
    LogoutRequest logoutRequest;

    @BeforeEach
    void init() {
        authRequest = AuthRequest.builder()
                .userName("admin")
                .password("Asdf1234!")
                .build();

        logoutRequest = LogoutRequest.builder()
                .token("dummyToken")
                .build();

    }

    //    LOGIN
    @Test
    @DisplayName("POST /auth/login - success")
    void login_success() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("login successfully"))
        ;
    }

    //      VALIDATION CHO LOGIN
    @Test
    @DisplayName("POST /auth/login - fail when username is blank")
    void login_failUsernameBlank() throws Exception {
        authRequest.setUserName("");
        authRequest.setPassword("Password123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    @Test
    @DisplayName("POST /auth/login - fail when username too short")
    void login_failUsernameTooShort() throws Exception {
        authRequest.setUserName("ab");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    @Test
    @DisplayName("POST /auth/login - fail when username has invalid characters")
    void login_failUsernameInvalidChars() throws Exception {
        authRequest.setUserName("user@name"); // contains '@'

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    @Test
    @DisplayName("POST /auth/login - fail when password is blank")
    void login_failPasswordBlank() throws Exception {
        authRequest.setPassword("");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    @Test
    @DisplayName("POST /auth/login - fail when password too short")
    void login_failPasswordTooShort() throws Exception {
        authRequest.setPassword("Short1!"); // <8 chars

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    @Test
    @DisplayName("POST /auth/login - fail when password missing uppercase")
    void login_failPasswordMissingUppercase() throws Exception {
        authRequest.setPassword("password123!"); // no uppercase

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    @Test
    @DisplayName("POST /auth/login - fail when password missing lowercase")
    void login_failPasswordMissingLowercase() throws Exception {
        authRequest.setPassword("PASSWORD123!"); // no lowercase

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    @Test
    @DisplayName("POST /auth/login - fail when password missing number")
    void login_failPasswordMissingNumber() throws Exception {
        authRequest.setPassword("Password!"); // no digit

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    @Test
    @DisplayName("POST /auth/login - fail when password missing special char")
    void login_failPasswordMissingSpecialChar() throws Exception {
        authRequest.setPassword("Password123"); // no special char

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(400));
    }

    //    LOGOUT
    @Test
    @DisplayName("POST /auth/logout - success")
    void logout_success() throws Exception {
        mockMvc.perform(post("/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successfully"));
    }

    @Test
    @DisplayName("POST /auth/logout - fail validation")
    void logout_failValidation() throws Exception {

        logoutRequest.setToken("");

        mockMvc.perform(post("/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isBadRequest());
    }
}
