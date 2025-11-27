package com.ktpm.ktpm.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

    private final ErrorType errorType;

    // Constructor chỉ dùng ErrorType (message lấy từ ErrorType)
    public AppException(ErrorType errorType) {
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}
