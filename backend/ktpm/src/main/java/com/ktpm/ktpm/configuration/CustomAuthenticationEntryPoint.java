package com.ktpm.ktpm.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ktpm.ktpm.dto.response.ApiResponse;
import com.ktpm.ktpm.exception.ErrorType;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.time.Instant;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        ErrorType errorType = ErrorType.UNAUTHORIZED;

        ApiResponse apiRespond = ApiResponse.builder()
                .message("unauthorized")
                .build();

        response.setStatus(errorType.getErrorCode());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        response.getWriter().write(
                objectMapper.writeValueAsString(
                        apiRespond
                )
        );

        response.flushBuffer();
    }
}
