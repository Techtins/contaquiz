package br.com.techtins.contaquiz.dto.favorite;

import java.util.List;

/**
 * Response DTO contendo a lista de IDs de questões favoritadas.
 *
 * @param questionIds Lista de IDs das questões favoritadas pelo usuário
 */
public record QuestionFavoritesResponse(List<Long> questionIds) {
}
