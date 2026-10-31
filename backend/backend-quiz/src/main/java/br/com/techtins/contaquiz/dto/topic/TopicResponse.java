package br.com.techtins.contaquiz.dto.topic;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record TopicResponse(
    @JsonProperty("_id") Long id,
    String name,
    @JsonProperty("disciplineId") Long disciplineId,
    @JsonProperty("parentTopicId") Long parentTopicId,
    Boolean active,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime createdAt,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime updatedAt
) {
}
