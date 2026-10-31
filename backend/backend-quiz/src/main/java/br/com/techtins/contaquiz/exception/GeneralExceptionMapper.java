package br.com.techtins.contaquiz.exception;

import br.com.techtins.contaquiz.dto.response.ApiError;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

@Provider
public class GeneralExceptionMapper implements ExceptionMapper<Exception> {

    private static final Logger LOG = Logger.getLogger(GeneralExceptionMapper.class.getName());

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(Exception exception) {
        String traceId = UUID.randomUUID().toString().substring(0, 8);

        LOG.log(Level.SEVERE, "Unhandled exception at " + uriInfo.getPath()
            + " [traceId=" + traceId + "]", exception);

        ApiError error = new ApiError();
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
        error.setError("Internal Server Error");
        error.setMessage("An unexpected error occurred. Please try again later. (traceId: " + traceId + ")");
        error.setPath(uriInfo.getPath());

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                       .entity(error)
                       .build();
    }
}
