package com.ktpm.ktpm.dto.request;

import com.ktpm.ktpm.constant.Category;
import com.ktpm.ktpm.validation.CategoryConstraint;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3 đến 100 ký tự")
    String productName;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(min = 0, max = 500, message = "Mô tả không quá 500 ký tự")
    String description;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.00", inclusive = false, message = "Giá phải lớn hơn 0")
    @DecimalMax(value = "999999999", inclusive = true, message = "Giá không được vượt quá 999,999,999")
    BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    @Max(value = 99999, message = "Số lượng không vượt quá 99,999")
    int amount;

    @NotNull(message = "Danh mục không được để trống")
    @CategoryConstraint
    String category;
}
