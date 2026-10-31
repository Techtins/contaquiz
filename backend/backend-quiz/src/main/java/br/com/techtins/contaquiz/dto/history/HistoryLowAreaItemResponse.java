package br.com.techtins.contaquiz.dto.history;

import com.fasterxml.jackson.annotation.JsonProperty;

public record HistoryLowAreaItemResponse(
    @JsonProperty("kind") String kind,
    @JsonProperty("key") String key,
    @JsonProperty("label") String label,
    @JsonProperty("averageScore") int averageScore,
    @JsonProperty("attempts") int attempts
) {
}
