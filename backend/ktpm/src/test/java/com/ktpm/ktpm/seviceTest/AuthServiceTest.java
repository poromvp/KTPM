package com.ktpm.ktpm.seviceTest;

import com.ktpm.ktpm.dto.request.AuthRequest;
import com.ktpm.ktpm.dto.request.LogoutRequest;
import com.ktpm.ktpm.dto.response.AuthResponse;
import com.ktpm.ktpm.entity.RoleEntity;
import com.ktpm.ktpm.entity.UserEntity;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.repository.InvalidatedTokenRepository;
import com.ktpm.ktpm.repository.UserRepository;
import com.ktpm.ktpm.service.AuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@SpringBootTest
@TestPropertySource("/test.properties")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ActiveProfiles("test")
public class AuthServiceTest {

    @Autowired
    AuthService authService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    InvalidatedTokenRepository invalidatedTokenRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    AuthRequest authRequest;
    UserEntity user;

    @BeforeEach
    public void initData() {
        user = UserEntity.builder()
                .userName("username")
                .password(passwordEncoder.encode("RawPassword"))
                .roles(Set.of(
                        RoleEntity.builder()
                                .roleName("USER")
                                .description("test role")
                                .build()
                ))
                .build();

        authRequest = AuthRequest.builder()
                .password("RawPassword")
                .build();
    }

    @Test
    public void authenticate_success() {
        Mockito.when(userRepository.findByUserName(any())).thenReturn(Optional.of(user));

        AuthResponse response = authService.authenticate(authRequest);

        assertTrue(response.isAuthenticated());
        assertNotNull(response.getToken());
    }

    @Test
    public void authenticate_fail_wrongPassword() {
        authRequest.setPassword("WrongPassword");
        Mockito.when(userRepository.findByUserName(any())).thenReturn(Optional.of(user));

        assertThrows(AppException.class, () -> authService.authenticate(authRequest));
    }

}
