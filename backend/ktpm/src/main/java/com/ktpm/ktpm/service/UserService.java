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

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByUserName(request.getUsername())) {
            throw new AppException(ErrorType.BAD_REQUEST);
        }

        UserEntity userEntity = userMapper.toUserEntity(request);
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponse(userRepository.save(userEntity));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public UserResponse getUserById(String id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new AppException(ErrorType.NOT_FOUND);
        }
        userRepository.deleteById(id);
    }

    public UserResponse updateUser(String id, UserCreationRequest request) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        user.setUserName(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponse(userRepository.save(user));
    }
}
