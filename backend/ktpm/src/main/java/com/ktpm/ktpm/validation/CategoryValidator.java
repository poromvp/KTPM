package com.ktpm.ktpm.validation;

import com.ktpm.ktpm.constant.Category;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class CategoryValidator implements ConstraintValidator<CategoryConstraint, String> {
    private Set<String> validCategories;

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (s == null) {
            return true;
        }
        return validCategories.contains(s);
    }

    @Override
    public void initialize(CategoryConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        validCategories = Arrays.stream(Category.values())
                .map(Enum::name)       // Lấy tên ENUM: "iphone", "ipad"...
                .collect(Collectors.toSet());

    }
}
