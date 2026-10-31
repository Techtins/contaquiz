package br.com.techtins.contaquiz.service;

import java.util.Set;

import br.com.techtins.contaquiz.model.User;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class JwtService {

    private static final long EXPIRATES_IN = 3600L;
    
    public String generateToken(User user) {
        return Jwt.issuer("ContaQuiz")
                .upn(user.getEmail())
                .groups(Set.of(user.getSystemRole().name()))
                .expiresIn(EXPIRATES_IN)
                .sign();
    }
}
