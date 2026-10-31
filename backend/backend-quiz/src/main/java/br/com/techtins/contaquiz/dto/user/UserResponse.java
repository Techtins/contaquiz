package br.com.techtins.contaquiz.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import br.com.techtins.contaquiz.model.SystemRole;
import java.time.LocalDateTime;

public record UserResponse(
    @JsonProperty("_id") Long id,
    String name,
    String email,
    @JsonProperty("systemRole") SystemRole role,
    Boolean active,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime createdAt,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC") LocalDateTime updatedAt
) {

}
