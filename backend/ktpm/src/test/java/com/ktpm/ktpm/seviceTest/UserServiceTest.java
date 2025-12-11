package com.ktpm.ktpm.seviceTest;

import com.ktpm.ktpm.dto.request.UserCreationRequest;
import com.ktpm.ktpm.dto.request.UserUpdateRequest;
import com.ktpm.ktpm.dto.response.UserResponse;
import com.ktpm.ktpm.entity.UserEntity;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.mapper.UserMapper;
import com.ktpm.ktpm.repository.UserRepository;
import com.ktpm.ktpm.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@Slf4j
@SpringBootTest
@TestPropertySource("/test.properties")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ActiveProfiles("test")
class UserServiceTest {

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    UserMapper userMapper;

    @Autowired
    UserService userService;

    UserEntity userEntity;
    UserCreationRequest userCreationRequest;
    UserUpdateRequest userUpdateRequest;
    UserResponse userResponse;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        userEntity = UserEntity.builder()
                .id("U01")
                .userName("testuser")
                .password("encodedPassword")
                .build();

        userCreationRequest = UserCreationRequest.builder()
                .username("testuser")
                .password("Password123!")
                .build();

        userUpdateRequest = UserUpdateRequest.builder()
                .username("testuser")
                .build();

        userResponse = UserResponse.builder()
                .id("U01")
                .username("testuser")
                .build();

        // Mock mapper để tránh trả về null
        Mockito.when(userMapper.toUserEntity(any())).thenReturn(userEntity);
        Mockito.when(userMapper.toUserResponse(any())).thenReturn(userResponse);
    }

    // ---------------- CREATE USER ----------------
    @Test
    @DisplayName("createUser_success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createUser_success() {
        Mockito.when(userRepository.existsByUserName("testuser")).thenReturn(false);
        Mockito.when(userRepository.save(any())).thenReturn(userEntity);

        UserResponse result = userService.createUser(userCreationRequest);

        assertNotNull(result);
        assertEquals("U01", result.getId());
        Mockito.verify(userRepository, Mockito.times(1))
                .save(any(UserEntity.class));

        Mockito.verify(userMapper, Mockito.times(1))
                .toUserResponse(userEntity);
        assertEquals("testuser", result.getUsername());
    }

    @Test
    @DisplayName("createUser_fail_duplicateUsername")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createUser_fail_duplicateUsername() {
        Mockito.when(userRepository.existsByUserName("testuser")).thenReturn(true);

        AppException ex = assertThrows(AppException.class, () -> userService.createUser(userCreationRequest));

        assertEquals(ErrorType.BAD_REQUEST, ex.getErrorType());
        Mockito.verify(userRepository, Mockito.times(1))
                .existsByUserName("testuser");

        Mockito.verify(userRepository, Mockito.never())
                .save(any());

        Mockito.verify(userMapper, Mockito.never())
                .toUserEntity(any());
    }

    // ---------------- GET USER BY ID ----------------
    @Test
    @DisplayName("getUserById_success")
    @WithMockUser(username = "admin", authorities = "ROLE_ADMIN")
    void getUserById_success() {
        Mockito.when(userRepository.findById("U01")).thenReturn(Optional.of(userEntity));

        UserResponse result = userService.getUserById("U01");

        assertNotNull(result);
        assertEquals("U01", result.getId());
        assertEquals("testuser", result.getUsername());
        Mockito.verify(userRepository, Mockito.times(1))
                .findById("U01");

        Mockito.verify(userMapper, Mockito.times(1))
                .toUserResponse(userEntity);
    }

    @Test
    @DisplayName("getUserById_notFound")
    @WithMockUser(username = "admin", authorities = "ROLE_ADMIN")
    void getUserById_notFound() {
        Mockito.when(userRepository.findById("U01")).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> userService.getUserById("U01"));
        assertEquals(ErrorType.NOT_FOUND, ex.getErrorType());
        Mockito.verify(userRepository, Mockito.times(1))
                .findById("U01");

        Mockito.verify(userMapper, Mockito.never())
                .toUserResponse(any());
    }

    // ---------------- GET ALL USERS ----------------
    @Test
    @DisplayName("getAllUsers_success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAllUsers_success() {
        Mockito.when(userRepository.findAll()).thenReturn(List.of(userEntity));

        List<UserResponse> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("U01", result.get(0).getId());
        assertEquals("testuser", result.get(0).getUsername());
        Mockito.verify(userRepository, Mockito.times(1))
                .findAll();

        Mockito.verify(userMapper, Mockito.times(1))
                .toUserResponse(userEntity);
    }

    // ---------------- UPDATE USER ----------------
    @Test
    @DisplayName("updateUser_success")
    void updateUser_success() {
        Mockito.when(userRepository.findById("U01")).thenReturn(Optional.of(userEntity));
        Mockito.when(userRepository.save(any())).thenReturn(userEntity);

        UserResponse result = userService.updateUser("U01", userCreationRequest);

        assertNotNull(result);
        assertEquals("U01", result.getId());
        assertEquals("testuser", result.getUsername());
        Mockito.verify(userRepository, Mockito.times(1))
                .findById("U01");

        Mockito.verify(userRepository, Mockito.times(1))
                .save(any(UserEntity.class));
    }

    @Test
    @DisplayName("updateUser_notFound")
    void updateUser_notFound() {
        Mockito.when(userRepository.findById("U01")).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> userService.updateUser("U01", userCreationRequest));
        assertEquals(ErrorType.NOT_FOUND, ex.getErrorType());
        Mockito.verify(userRepository, Mockito.times(1))
                .findById("U01");

        Mockito.verify(userRepository, Mockito.never())
                .save(any());
    }

    // ---------------- DELETE USER ----------------
    @Test
    @DisplayName("deleteUser_success")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteUser_success() {
        Mockito.when(userRepository.existsById("U01")).thenReturn(true);
        Mockito.doNothing().when(userRepository).deleteById("U01");

        assertDoesNotThrow(() -> userService.deleteUser("U01"));

        Mockito.verify(userRepository, Mockito.times(1)).deleteById("U01");
        Mockito.verify(userRepository, Mockito.times(1))
                .existsById("U01");

        Mockito.verify(userRepository, Mockito.times(1))
                .deleteById("U01");
    }

    @Test
    @DisplayName("deleteUser_notFound")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteUser_notFound() {
        Mockito.when(userRepository.existsById("U01")).thenReturn(false);

        AppException ex = assertThrows(AppException.class, () -> userService.deleteUser("U01"));
        assertEquals(ErrorType.NOT_FOUND, ex.getErrorType());
        Mockito.verify(userRepository, Mockito.times(1))
                .existsById("U01");

        Mockito.verify(userRepository, Mockito.never())
                .deleteById(any());
    }
}
