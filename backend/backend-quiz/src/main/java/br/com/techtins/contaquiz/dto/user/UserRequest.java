package br.com.techtins.contaquiz.dto.user;

import br.com.techtins.contaquiz.model.SystemRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(
    @NotBlank @Size(min = 2, max = 150) String name,
    @NotBlank @Email String email,
    @Size(min = 6, max = 100) String password,
    @NotNull SystemRole role
) {

}
