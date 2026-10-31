package br.com.techtins.contaquiz.dto.history;

import br.com.techtins.contaquiz.model.QuizVisibility;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record QuizAttemptItemResponse(
    @JsonProperty("_id") String id,
    @JsonProperty("resultId") String resultId,
    @JsonProperty("quizId") String quizId,
    @JsonProperty("title") String title,
    @JsonProperty("discipline") String discipline,
    @JsonProperty("visibility") QuizVisibility visibility,
    @JsonProperty("percentage") int percentage,
    @JsonProperty("correctAnswers") int correctAnswers,
    @JsonProperty("wrongAnswers") int wrongAnswers,
    @JsonProperty("totalQuestions") int totalQuestions,
    @JsonProperty("timeSpentInSeconds") int timeSpentInSeconds,
    @JsonProperty("passingScore") int passingScore,
    @JsonProperty("createdAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    LocalDateTime createdAt,
    @JsonProperty("passed") boolean passed
) {
}
