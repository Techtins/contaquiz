package br.com.techtins.contaquiz.dto.history;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record HistoryComparisonAttemptResponse(
    @JsonProperty("attemptNumber") int attemptNumber,
    @JsonProperty("resultId") String resultId,
    @JsonProperty("createdAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    LocalDateTime createdAt,
    @JsonProperty("percentage") int percentage
) {
}
