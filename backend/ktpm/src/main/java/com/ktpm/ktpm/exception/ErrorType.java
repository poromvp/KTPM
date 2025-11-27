package com.ktpm.ktpm.exception;

import lombok.Getter;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorType {

    BAD_REQUEST("Yêu cầu không hợp lệ", 400, HttpStatus.BAD_REQUEST),
    NOT_FOUND("Không tìm thấy", 404, HttpStatus.NOT_FOUND),
    UNAUTHORIZED("Chưa xác thực", 401, HttpStatus.UNAUTHORIZED),
    FORBIDDEN("Không có quyền truy cập", 403, HttpStatus.FORBIDDEN),
    INTERNAL_SERVER_ERROR("Lỗi hệ thống", 500, HttpStatus.INTERNAL_SERVER_ERROR),
    USER_NOT_FOUND("Người dùng không tồn tại", 1001, HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS("Username đã tồn tại", 1002, HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND("Role không tồn tại", 1003, HttpStatus.NOT_FOUND),
    INVALID_PASSWORD("Mật khẩu không hợp lệ", 1004, HttpStatus.BAD_REQUEST);

    private final String message;
    private final int errorCode;
    private final HttpStatus httpStatus;
}
