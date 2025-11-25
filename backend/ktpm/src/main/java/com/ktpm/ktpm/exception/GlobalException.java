package com.ktpm.ktpm.exception;

import com.ktpm.ktpm.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalException {
    @ExceptionHandler(AppException.class)
    ResponseEntity<ApiResponse> appExceptionHandler(AppException appException) {
        ErrorType errorType = appException.getErrorType();

        ApiResponse apiResponse = new ApiResponse(errorType);

        return ResponseEntity.status(errorType.getHttpStatus()).body(apiResponse);
    }
}
