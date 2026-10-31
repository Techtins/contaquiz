package br.com.techtins.contaquiz.resource;

import br.com.techtins.contaquiz.dto.discipline.DisciplineRequest;
import br.com.techtins.contaquiz.dto.discipline.DisciplineResponse;
import br.com.techtins.contaquiz.dto.response.PaginatedResponse;
import br.com.techtins.contaquiz.mapper.DisciplineMapper;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.service.DisciplineService;
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

@Path("/api/disciplinas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DisciplineResource {

    @Inject
    DisciplineService disciplineService;

    @Inject
    DisciplineMapper disciplineMapper;

    @GET
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response findAll(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("10") int limit,
            @QueryParam("filter") String filter,
            @QueryParam("active") Boolean active) {

        PanacheQuery<Discipline> query = disciplineService.findAll(filter, active);

        var paged = query.page(page - 1, limit);

        var items = paged.list().stream()
            .map(disciplineMapper::toResponse)
            .toList();

        PaginatedResponse<DisciplineResponse> response = new PaginatedResponse<>(
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
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response findById(@PathParam("id") Long id) {
        return Response.ok(disciplineMapper.toResponse(disciplineService.findById(id))).build();
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid DisciplineRequest dto) {
        return Response.status(201)
            .entity(disciplineMapper.toResponse(disciplineService.create(dto)))
            .build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response update(@PathParam("id") Long id, @Valid DisciplineRequest dto) {
        return Response.ok(disciplineMapper.toResponse(disciplineService.update(id, dto))).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response delete(@PathParam("id") Long id) {
        disciplineService.delete(id);
        return Response.noContent().build();
    }
}
