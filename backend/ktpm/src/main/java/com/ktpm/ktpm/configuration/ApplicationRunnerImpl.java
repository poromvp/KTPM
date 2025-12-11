package com.ktpm.ktpm.configuration;

import com.ktpm.ktpm.entity.RoleEntity;
import com.ktpm.ktpm.entity.UserEntity;
import com.ktpm.ktpm.repository.RoleRepository;
import com.ktpm.ktpm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Profile("!test")
public class ApplicationRunnerImpl implements ApplicationRunner {

    UserRepository userRepository;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Application init...");

        if (!userRepository.existsByUserName("admin")) {
            RoleEntity adminRole = RoleEntity.builder()
                    .roleName("ADMIN")
                    .description("Quản trị hệ thống")
                    .build();

            RoleEntity userRole = roleRepository.save(
                    RoleEntity.builder()
                            .roleName("USER")
                            .description("Người dùng thường")
                            .build());

            Set<RoleEntity> roles = new HashSet<>();
            roles.add(adminRole);

            UserEntity admin = UserEntity.builder()
                    .userName("admin")
                    .password(passwordEncoder.encode("Asdf1234!"))
                    .roles(roles)
                    .build();

            userRepository.save(admin);
            log.info("Admin user created: username=admin, password=Asdf1234!");
        }
        log.info("Application init successfully");
    }
}
