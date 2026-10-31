package br.com.techtins.contaquiz.service;

import br.com.techtins.contaquiz.dto.history.HistoryAnalyticsResponse;
import br.com.techtins.contaquiz.dto.history.HistoryBreakdownItemResponse;
import br.com.techtins.contaquiz.dto.history.HistoryComparisonAttemptResponse;
import br.com.techtins.contaquiz.dto.history.HistoryComparisonGroupResponse;
import br.com.techtins.contaquiz.dto.history.HistoryDifficultyItemResponse;
import br.com.techtins.contaquiz.dto.history.HistoryFilterParams;
import br.com.techtins.contaquiz.dto.history.HistoryLowAreaItemResponse;
import br.com.techtins.contaquiz.dto.history.HistoryTimelineItemResponse;
import br.com.techtins.contaquiz.dto.history.QuizAttemptItemResponse;
import br.com.techtins.contaquiz.dto.history.QuizHistoryItemResponse;
import br.com.techtins.contaquiz.dto.history.StudentHistoryResponse;
import br.com.techtins.contaquiz.model.Quiz;
import br.com.techtins.contaquiz.model.QuizResult;
import br.com.techtins.contaquiz.repository.QuizResultRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class HistoryService {

    @Inject
    QuizResultRepository quizResultRepository;

    public StudentHistoryResponse getStudentHistory(Long userId, HistoryFilterParams filters) {
        List<QuizResult> results = quizResultRepository.findFilteredAttempts(userId, filters);

        if (results.isEmpty()) {
            return new StudentHistoryResponse(
                0,
                0,
                0,
                List.of(),
                List.of(),
                new HistoryAnalyticsResponse(
                    List.of(),
                    List.of(),
                    List.of(),
                    List.of(),
                    List.of(),
                    List.of()
                )
            );
        }

        List<QuizHistoryItemResponse> quizzes = quizResultRepository.aggregateByQuiz(userId, filters);
        List<HistoryBreakdownItemResponse> byDiscipline = quizResultRepository.aggregateByDiscipline(userId, filters);
        List<HistoryBreakdownItemResponse> byTopic = quizResultRepository.aggregateByTopic(userId, filters);
        List<HistoryDifficultyItemResponse> byDifficulty = quizResultRepository.aggregateByDifficulty(userId, filters);

        // Métricas Gerais
        int totalQuizzesCompleted = quizzes.size();
        int averageScore = quizzes.isEmpty()
            ? 0
            : Math.round((float) quizzes.stream().mapToInt(QuizHistoryItemResponse::bestScore).sum() / quizzes.size());
        int totalStudyTime = results.stream().mapToInt(QuizResult::getTimeSpentInSeconds).sum();

        // Tentativas individuais
        List<QuizAttemptItemResponse> attempts = results.stream().map(r -> new QuizAttemptItemResponse(
            String.valueOf(r.getId()),
            String.valueOf(r.getId()),
            String.valueOf(r.getQuiz().getId()),
            r.getQuiz().getTitle(),
            r.getQuiz().getDiscipline() != null ? r.getQuiz().getDiscipline().getName() : "",
            r.getQuiz().getVisibility(),
            (int) Math.round(r.getPercentage().doubleValue()),
            r.getCorrectAnswers(),
            r.getWrongAnswers(),
            r.getTotalQuestions(),
            r.getTimeSpentInSeconds(),
            r.getPassingScore(),
            r.getCreatedAt(),
            r.getPercentage().compareTo(BigDecimal.valueOf(r.getPassingScore())) >= 0
        )).toList();

        // Timeline cronológica ascendente
        List<HistoryTimelineItemResponse> timeline = results.stream()
            .sorted(Comparator.comparing(QuizResult::getCreatedAt).thenComparing(QuizResult::getId))
            .map(r -> new HistoryTimelineItemResponse(
                String.valueOf(r.getId()),
                String.valueOf(r.getQuiz().getId()),
                r.getQuiz().getTitle(),
                r.getCreatedAt(),
                (int) Math.round(r.getPercentage().doubleValue()),
                r.getTimeSpentInSeconds()
            ))
            .toList();

        // Comparação sequencial por quiz
        Map<Long, List<QuizResult>> byQuiz = new LinkedHashMap<>();
        for (QuizResult r : results.stream()
                .sorted(Comparator.comparing(QuizResult::getCreatedAt).thenComparing(QuizResult::getId))
                .toList()) {
            byQuiz.computeIfAbsent(r.getQuiz().getId(), k -> new ArrayList<>()).add(r);
        }

        List<HistoryComparisonGroupResponse> comparison = new ArrayList<>();
        for (List<QuizResult> quizAttempts : byQuiz.values()) {
            Quiz quiz = quizAttempts.getFirst().getQuiz();
            List<HistoryComparisonAttemptResponse> compAttempts = new ArrayList<>();
            for (int i = 0; i < quizAttempts.size(); i++) {
                QuizResult r = quizAttempts.get(i);
                compAttempts.add(new HistoryComparisonAttemptResponse(
                    i + 1,
                    String.valueOf(r.getId()),
                    r.getCreatedAt(),
                    (int) Math.round(r.getPercentage().doubleValue())
                ));
            }
            comparison.add(new HistoryComparisonGroupResponse(
                String.valueOf(quiz.getId()),
                quiz.getTitle(),
                compAttempts
            ));
        }

        // Identificação de Pontos Fracos (Low Areas):
        // 1. Unir disciplinas e tópicos
        // 2. Regra Rígida: mínimo de 2 tentativas
        // 3. Ordenar por averageScore crescente
        // 4. Retornar os 5 piores desempenhos
        List<HistoryLowAreaItemResponse> candidateLowAreas = new ArrayList<>();
        for (HistoryBreakdownItemResponse d : byDiscipline) {
            candidateLowAreas.add(new HistoryLowAreaItemResponse(
                "DISCIPLINE",
                d.key(),
                d.label(),
                d.averageScore(),
                d.attempts()
            ));
        }
        for (HistoryBreakdownItemResponse t : byTopic) {
            candidateLowAreas.add(new HistoryLowAreaItemResponse(
                "TOPIC",
                t.key(),
                t.label(),
                t.averageScore(),
                t.attempts()
            ));
        }

        List<HistoryLowAreaItemResponse> lowAreas = candidateLowAreas.stream()
            .filter(item -> item.attempts() >= 2)
            .sorted(Comparator.comparingInt(HistoryLowAreaItemResponse::averageScore)
                .thenComparingInt(HistoryLowAreaItemResponse::attempts))
            .limit(5)
            .toList();

        HistoryAnalyticsResponse analytics = new HistoryAnalyticsResponse(
            timeline,
            byDiscipline,
            byTopic,
            byDifficulty,
            comparison,
            lowAreas
        );

        return new StudentHistoryResponse(
            totalQuizzesCompleted,
            averageScore,
            totalStudyTime,
            quizzes,
            attempts,
            analytics
        );
    }
}
