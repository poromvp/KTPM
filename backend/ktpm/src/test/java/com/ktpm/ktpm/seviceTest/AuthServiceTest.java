package com.ktpm.ktpm.seviceTest;

import com.ktpm.ktpm.dto.request.*;
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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

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
    IntrospectRequest introspectRequest;

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
                .userName("username")
                .password("RawPassword")
                .build();
    }

//    TRUONG HOP LOGIN THANH CONG
    @Test
    public void authenticate_success() {
        Mockito.when(userRepository.findByUserName(any())).thenReturn(Optional.of(user));

        AuthResponse response = authService.authenticate(authRequest);

        assertTrue(response.isAuthenticated());
        assertNotNull(response.getToken());
        Mockito.verify(userRepository, Mockito.times(1))
                .findByUserName(authRequest.getUserName());
    }

//    TRUONG HOP USER KHONG TON TAI
    @Test
    @DisplayName("authenticate_fail_user_not_found")
    public void authenticate_fail_user_not_found() {
        Mockito.when(userRepository.findByUserName(any())).thenReturn(Optional.empty());

        assertThrows(AppException.class, () -> authService.authenticate(authRequest));
        Mockito.verify(userRepository, Mockito.times(1))
                .findByUserName(authRequest.getUserName());
    }

//    TRUONG HOP SAI MAT KHAU
    @Test
    public void authenticate_fail_wrongPassword() {
        authRequest.setPassword("WrongPassword");
        Mockito.when(userRepository.findByUserName(any())).thenReturn(Optional.of(user));

        assertThrows(AppException.class, () -> authService.authenticate(authRequest));
        Mockito.verify(userRepository, Mockito.times(1))
                .findByUserName(authRequest.getUserName());
    }

//    VALIDATION ERRORS
    @Test
    @DisplayName("introspect_success_validToken")
    public void introspect_success_validToken() throws Exception {
        Mockito.when(userRepository.findByUserName(any())).thenReturn(Optional.of(user));

        AuthResponse response = authService.authenticate(authRequest);
        var result = authService.introspect(new IntrospectRequest(response.getToken()));

        assertTrue(result.isValid());
    }

    @Test
    @DisplayName("logout_success_tokenSaved")
    public void logout_success() throws Exception {
        Mockito.when(userRepository.findByUserName(any())).thenReturn(Optional.of(user));
        AuthResponse response = authService.authenticate(authRequest);

        LogoutRequest req = new LogoutRequest(response.getToken());
        authService.logout(req);

        Mockito.verify(invalidatedTokenRepository, Mockito.times(1)).save(any());
        Mockito.verify(userRepository, Mockito.times(1))
                .findByUserName(authRequest.getUserName());
    }

    @Test
    @DisplayName("verifyToken_fail_tokenWasLoggedOut")
    public void verifyToken_fail_tokenWasLoggedOut() throws Exception {
        Mockito.when(userRepository.findByUserName(any())).thenReturn(Optional.of(user));
        AuthResponse response = authService.authenticate(authRequest);

        Mockito.when(invalidatedTokenRepository.existsById(any())).thenReturn(true);

        var result = authService.introspect(new IntrospectRequest(response.getToken()));
        assertFalse(result.isValid());
        Mockito.verify(invalidatedTokenRepository, Mockito.times(1))
                .existsById(any());
    }
}
