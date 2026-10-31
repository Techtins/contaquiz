package br.com.techtins.contaquiz.repository;

import br.com.techtins.contaquiz.model.QuestionFavorite;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class QuestionFavoriteRepository implements PanacheRepositoryBase<QuestionFavorite, Long> {

    /**
     * Busca um favorito específico por usuário e questão.
     *
     * @param userId ID do usuário
     * @param questionId ID da questão
     * @return Optional com o favorito, se existir
     */
    public Optional<QuestionFavorite> findByUserAndQuestion(Long userId, Long questionId) {
        return find("user.id = ?1 and question.id = ?2", userId, questionId).firstResultOptional();
    }

    /**
     * Lista todos os IDs de questões favoritadas por um usuário.
     *
     * @param userId ID do usuário
     * @return Lista de IDs de questões
     */
    public List<Long> findQuestionIdsByUser(Long userId) {
        return find("SELECT f.question.id FROM QuestionFavorite f WHERE f.user.id = ?1", userId)
            .project(Long.class)
            .list();
    }

    /**
     * Verifica quais questões de uma lista estão favoritadas pelo usuário.
     *
     * @param userId ID do usuário
     * @param questionIds Lista de IDs de questões para verificar
     * @return Lista de IDs de questões que estão favoritadas
     */
    public List<Long> findFavoritedQuestionIds(Long userId, List<Long> questionIds) {
        return find("SELECT f.question.id FROM QuestionFavorite f WHERE f.user.id = ?1 AND f.question.id IN ?2",
                userId, questionIds)
            .project(Long.class)
            .list();
    }

    /**
     * Remove um favorito específico (DELETE físico).
     *
     * @param userId ID do usuário
     * @param questionId ID da questão
     * @return Número de registros deletados (0 ou 1)
     */
    public long deleteByUserAndQuestion(Long userId, Long questionId) {
        return delete("user.id = ?1 and question.id = ?2", userId, questionId);
    }
}
