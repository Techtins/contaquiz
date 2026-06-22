package br.com.techtins.contaquiz.exception;

import br.com.techtins.contaquiz.dto.response.ApiError;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.LocalDateTime;

@Provider
public class BusinessExceptionMapper implements ExceptionMapper<BusinessException> {

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(BusinessException exception) {
        ApiError error = new ApiError();
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(422);
        error.setError("Business Rule Violation");
        error.setMessage(exception.getMessage());
        error.setPath(uriInfo.getPath());

        return Response.status(422)
                       .entity(error)
                       .build();
    }
}
