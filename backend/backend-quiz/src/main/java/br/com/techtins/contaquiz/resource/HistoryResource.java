package br.com.techtins.contaquiz.resource;

import br.com.techtins.contaquiz.dto.history.HistoryFilterParams;
import br.com.techtins.contaquiz.dto.history.StudentHistoryResponse;
import br.com.techtins.contaquiz.exception.BusinessException;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.model.QuizVisibility;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.UserRepository;
import br.com.techtins.contaquiz.service.HistoryService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/historico")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HistoryResource {

    @Inject
    HistoryService historyService;

    @Inject
    UserRepository userRepository;

    @Inject
    JsonWebToken jwt;

    @GET
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response getHistory(
            @QueryParam("disciplineId") Long disciplineId,
            @QueryParam("visibility") String visibility,
            @QueryParam("quizId") Long quizId,
            @QueryParam("dateFrom") String dateFrom,
            @QueryParam("dateTo") String dateTo,
            @QueryParam("minScore") BigDecimal minScore,
            @QueryParam("maxScore") BigDecimal maxScore) {

        Long currentUserId = resolveCurrentUserId();

        LocalDate parsedDateFrom = parseDate(dateFrom, "dateFrom");
        LocalDate parsedDateTo = parseDate(dateTo, "dateTo");
        QuizVisibility parsedVisibility = parseVisibility(visibility);

        HistoryFilterParams filters = new HistoryFilterParams(
            disciplineId,
            parsedVisibility,
            quizId,
            parsedDateFrom,
            parsedDateTo,
            minScore,
            maxScore
        );

        StudentHistoryResponse history = historyService.getStudentHistory(currentUserId, filters);

        return Response.ok(Map.of("data", history)).build();
    }

    private Long resolveCurrentUserId() {
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

    private LocalDate parseDate(String value, String paramName) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException e) {
            throw new BusinessException("Parâmetro '" + paramName + "' com formato inválido. Use o formato AAAA-MM-DD.");
        }
    }

    private QuizVisibility parseVisibility(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return QuizVisibility.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Visibilidade inválida: " + value + ". Valores aceitos: PUBLIC, PRIVATE.");
        }
    }
}
