package br.com.techtins.contaquiz.resource;

import br.com.techtins.contaquiz.dto.quiz.GenerateQuizRequest;
import br.com.techtins.contaquiz.dto.quiz.QuizRequest;
import br.com.techtins.contaquiz.dto.quiz.QuizResponse;
import br.com.techtins.contaquiz.dto.quiz.QuizResultResponse;
import br.com.techtins.contaquiz.dto.quiz.QuizSubmitRequest;
import br.com.techtins.contaquiz.dto.response.PaginatedResponse;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.mapper.QuizMapper;
import br.com.techtins.contaquiz.mapper.QuizResultMapper;
import br.com.techtins.contaquiz.model.Quiz;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.UserRepository;
import br.com.techtins.contaquiz.service.QuizService;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/quizzes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuizResource {

    @Inject
    QuizService quizService;

    @Inject
    QuizMapper quizMapper;

    @Inject
    QuizResultMapper quizResultMapper;

    @Inject
    JsonWebToken jwt;

    @Inject
    UserRepository userRepository;

    @GET
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response findAll(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("10") int limit,
            @QueryParam("title") String title,
            @QueryParam("disciplineId") Long disciplineId) {

        Long currentUserId = resolveCurrentUserId();

        PanacheQuery<Quiz> query = quizService.findAll(title, disciplineId, currentUserId);

        var paged = query.page(page - 1, limit);

        var items = paged.list().stream()
            .map(quizMapper::toResponse)
            .toList();

        PaginatedResponse<QuizResponse> response = new PaginatedResponse<>(
            items, page, limit, paged.count(), paged.pageCount());

        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response findById(@PathParam("id") Long id) {
        return Response.ok(quizMapper.toResponse(quizService.findById(id))).build();
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid QuizRequest dto) {
        Long adminUserId = resolveCurrentUserId();
        return Response.status(201)
            .entity(quizMapper.toResponse(quizService.create(dto, adminUserId)))
            .build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response update(@PathParam("id") Long id, @Valid QuizRequest dto) {
        return Response.ok(quizMapper.toResponse(quizService.update(id, dto))).build();
    }

    @POST
    @Path("/generate")
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response generate(@Valid GenerateQuizRequest dto) {
        Long currentUserId = resolveCurrentUserId();
        return Response.status(201)
            .entity(quizMapper.toResponse(quizService.generate(dto, currentUserId)))
            .build();
    }

    @POST
    @Path("/{id}/submit")
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response submit(@PathParam("id") Long id, @Valid QuizSubmitRequest dto) {
        Long currentUserId = resolveCurrentUserId();
        QuizResultResponse result = quizService.submit(
            id, dto.answers(), dto.timeSpentInSeconds(), currentUserId);
        return Response.status(201).entity(Map.of("data", result)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response delete(@PathParam("id") Long id) {
        quizService.delete(id);
        return Response.noContent().build();
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
}
