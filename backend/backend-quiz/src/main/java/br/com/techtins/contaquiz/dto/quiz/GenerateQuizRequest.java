package br.com.techtins.contaquiz.dto.quiz;

import br.com.techtins.contaquiz.model.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record GenerateQuizRequest(
    @NotBlank @Size(max = 150) String title,
    @Size(max = 255) String description,
    Long disciplineId,
    List<Long> topicIds,
    Integer questionCount,
    DifficultyLevel difficulty,
    Boolean mixedDifficulty,
    Integer timeLimitSeconds,
    Integer score
) {
}
