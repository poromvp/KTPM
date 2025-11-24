package com.ktpm.ktpm.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleEntity {
    @Id
    @Column(nullable = false, unique = true, length = 50)
    String roleName;

    @Column(columnDefinition = "TEXT")
    String description;
}
