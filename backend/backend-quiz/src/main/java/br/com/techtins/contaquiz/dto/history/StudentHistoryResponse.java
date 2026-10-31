package br.com.techtins.contaquiz.dto.history;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record StudentHistoryResponse(
    @JsonProperty("totalQuizzesCompleted") int totalQuizzesCompleted,
    @JsonProperty("averageScore") int averageScore,
    @JsonProperty("totalStudyTime") int totalStudyTime,
    @JsonProperty("quizzes") List<QuizHistoryItemResponse> quizzes,
    @JsonProperty("attempts") List<QuizAttemptItemResponse> attempts,
    @JsonProperty("analytics") HistoryAnalyticsResponse analytics
) {
}
