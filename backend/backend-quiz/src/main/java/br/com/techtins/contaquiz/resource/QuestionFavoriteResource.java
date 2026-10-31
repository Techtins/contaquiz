package br.com.techtins.contaquiz.resource;

import br.com.techtins.contaquiz.dto.favorite.FavoriteToggleResponse;
import br.com.techtins.contaquiz.dto.favorite.QuestionFavoritesResponse;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.UserRepository;
import br.com.techtins.contaquiz.service.QuestionFavoriteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import java.util.List;
import java.util.Map;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuestionFavoriteResource {

    @Inject
    QuestionFavoriteService favoriteService;

    @Inject
    UserRepository userRepository;

    @Inject
    JsonWebToken jwt;

    /**
     * GET /api/question-favorites
     * Retorna a lista de IDs de questões favoritadas pelo usuário autenticado.
     * Suporta filtro opcional por lista de IDs (batch check).
     *
     * @param questionIds (Opcional) String com IDs separados por vírgula
     * @return Response com { "data": { "questionIds": [1, 2, 3] } }
     */
    @GET
    @Path("/question-favorites")
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response getFavorites(@QueryParam("questionIds") String questionIds) {
        Long userId = getCurrentUserId();

        List<Long> favoriteIds;
        if (questionIds != null && !questionIds.isBlank()) {
            // Modo batch: verifica apenas os IDs fornecidos
            favoriteIds = favoriteService.getFavoritedQuestionIdsFromList(userId, questionIds);
        } else {
            // Modo completo: retorna todos os favoritos do usuário
            favoriteIds = favoriteService.getFavoriteQuestionIds(userId);
        }

        QuestionFavoritesResponse response = new QuestionFavoritesResponse(favoriteIds);
        return Response.ok(Map.of("data", response)).build();
    }

    /**
     * POST /api/questions/:questionId/favorite
     * Toggle: favorita ou desfavorita uma questão.
     *
     * @param questionId ID da questão
     * @return Response com { "data": { "favorited": true/false } }
     */
    @POST
    @Path("/questions/{questionId}/favorite")
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response toggleFavorite(@PathParam("questionId") Long questionId) {
        Long userId = getCurrentUserId();

        boolean favorited = favoriteService.toggleFavorite(userId, questionId);

        FavoriteToggleResponse response = new FavoriteToggleResponse(favorited);
        return Response.ok(Map.of("data", response)).build();
    }

    private Long getCurrentUserId() {
        String email = jwt.getName();
        if (email == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        User user = userRepository.findByEmail(email).firstResult();
        if (user == null) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + email);
        }
        return user.getId();
    }
}
