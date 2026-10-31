package br.com.techtins.contaquiz.dto.history;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record QuizHistoryItemResponse(
    @JsonProperty("_id") String id,
    @JsonProperty("quizId") String quizId,
    @JsonProperty("title") String title,
    @JsonProperty("discipline") String discipline,
    @JsonProperty("attempts") int attempts,
    @JsonProperty("bestScore") int bestScore,
    @JsonProperty("lastAttemptDate")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    LocalDateTime lastAttemptDate,
    @JsonProperty("totalTimeSpent") int totalTimeSpent,
    @JsonProperty("averageTime") int averageTime
) {
}
