package br.com.techtins.contaquiz.dto.history;

import br.com.techtins.contaquiz.model.QuizVisibility;
import java.math.BigDecimal;
import java.time.LocalDate;

public record HistoryFilterParams(
    Long disciplineId,
    QuizVisibility visibility,
    Long quizId,
    LocalDate dateFrom,
    LocalDate dateTo,
    BigDecimal minScore,
    BigDecimal maxScore
) {
}
