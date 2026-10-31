package br.com.techtins.contaquiz.converter;

import br.com.techtins.contaquiz.model.SystemRole;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter( autoApply = true)
public class SystemRoleConverter implements AttributeConverter<SystemRole, Long> {

    @Override
    public Long convertToDatabaseColumn(SystemRole role) {
        return role == null ? null : role.getID();
    }

    @Override
    public SystemRole convertToEntityAttribute(Long id) {
        return SystemRole.valueOf(id);
    }
    
}
