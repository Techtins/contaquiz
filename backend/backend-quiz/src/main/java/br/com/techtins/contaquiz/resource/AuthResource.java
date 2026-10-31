package br.com.techtins.contaquiz.resource;

import java.util.Map;

import br.com.techtins.contaquiz.dto.auth.AuthRequest;
import br.com.techtins.contaquiz.dto.auth.AuthResponse;
import br.com.techtins.contaquiz.dto.auth.RegisterRequest;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.mapper.UserMapper;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.UserRepository;
import br.com.techtins.contaquiz.service.AuthService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    
    @Inject
    AuthService authService;

    @Inject
    JsonWebToken jwt;

    @Inject
    UserRepository userRepository;

    @Inject
    UserMapper userMapper;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest dto) {
        AuthResponse response = authService.registerWithToken(dto);
        return Response.status(201).entity(response).build();
    }

    @POST
    @Path("/login")
    public Response login(@Valid AuthRequest dto) {
        AuthResponse response = authService.login(dto);
        return Response.ok(response).build();
    }

    @GET
    @Path("/me")
    @RolesAllowed({"ADMIN", "ALUNO"})
    public Response me() {
        String email = jwt.getName();
        User user = userRepository.findByEmail(email).firstResult();

        if (user == null) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }

        return Response.ok(Map.of("data", userMapper.toResponse(user))).build();
    }
}
