package br.com.techtins.contaquiz.dto.quiz;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Map;

public record QuizSubmitRequest(
    @NotNull Map<Long, Integer> answers,
    @PositiveOrZero Integer timeSpentInSeconds
) {
}
