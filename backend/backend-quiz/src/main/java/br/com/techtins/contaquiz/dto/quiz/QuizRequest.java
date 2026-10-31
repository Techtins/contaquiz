package br.com.techtins.contaquiz.dto.quiz;

import br.com.techtins.contaquiz.model.QuizVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record QuizRequest(
    @NotBlank @Size(max = 150) String title,
    @Size(max = 255) String description,
    Long disciplineId,
    List<Long> questionIds,
    Integer timeLimitSeconds,
    Integer score,
    QuizVisibility visibility,
    Boolean active
) {
}
