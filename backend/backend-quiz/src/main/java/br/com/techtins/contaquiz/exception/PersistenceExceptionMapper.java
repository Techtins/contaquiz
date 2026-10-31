package br.com.techtins.contaquiz.exception;

import br.com.techtins.contaquiz.dto.response.ApiError;
import jakarta.persistence.PersistenceException;
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
public class PersistenceExceptionMapper implements ExceptionMapper<PersistenceException> {

    private static final Logger LOG = Logger.getLogger(PersistenceExceptionMapper.class.getName());

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(PersistenceException exception) {
        LOG.log(Level.WARNING, "Persistence exception at " + uriInfo.getPath(), exception);

        String message = buildMessage(exception);

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

    private String buildMessage(PersistenceException exception) {
        Throwable cause = exception.getCause();
        while (cause != null) {
            if (cause instanceof ConstraintViolationException cve) {
                String constraintName = cve.getConstraintName();
                if (constraintName != null && !constraintName.isBlank()) {
                    return "Violação de restrição de integridade: '" + constraintName
                        + "'. Verifique se os dados enviados são válidos.";
                }
            }
            cause = cause.getCause();
        }
        return "Erro de integridade dos dados. Verifique os valores enviados e tente novamente.";
    }
}
