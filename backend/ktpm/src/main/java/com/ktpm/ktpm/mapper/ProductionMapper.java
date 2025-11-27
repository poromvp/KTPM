package com.ktpm.ktpm.mapper;

import com.ktpm.ktpm.dto.request.ProductCreationRequest;
import com.ktpm.ktpm.dto.request.ProductUpdateRequest;
import com.ktpm.ktpm.dto.response.ProductResponse;
import com.ktpm.ktpm.entity.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductionMapper {
    ProductEntity toProductEntity(ProductCreationRequest request);

    void updateProduct(@MappingTarget ProductEntity productEntity, ProductUpdateRequest request);

    ProductResponse toResponse(ProductEntity productEntity);
}
