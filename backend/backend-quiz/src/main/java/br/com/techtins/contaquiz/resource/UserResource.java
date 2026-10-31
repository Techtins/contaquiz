package br.com.techtins.contaquiz.resource;

import java.util.List;

import br.com.techtins.contaquiz.dto.user.UserRequest;
import br.com.techtins.contaquiz.dto.user.UserResponse;
import br.com.techtins.contaquiz.mapper.UserMapper;
import br.com.techtins.contaquiz.service.UserService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserService userService;

    @Inject
    UserMapper userMapper;

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        UserResponse user = userMapper.toResponse(userService.findById(id));
        return Response.ok(user).build();
    }

    @GET
    @Path("/email/{email}")
    public Response findByEmail(@PathParam("email") String email) {
        UserResponse user = userMapper.toResponse(userService.findByEmail(email));
        return Response.ok(user).build();
    }

    @GET
    public Response findAll() {
        List<UserResponse> users = userService.findAll()
            .stream()
            .map(userMapper::toResponse)
            .toList();
        return Response.ok(users).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid UserRequest dto) {
        userService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        userService.delete(id);
        return Response.noContent().build();
    }
}
