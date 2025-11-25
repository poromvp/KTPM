package com.ktpm.ktpm.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {

    String id;             // UUID sản phẩm
    String productName;           // Tên sản phẩm
    String description;    // Mô tả sản phẩm
    BigDecimal price;      // Giá sản phẩm
    Integer amount;      // Số lượng
    LocalDateTime createdAt; // Thời điểm tạo sản phẩm
}
