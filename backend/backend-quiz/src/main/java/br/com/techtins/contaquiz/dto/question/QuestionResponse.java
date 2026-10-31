package br.com.techtins.contaquiz.dto.question;

import br.com.techtins.contaquiz.model.DifficultyLevel;
import br.com.techtins.contaquiz.model.QuestionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

public record QuestionResponse(
    @JsonProperty("_id") Long id,
    String statement,
    QuestionType type,
    DifficultyLevel difficulty,
    String explanation,
    @JsonProperty("disciplineId") Long disciplineId,
    @JsonProperty("timesAnswered") Integer timesAnswered,
    @JsonProperty("timesCorrect") Integer timesCorrect,
    Boolean active,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime createdAt,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime updatedAt,
    List<QuestionOptionResponse> options,
    @JsonProperty("topicIds") List<Long> topicIds
) {
}
