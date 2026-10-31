package br.com.techtins.contaquiz.dto.history;

import com.fasterxml.jackson.annotation.JsonProperty;

public record HistoryDifficultyItemResponse(
    @JsonProperty("difficulty") String difficulty,
    @JsonProperty("attempts") int attempts,
    @JsonProperty("correctAnswers") int correctAnswers,
    @JsonProperty("accuracy") int accuracy
) {
}
