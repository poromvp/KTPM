package com.ktpm.ktpm.service;

import com.ktpm.ktpm.dto.request.UserCreationRequest;
import com.ktpm.ktpm.dto.response.UserResponse;
import com.ktpm.ktpm.entity.UserEntity;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.mapper.UserMapper;
import com.ktpm.ktpm.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    // Tạo user mới
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByUserName(request.getUsername())) {
            throw new AppException(ErrorType.BAD_REQUEST);
        }

        UserEntity userEntity = userMapper.toUserEntity(request);
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponse(userRepository.save(userEntity));
    }

    // Lấy user theo id
    public UserResponse getUserById(String id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    // Lấy tất cả users
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    // Xóa user theo id
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new AppException(ErrorType.NOT_FOUND);
        }
        userRepository.deleteById(id);
    }

    // Cập nhật thông tin user
    public UserResponse updateUser(String id, UserCreationRequest request) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        user.setUserName(request.getUsername());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }
}
