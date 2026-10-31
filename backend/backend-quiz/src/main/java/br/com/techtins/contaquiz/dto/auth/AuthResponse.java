package br.com.techtins.contaquiz.dto.auth;

import br.com.techtins.contaquiz.dto.user.UserResponse;

public record AuthResponse(
    String token,
    UserResponse user
) {
    
}
