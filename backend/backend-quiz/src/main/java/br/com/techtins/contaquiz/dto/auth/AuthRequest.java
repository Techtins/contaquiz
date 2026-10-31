package br.com.techtins.contaquiz.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequest(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 6, max = 100) String password
) {

}
