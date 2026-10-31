package br.com.techtins.contaquiz.dto.topic;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TopicRequest(
    @NotBlank @Size(min = 2, max = 150) String name,
    @NotNull Long disciplineId,
    Long parentTopicId
) {
}
