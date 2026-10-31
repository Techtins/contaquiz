package br.com.techtins.contaquiz.mapper;

import br.com.techtins.contaquiz.dto.user.UserRequest;
import br.com.techtins.contaquiz.dto.user.UserResponse;
import br.com.techtins.contaquiz.model.User;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserMapper {

    public User toEntity(UserRequest dto) {
        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPasswordHash(dto.password());
        user.setSystemRole(dto.role());
        return user;
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getSystemRole(),
            user.getActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
