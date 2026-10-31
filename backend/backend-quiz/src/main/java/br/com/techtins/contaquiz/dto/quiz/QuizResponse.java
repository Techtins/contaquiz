package br.com.techtins.contaquiz.dto.quiz;

import br.com.techtins.contaquiz.dto.question.QuestionResponse;
import br.com.techtins.contaquiz.model.QuizVisibility;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

public record QuizResponse(
    @JsonProperty("_id") Long id,
    String title,
    String description,
    @JsonProperty("disciplineId") Long disciplineId,
    List<QuestionResponse> questions,
    @JsonProperty("createdByUserId") Long createdByUserId,
    @JsonProperty("timeLimitSeconds") Integer timeLimitSeconds,
    @JsonProperty("passingScore") Integer passingScore,
    QuizVisibility visibility,
    Boolean active,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime createdAt,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime updatedAt
) {
}
