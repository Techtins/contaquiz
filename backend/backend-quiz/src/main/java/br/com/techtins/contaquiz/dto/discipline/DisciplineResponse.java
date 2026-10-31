package br.com.techtins.contaquiz.dto.discipline;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record DisciplineResponse(
    @JsonProperty("_id") Long id,
    String name,
    String description,
    Boolean active,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime createdAt,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime updatedAt
) {
}
