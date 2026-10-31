package br.com.techtins.contaquiz.exception;

import br.com.techtins.contaquiz.dto.response.ApiError;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.hibernate.exception.ConstraintViolationException;

import java.time.LocalDateTime;
import java.util.logging.Level;
import java.util.logging.Logger;

@Provider
public class ConstraintViolationMapper implements ExceptionMapper<ConstraintViolationException> {

    private static final Logger LOG = Logger.getLogger(ConstraintViolationMapper.class.getName());

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        LOG.log(Level.WARNING, "Constraint violation at " + uriInfo.getPath(), exception);

        String constraintName = exception.getConstraintName();
        String message;
        if (constraintName != null && !constraintName.isBlank()) {
            message = "Violação de integridade: '" + constraintName
                + "'. Verifique se os dados enviados são válidos.";
        } else {
            message = "Violação de integridade dos dados. Verifique os valores enviados.";
        }

        ApiError error = new ApiError();
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(422);
        error.setError("Data Integrity Violation");
        error.setMessage(message);
        error.setPath(uriInfo.getPath());

        return Response.status(422)
                       .entity(error)
                       .build();
    }
}
