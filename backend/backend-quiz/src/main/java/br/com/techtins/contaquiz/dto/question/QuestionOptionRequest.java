package br.com.techtins.contaquiz.dto.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record QuestionOptionRequest(
    @NotBlank @Size(max = 500) String text,
    @NotNull Boolean isCorrect
) {
}
