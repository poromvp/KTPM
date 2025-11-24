package com.ktpm.ktpm.repository;

import com.ktpm.ktpm.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUserName(String name);
    Optional<UserEntity> findByEmail(String email);
    boolean existsByUserName(String s);
}
