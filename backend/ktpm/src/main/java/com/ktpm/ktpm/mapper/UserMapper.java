package com.ktpm.ktpm.mapper;

import com.ktpm.ktpm.dto.request.UserCreationRequest;
import com.ktpm.ktpm.dto.request.UserUpdateRequest;
import com.ktpm.ktpm.dto.response.UserResponse;
import com.ktpm.ktpm.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles", ignore = true)
    UserEntity toUserEntity(UserCreationRequest request);

    void updateUser(@MappingTarget UserEntity userEntity, UserUpdateRequest request);

    UserResponse toUserResponse(UserEntity userEntity);
}
