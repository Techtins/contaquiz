package br.com.techtins.contaquiz.exception;

import br.com.techtins.contaquiz.dto.response.ApiError;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Provider
public class ValidationExceptionMapper implements ExceptionMapper<ValidationException> {

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(ValidationException exception) {
        String message = exception.getMessage();

        if (exception instanceof ConstraintViolationException cve) {
            message = cve.getConstraintViolations().stream()
                    .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                    .collect(Collectors.joining(", "));
        }

        ApiError error = new ApiError();
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(Response.Status.BAD_REQUEST.getStatusCode());
        error.setError("Validation Error");
        error.setMessage(message);
        error.setPath(uriInfo.getPath());

        return Response.status(Response.Status.BAD_REQUEST)
                       .entity(error)
                       .build();
    }
}
