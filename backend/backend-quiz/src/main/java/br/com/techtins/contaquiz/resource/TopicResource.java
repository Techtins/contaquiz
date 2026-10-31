package br.com.techtins.contaquiz.resource;

import br.com.techtins.contaquiz.dto.response.PaginatedResponse;
import br.com.techtins.contaquiz.dto.topic.TopicRequest;
import br.com.techtins.contaquiz.dto.topic.TopicResponse;
import br.com.techtins.contaquiz.mapper.TopicMapper;
import br.com.techtins.contaquiz.model.Topic;
import br.com.techtins.contaquiz.service.TopicService;
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

@Path("/api/temas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TopicResource {

    @Inject
    TopicService topicService;

    @Inject
    TopicMapper topicMapper;

    @GET
    public Response findAll(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("10") int limit,
            @QueryParam("filter") String filter,
            @QueryParam("active") Boolean active,
            @QueryParam("disciplineId") Long disciplineId) {

        PanacheQuery<Topic> query = topicService.findAll(filter, active, disciplineId);

        var paged = query.page(page - 1, limit);

        var items = paged.list().stream()
            .map(topicMapper::toResponse)
            .toList();

        PaginatedResponse<TopicResponse> response = new PaginatedResponse<>(
            items,
            page,
            limit,
            (int) paged.count(),
            paged.pageCount()
        );

        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        return Response.ok(topicMapper.toResponse(topicService.findById(id))).build();
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid TopicRequest dto) {
        return Response.status(201)
            .entity(topicMapper.toResponse(topicService.create(dto)))
            .build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response update(@PathParam("id") Long id, @Valid TopicRequest dto) {
        return Response.ok(topicMapper.toResponse(topicService.update(id, dto))).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response delete(@PathParam("id") Long id) {
        topicService.delete(id);
        return Response.noContent().build();
    }
}
