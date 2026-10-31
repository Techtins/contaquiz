package br.com.techtins.contaquiz.repository;

import br.com.techtins.contaquiz.dto.history.HistoryBreakdownItemResponse;
import br.com.techtins.contaquiz.dto.history.HistoryDifficultyItemResponse;
import br.com.techtins.contaquiz.dto.history.HistoryFilterParams;
import br.com.techtins.contaquiz.dto.history.QuizHistoryItemResponse;
import br.com.techtins.contaquiz.model.QuizResult;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class QuizResultRepository implements PanacheRepositoryBase<QuizResult, Long> {

    @Inject
    EntityManager entityManager;

    public List<QuizHistoryItemResponse> aggregateByQuiz(Long userId, HistoryFilterParams filters) {
        StringBuilder sql = new StringBuilder("""
            SELECT
                q.id AS quiz_id,
                q.title AS title,
                d.name AS discipline_name,
                COUNT(r.id) AS attempts,
                MAX(r.percentage) AS best_score,
                MAX(r.created_at) AS last_attempt_date,
                COALESCE(SUM(r.time_spent_in_seconds), 0) AS total_time_spent,
                COALESCE(ROUND(AVG(r.time_spent_in_seconds)), 0) AS average_time
            FROM tb_quiz_result r
            JOIN tb_quiz q ON q.id = r.quiz_id
            LEFT JOIN tb_discipline d ON d.id = q.discipline_id
            WHERE r.user_id = :userId
        """);

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        appendSqlFilters(sql, params, filters);

        sql.append("""
            GROUP BY q.id, q.title, d.name
            ORDER BY MAX(r.created_at) DESC, q.id DESC
        """);

        Query query = entityManager.createNativeQuery(sql.toString());
        params.forEach(query::setParameter);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        List<QuizHistoryItemResponse> items = new ArrayList<>();

        for (Object[] row : rows) {
            String quizId = String.valueOf(toLong(row[0]));
            String title = (String) row[1];
            String discipline = row[2] != null ? (String) row[2] : "";
            int attempts = toInt(row[3]);
            int bestScore = row[4] != null ? (int) Math.round(toDouble(row[4])) : 0;
            LocalDateTime lastAttemptDate = toLocalDateTime(row[5]);
            int totalTimeSpent = toInt(row[6]);
            int averageTime = toInt(row[7]);

            items.add(new QuizHistoryItemResponse(
                quizId,
                quizId,
                title,
                discipline,
                attempts,
                bestScore,
                lastAttemptDate,
                totalTimeSpent,
                averageTime
            ));
        }

        return items;
    }

    public List<HistoryBreakdownItemResponse> aggregateByDiscipline(Long userId, HistoryFilterParams filters) {
        StringBuilder sql = new StringBuilder("""
            SELECT
                CAST(d.id AS VARCHAR) AS discipline_key,
                d.name AS label,
                COUNT(r.id) AS attempts,
                COALESCE(SUM(r.correct_answers), 0) AS correct_answers,
                COALESCE(ROUND(AVG(r.percentage)), 0) AS average_score,
                COALESCE(ROUND(AVG(r.time_spent_in_seconds)), 0) AS average_time
            FROM tb_quiz_result r
            JOIN tb_quiz q ON q.id = r.quiz_id
            JOIN tb_discipline d ON d.id = q.discipline_id
            WHERE r.user_id = :userId
        """);

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        appendSqlFilters(sql, params, filters);

        sql.append("""
            GROUP BY d.id, d.name
            ORDER BY d.name ASC
        """);

        Query query = entityManager.createNativeQuery(sql.toString());
        params.forEach(query::setParameter);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        List<HistoryBreakdownItemResponse> items = new ArrayList<>();

        for (Object[] row : rows) {
            String key = (String) row[0];
            String label = (String) row[1];
            int attempts = toInt(row[2]);
            int correctAnswers = toInt(row[3]);
            int averageScore = toInt(row[4]);
            int averageTime = toInt(row[5]);

            items.add(new HistoryBreakdownItemResponse(
                key,
                label,
                attempts,
                correctAnswers,
                averageScore,
                averageTime
            ));
        }

        return items;
    }

    public List<HistoryBreakdownItemResponse> aggregateByTopic(Long userId, HistoryFilterParams filters) {
        StringBuilder sql = new StringBuilder("""
            SELECT
                COALESCE(CAST(t.id AS VARCHAR), 'sem-topico') AS topic_key,
                COALESCE(t.name, 'Sem tópico') AS label,
                COUNT(c.id) AS attempts,
                COALESCE(SUM(CASE WHEN c.is_correct THEN 1 ELSE 0 END), 0) AS correct_answers,
                COALESCE(ROUND((SUM(CASE WHEN c.is_correct THEN 100.0 ELSE 0.0 END) / NULLIF(COUNT(c.id), 0))), 0) AS average_score,
                0 AS average_time
            FROM tb_quiz_result r
            JOIN tb_quiz q ON q.id = r.quiz_id
            JOIN tb_quiz_result_correction c ON c.result_id = r.id
            JOIN tb_question qu ON qu.id = c.question_id
            LEFT JOIN tb_question_topic qt ON qt.question_id = qu.id
            LEFT JOIN tb_topic t ON t.id = qt.topic_id
            WHERE r.user_id = :userId
        """);

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        appendSqlFilters(sql, params, filters);

        sql.append("""
            GROUP BY t.id, t.name
            ORDER BY label ASC
        """);

        Query query = entityManager.createNativeQuery(sql.toString());
        params.forEach(query::setParameter);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        List<HistoryBreakdownItemResponse> items = new ArrayList<>();

        for (Object[] row : rows) {
            String key = (String) row[0];
            String label = (String) row[1];
            int attempts = toInt(row[2]);
            int correctAnswers = toInt(row[3]);
            int averageScore = toInt(row[4]);
            int averageTime = toInt(row[5]);

            items.add(new HistoryBreakdownItemResponse(
                key,
                label,
                attempts,
                correctAnswers,
                averageScore,
                averageTime
            ));
        }

        return items;
    }

    public List<HistoryDifficultyItemResponse> aggregateByDifficulty(Long userId, HistoryFilterParams filters) {
        StringBuilder sql = new StringBuilder("""
            SELECT
                COALESCE(qu.difficulty, 'MEDIO') AS difficulty,
                COUNT(c.id) AS attempts,
                COALESCE(SUM(CASE WHEN c.is_correct THEN 1 ELSE 0 END), 0) AS correct_answers,
                COALESCE(ROUND((SUM(CASE WHEN c.is_correct THEN 100.0 ELSE 0.0 END) / NULLIF(COUNT(c.id), 0))), 0) AS accuracy
            FROM tb_quiz_result r
            JOIN tb_quiz q ON q.id = r.quiz_id
            JOIN tb_quiz_result_correction c ON c.result_id = r.id
            JOIN tb_question qu ON qu.id = c.question_id
            WHERE r.user_id = :userId
        """);

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        appendSqlFilters(sql, params, filters);

        sql.append("""
            GROUP BY qu.difficulty
            ORDER BY difficulty ASC
        """);

        Query query = entityManager.createNativeQuery(sql.toString());
        params.forEach(query::setParameter);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        List<HistoryDifficultyItemResponse> items = new ArrayList<>();

        for (Object[] row : rows) {
            String difficulty = (String) row[0];
            int attempts = toInt(row[1]);
            int correctAnswers = toInt(row[2]);
            int accuracy = toInt(row[3]);

            items.add(new HistoryDifficultyItemResponse(
                difficulty,
                attempts,
                correctAnswers,
                accuracy
            ));
        }

        return items;
    }

    public List<QuizResult> findFilteredAttempts(Long userId, HistoryFilterParams filters) {
        StringBuilder jpql = new StringBuilder("""
            SELECT r FROM QuizResult r
            JOIN FETCH r.quiz q
            LEFT JOIN FETCH q.discipline d
            WHERE r.user.id = :userId
        """);

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);

        if (filters != null) {
            if (filters.disciplineId() != null) {
                jpql.append(" AND q.discipline.id = :disciplineId");
                params.put("disciplineId", filters.disciplineId());
            }
            if (filters.visibility() != null) {
                jpql.append(" AND q.visibility = :visibility");
                params.put("visibility", filters.visibility());
            }
            if (filters.quizId() != null) {
                jpql.append(" AND q.id = :quizId");
                params.put("quizId", filters.quizId());
            }
            if (filters.dateFrom() != null) {
                jpql.append(" AND r.createdAt >= :dateFrom");
                params.put("dateFrom", filters.dateFrom().atStartOfDay());
            }
            if (filters.dateTo() != null) {
                jpql.append(" AND r.createdAt <= :dateTo");
                params.put("dateTo", filters.dateTo().atTime(23, 59, 59, 999_999_999));
            }
            if (filters.minScore() != null) {
                jpql.append(" AND r.percentage >= :minScore");
                params.put("minScore", filters.minScore());
            }
            if (filters.maxScore() != null) {
                jpql.append(" AND r.percentage <= :maxScore");
                params.put("maxScore", filters.maxScore());
            }
        }

        jpql.append(" ORDER BY r.createdAt DESC, r.id DESC");

        TypedQuery<QuizResult> query = entityManager.createQuery(jpql.toString(), QuizResult.class);
        params.forEach(query::setParameter);

        return query.getResultList();
    }

    private void appendSqlFilters(StringBuilder sql, Map<String, Object> params, HistoryFilterParams filters) {
        if (filters == null) {
            return;
        }

        if (filters.disciplineId() != null) {
            sql.append(" AND q.discipline_id = :disciplineId");
            params.put("disciplineId", filters.disciplineId());
        }
        if (filters.visibility() != null) {
            sql.append(" AND q.visibility = :visibility");
            params.put("visibility", filters.visibility().name());
        }
        if (filters.quizId() != null) {
            sql.append(" AND q.id = :quizId");
            params.put("quizId", filters.quizId());
        }
        if (filters.dateFrom() != null) {
            sql.append(" AND r.created_at >= :dateFrom");
            params.put("dateFrom", Timestamp.valueOf(filters.dateFrom().atStartOfDay()));
        }
        if (filters.dateTo() != null) {
            sql.append(" AND r.created_at <= :dateTo");
            params.put("dateTo", Timestamp.valueOf(filters.dateTo().atTime(23, 59, 59, 999_999_999)));
        }
        if (filters.minScore() != null) {
            sql.append(" AND r.percentage >= :minScore");
            params.put("minScore", filters.minScore());
        }
        if (filters.maxScore() != null) {
            sql.append(" AND r.percentage <= :maxScore");
            params.put("maxScore", filters.maxScore());
        }
    }

    private long toLong(Object obj) {
        if (obj instanceof Number number) {
            return number.longValue();
        }
        return 0L;
    }

    private int toInt(Object obj) {
        if (obj instanceof Number number) {
            return number.intValue();
        }
        return 0;
    }

    private double toDouble(Object obj) {
        if (obj instanceof Number number) {
            return number.doubleValue();
        }
        return 0.0;
    }

    private LocalDateTime toLocalDateTime(Object obj) {
        if (obj instanceof LocalDateTime ldt) {
            return ldt;
        }
        if (obj instanceof Timestamp ts) {
            return ts.toLocalDateTime();
        }
        if (obj instanceof Instant instant) {
            return LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
        }
        return LocalDateTime.now(ZoneOffset.UTC);
    }
}
