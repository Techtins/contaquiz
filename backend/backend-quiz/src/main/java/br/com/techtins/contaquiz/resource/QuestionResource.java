package br.com.techtins.contaquiz.resource;

import br.com.techtins.contaquiz.dto.question.QuestionRequest;
import br.com.techtins.contaquiz.dto.question.QuestionResponse;
import br.com.techtins.contaquiz.dto.response.PaginatedResponse;
import br.com.techtins.contaquiz.mapper.QuestionMapper;
import br.com.techtins.contaquiz.model.DifficultyLevel;
import br.com.techtins.contaquiz.model.Question;
import br.com.techtins.contaquiz.model.QuestionType;
import br.com.techtins.contaquiz.service.QuestionService;
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
import java.util.List;

@Path("/api/questoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuestionResource {

    @Inject
    QuestionService questionService;

    @Inject
    QuestionMapper questionMapper;

    @GET
    public Response findAll(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("10") int limit,
            @QueryParam("statement") String statement,
            @QueryParam("type") QuestionType type,
            @QueryParam("difficulty") DifficultyLevel difficulty,
            @QueryParam("disciplineId") Long disciplineId,
            @QueryParam("topicIds") List<Long> topicIds,
            @QueryParam("active") Boolean active) {

        PanacheQuery<Question> query = questionService.findAll(
            statement, type, difficulty, disciplineId, topicIds, active);

        var paged = query.page(page - 1, limit);

        var items = paged.list().stream()
            .map(questionMapper::toResponse)
            .toList();

        PaginatedResponse<QuestionResponse> response = new PaginatedResponse<>(
            items, page, limit, (int) paged.count(), paged.pageCount());

        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        return Response.ok(questionMapper.toResponse(questionService.findById(id))).build();
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid QuestionRequest dto) {
        return Response.status(201)
            .entity(questionMapper.toResponse(questionService.create(dto)))
            .build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response update(@PathParam("id") Long id, @Valid QuestionRequest dto) {
        return Response.ok(questionMapper.toResponse(questionService.update(id, dto))).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response delete(@PathParam("id") Long id) {
        questionService.delete(id);
        return Response.noContent().build();
    }
}
