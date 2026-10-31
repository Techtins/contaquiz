package br.com.techtins.contaquiz.dto.question;

import com.fasterxml.jackson.annotation.JsonProperty;

public record QuestionOptionResponse(
    @JsonProperty("_id") Long id,
    String text,
    @JsonProperty("isCorrect") Boolean isCorrect
) {
}
