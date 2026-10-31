package br.com.techtins.contaquiz.dto.question;

import br.com.techtins.contaquiz.model.DifficultyLevel;
import br.com.techtins.contaquiz.model.QuestionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record QuestionRequest(
    @NotBlank String statement,
    @NotNull QuestionType type,
    @NotNull DifficultyLevel difficulty,
    @NotNull Long disciplineId,
    List<@NotNull Long> topicIds,
    @NotEmpty @Valid List<QuestionOptionRequest> options,
    String explanation,
    Boolean active
) {
}
