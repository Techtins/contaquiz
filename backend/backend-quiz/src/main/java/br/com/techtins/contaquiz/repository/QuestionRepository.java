package br.com.techtins.contaquiz.repository;

import br.com.techtins.contaquiz.model.DifficultyLevel;
import br.com.techtins.contaquiz.model.Question;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class QuestionRepository implements PanacheRepositoryBase<Question, Long> {

    @PersistenceContext
    EntityManager entityManager;

    /**
     * Conta quantas questões ativas estão disponíveis para os filtros informados.
     */
    public long countByFilters(List<Long> topicIds, DifficultyLevel difficulty,
                               boolean mixedDifficulty, Long disciplineId) {
        StringBuilder jpql = new StringBuilder("SELECT COUNT(DISTINCT q) FROM Question q");
        Map<String, Object> params = new HashMap<>();
        boolean hasWhere = false;

        if (topicIds != null && !topicIds.isEmpty()) {
            jpql.append(" JOIN q.topics t");
            jpql.append(" WHERE t.id IN :topicIds");
            params.put("topicIds", topicIds);
            hasWhere = true;
        }

        if (!hasWhere) {
            jpql.append(" WHERE 1=1");
            hasWhere = true;
        }

        jpql.append(" AND q.active = true");

        if (!mixedDifficulty && difficulty != null) {
            jpql.append(" AND q.difficulty = :difficulty");
            params.put("difficulty", difficulty);
        }

        if (disciplineId != null) {
            jpql.append(" AND q.discipline.id = :disciplineId");
            params.put("disciplineId", disciplineId);
        }

        return count(jpql.toString(), params);
    }

    /**
     * Seleciona N questões aleatórias que pertençam aos tópicos informados.
     * Usa ORDER BY RANDOM() do PostgreSQL para amostragem randômica.
     *
     * Nota: usa EXISTS com subquery em vez de JOIN + DISTINCT para evitar o erro do
     * PostgreSQL "for SELECT DISTINCT, ORDER BY expressions must appear in select list",
     * já que RANDOM() não pode estar na lista do SELECT com DISTINCT.
     */
    @SuppressWarnings("unchecked")
    public List<Question> findRandomByFilters(List<Long> topicIds, int limit,
                                              DifficultyLevel difficulty, boolean mixedDifficulty,
                                              Long disciplineId) {
        StringBuilder jpql = new StringBuilder("SELECT q FROM Question q");
        Map<String, Object> params = new HashMap<>();
        boolean hasWhere = false;

        if (topicIds != null && !topicIds.isEmpty()) {
            jpql.append(" WHERE EXISTS (SELECT 1 FROM q.topics t WHERE t.id IN :topicIds)");
            params.put("topicIds", topicIds);
            hasWhere = true;
        }

        if (!hasWhere) {
            jpql.append(" WHERE 1=1");
        }

        jpql.append(" AND q.active = true");

        if (!mixedDifficulty && difficulty != null) {
            jpql.append(" AND q.difficulty = :difficulty");
            params.put("difficulty", difficulty);
        }

        if (disciplineId != null) {
            jpql.append(" AND q.discipline.id = :disciplineId");
            params.put("disciplineId", disciplineId);
        }

        jpql.append(" ORDER BY RANDOM()");

        Query query = entityManager.createQuery(jpql.toString());
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        query.setMaxResults(limit);
        return query.getResultList();
    }

    /**
     * Seleciona N questões aleatórias sem filtro de tópicos (busca geral),
     * aplicando apenas disciplina, dificuldade e active.
     */

    public List<Question> findRandomGeneral(int limit, DifficultyLevel difficulty,
                                            boolean mixedDifficulty, Long disciplineId) {
        return findRandomByFilters(null, limit, difficulty, mixedDifficulty, disciplineId);
    }
}
