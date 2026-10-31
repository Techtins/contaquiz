package br.com.techtins.contaquiz.exception;

import br.com.techtins.contaquiz.dto.response.ApiError;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.LocalDateTime;

@Provider
public class NotAuthorizedExceptionMapper implements ExceptionMapper<NotAuthorizedException> {

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(NotAuthorizedException exception) {
        ApiError error = new ApiError();
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(Response.Status.UNAUTHORIZED.getStatusCode());
        error.setError("Unauthorized");
        error.setMessage(exception.getMessage());
        error.setPath(uriInfo.getPath());

        return Response.status(Response.Status.UNAUTHORIZED)
                       .entity(error)
                       .build();
    }
}
