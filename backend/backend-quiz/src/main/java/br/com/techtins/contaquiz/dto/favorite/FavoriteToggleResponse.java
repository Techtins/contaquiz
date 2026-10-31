package br.com.techtins.contaquiz.dto.favorite;

/**
 * Response DTO para a operação de toggle de favorito.
 *
 * @param favorited true se a questão foi favoritada, false se foi desfavoritada
 */
public record FavoriteToggleResponse(boolean favorited) {
}
