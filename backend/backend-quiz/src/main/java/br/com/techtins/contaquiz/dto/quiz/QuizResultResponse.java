package br.com.techtins.contaquiz.dto.quiz;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record QuizResultResponse(
    @JsonProperty("_id") Long id,
    @JsonProperty("userId") Long userId,
    @JsonProperty("quizId") Long quizId,
    @JsonProperty("correctAnswers") int correctAnswers,
    @JsonProperty("wrongAnswers") int wrongAnswers,
    @JsonProperty("totalQuestions") int totalQuestions,
    @JsonProperty("percentage") BigDecimal percentage,
    @JsonProperty("timeSpentInSeconds") int timeSpentInSeconds,
    @JsonProperty("passingScore") int passingScore,
    @JsonProperty("corrections") List<QuizCorrectionResponse> corrections,
    @JsonProperty("createdAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    LocalDateTime createdAt
) {
}
