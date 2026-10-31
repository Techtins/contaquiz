package br.com.techtins.contaquiz.dto.quiz;

import com.fasterxml.jackson.annotation.JsonProperty;

public record QuizCorrectionResponse(
    @JsonProperty("questionId") Long questionId,
    @JsonProperty("userAnswer") Integer userAnswer,
    @JsonProperty("correctAnswer") int correctAnswer,
    @JsonProperty("isCorrect") boolean isCorrect,
    @JsonProperty("explanationSnapshot") String explanationSnapshot
) {
}
