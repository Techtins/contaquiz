package br.com.techtins.contaquiz.service;

import br.com.techtins.contaquiz.dto.auth.AuthRequest;
import br.com.techtins.contaquiz.dto.auth.AuthResponse;
import br.com.techtins.contaquiz.dto.auth.RegisterRequest;
import br.com.techtins.contaquiz.exception.BusinessException;
import br.com.techtins.contaquiz.mapper.UserMapper;
import br.com.techtins.contaquiz.model.SystemRole;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.NotAuthorizedException;

@ApplicationScoped
public class AuthService {

    @Inject
    UserService userService;

    @Inject
    HashService hashService;

    @Inject
    JwtService jwtService;

    @Inject
    UserMapper userMapper;

    @Inject
    UserRepository userRepository;

    public User register(RegisterRequest dto) {
        if (userRepository.findByEmail(dto.email()).firstResult() != null) {
            throw new BusinessException("Email já cadastrado");
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPasswordHash(hashService.Argon2(dto.password()));
        user.setSystemRole(SystemRole.ALUNO);
        return userService.create(user);
    }

    public AuthResponse registerWithToken(RegisterRequest dto) {
        User user = register(dto);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, userMapper.toResponse(user));
    }

    public AuthResponse login(AuthRequest dto) {
        try {
            User user = userRepository.findByEmail(dto.email()).firstResult();

            if (user == null || !hashService.verifyArgon2(dto.password(), user.getPasswordHash()))
                throw new NotAuthorizedException("Email ou senha inválidos");

            String token = jwtService.generateToken(user);
            return new AuthResponse(token, userMapper.toResponse(user));
        } catch (NoResultException e) {
            throw new NotAuthorizedException("Email ou senha inválidos");
        }
    }

}
