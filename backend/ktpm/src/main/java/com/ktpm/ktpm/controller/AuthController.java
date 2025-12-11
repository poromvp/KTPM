package com.ktpm.ktpm.controller;

import com.ktpm.ktpm.dto.request.AuthRequest;
import com.ktpm.ktpm.dto.request.IntrospectRequest;
import com.ktpm.ktpm.dto.request.LogoutRequest;
import com.ktpm.ktpm.dto.response.ApiResponse;
import com.ktpm.ktpm.dto.response.AuthResponse;
import com.ktpm.ktpm.dto.response.IntrospectResponse;
import com.ktpm.ktpm.service.AuthService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);

        return new ApiResponse<AuthResponse>(response, "login successfully");
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(@Valid @RequestBody LogoutRequest request) throws JOSEException, ParseException {
        authService.logout(request);
        return new ApiResponse<>(null, "Logout successfully");
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@Valid @RequestBody IntrospectRequest request) throws JOSEException, ParseException {
        IntrospectResponse response = authService.introspect(request);
        return new ApiResponse<IntrospectResponse>(response, "Introspect successfully");
    }
}
