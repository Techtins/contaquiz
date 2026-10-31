package br.com.techtins.contaquiz.dto.history;

import com.fasterxml.jackson.annotation.JsonProperty;

public record HistoryBreakdownItemResponse(
    @JsonProperty("key") String key,
    @JsonProperty("label") String label,
    @JsonProperty("attempts") int attempts,
    @JsonProperty("correctAnswers") int correctAnswers,
    @JsonProperty("averageScore") int averageScore,
    @JsonProperty("averageTime") int averageTime
) {
}
