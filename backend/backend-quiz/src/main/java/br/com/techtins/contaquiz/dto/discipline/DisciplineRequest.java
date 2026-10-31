package br.com.techtins.contaquiz.dto.discipline;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DisciplineRequest(
    @NotBlank @Size(min = 2, max = 100) String name,
    @Size(max = 255) String description,
    Boolean active
) {
}
