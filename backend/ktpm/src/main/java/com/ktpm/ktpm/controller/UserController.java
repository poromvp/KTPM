package com.ktpm.ktpm.controller;

import com.ktpm.ktpm.dto.request.UserCreationRequest;
import com.ktpm.ktpm.dto.response.ApiResponse;
import com.ktpm.ktpm.dto.response.UserResponse;
import com.ktpm.ktpm.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    // Tạo user mới, chỉ admin mới được tạo
    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody UserCreationRequest request) {
        UserResponse response = userService.createUser(request);
        return new ApiResponse<>(response, "Create user successfully");
    }

    // Lấy tất cả users, chỉ admin
    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return new ApiResponse<>(users, "List of users");
    }

    // Lấy user theo id, admin hoặc chính user
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);
        return new ApiResponse<>(user, "User details");
    }

    // Cập nhật user, admin hoặc chính user
    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable String id, @RequestBody UserCreationRequest request) {
        UserResponse updated = userService.updateUser(id, request);
        return new ApiResponse<>(updated, "User updated successfully");
    }

    // Xóa user, chỉ admin
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return new ApiResponse<>(null, "User deleted successfully");
    }
}
