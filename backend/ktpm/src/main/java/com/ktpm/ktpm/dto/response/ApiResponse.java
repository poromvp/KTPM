package com.ktpm.ktpm.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ktpm.ktpm.exception.ErrorType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL) // Loại bỏ field null
public class ApiResponse<DataType> {

    boolean success;
    String message;
    DataType data;
    int errorCode;
    int status;
    Instant timestamp;

    // Constructor tiện lợi khi thành công
    public ApiResponse(DataType data, String message) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.status = 1000;
        timestamp = Instant.now();
    }

    // Constructor tiện lợi khi thất bại
    public ApiResponse(ErrorType errorType) {
        this.success = false;
        this.message = errorType.getMessage();
        this.data = null;
        this.errorCode = errorType.getErrorCode();
        timestamp = Instant.now();
        this.data = null;
    }
}
