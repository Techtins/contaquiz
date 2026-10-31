package br.com.techtins.contaquiz.service;

import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.model.Question;
import br.com.techtins.contaquiz.model.QuestionFavorite;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.QuestionFavoriteRepository;
import br.com.techtins.contaquiz.repository.QuestionRepository;
import br.com.techtins.contaquiz.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuestionFavoriteService {

    @Inject
    QuestionFavoriteRepository favoriteRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    QuestionRepository questionRepository;

    /**
     * Alterna o estado de favorito de uma questão para um usuário (toggle).
     * Se já estiver favoritada, remove (DELETE físico).
     * Se não estiver favoritada, adiciona.
     *
     * @param userId ID do usuário
     * @param questionId ID da questão
     * @return true se foi favoritada, false se foi desfavoritada
     */
    @Transactional
    public boolean toggleFavorite(Long userId, Long questionId) {
        // Valida se o usuário existe
        User user = userRepository.findByIdOptional(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        // Valida se a questão existe
        Question question = questionRepository.findByIdOptional(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Questão não encontrada"));

        // Verifica se já existe o favorito
        Optional<QuestionFavorite> existingFavorite = favoriteRepository.findByUserAndQuestion(userId, questionId);

        if (existingFavorite.isPresent()) {
            // Se existe, remove (DELETE físico)
            favoriteRepository.delete(existingFavorite.get());
            return false; // Desfavoritado
        } else {
            // Se não existe, cria
            QuestionFavorite favorite = new QuestionFavorite();
            favorite.setUser(user);
            favorite.setQuestion(question);
            favoriteRepository.persist(favorite);
            return true; // Favoritado
        }
    }

    /**
     * Lista todos os IDs de questões favoritadas por um usuário.
     *
     * @param userId ID do usuário
     * @return Lista de IDs de questões
     */
    public List<Long> getFavoriteQuestionIds(Long userId) {
        return favoriteRepository.findQuestionIdsByUser(userId);
    }

    /**
     * Verifica quais questões de uma lista estão favoritadas pelo usuário.
     * Utilizado para verificação em lote (batch check).
     *
     * @param userId ID do usuário
     * @param questionIdsParam String com IDs separados por vírgula
     * @return Lista de IDs de questões que estão favoritadas
     */
    public List<Long> getFavoritedQuestionIdsFromList(Long userId, String questionIdsParam) {
        if (questionIdsParam == null || questionIdsParam.isBlank()) {
            return getFavoriteQuestionIds(userId);
        }

        // Parse da string "1,2,3" para List<Long>
        List<Long> questionIds = Arrays.stream(questionIdsParam.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(Long::parseLong)
            .collect(Collectors.toList());

        if (questionIds.isEmpty()) {
            return getFavoriteQuestionIds(userId);
        }

        return favoriteRepository.findFavoritedQuestionIds(userId, questionIds);
    }
}
