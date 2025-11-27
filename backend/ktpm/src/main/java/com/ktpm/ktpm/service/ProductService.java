package com.ktpm.ktpm.service;

import com.ktpm.ktpm.dto.request.ProductCreationRequest;
import com.ktpm.ktpm.dto.request.ProductUpdateRequest;
import com.ktpm.ktpm.dto.response.ProductResponse;
import com.ktpm.ktpm.entity.ProductEntity;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.mapper.ProductionMapper;
import com.ktpm.ktpm.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductionMapper productionMapper;

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ProductResponse createProduct(ProductCreationRequest request) {
        ProductEntity productEntity = productionMapper.toProductEntity(request);
        return productionMapper.toResponse(productRepository.save(productEntity));
    }

    public ProductResponse getProductById(String id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));
        return productionMapper.toResponse(product);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ProductResponse updateProduct(String id, ProductUpdateRequest request) {
        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        productionMapper.updateProduct(productEntity, request);

        return productionMapper.toResponse(productRepository.save(productEntity));
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new AppException(ErrorType.NOT_FOUND);
        }
        productRepository.deleteById(id);
    }
}
