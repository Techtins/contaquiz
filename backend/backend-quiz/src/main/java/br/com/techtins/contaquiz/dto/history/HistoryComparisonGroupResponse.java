package br.com.techtins.contaquiz.dto.history;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record HistoryComparisonGroupResponse(
    @JsonProperty("quizId") String quizId,
    @JsonProperty("title") String title,
    @JsonProperty("attempts") List<HistoryComparisonAttemptResponse> attempts
) {
}
