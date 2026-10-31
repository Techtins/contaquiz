package br.com.techtins.contaquiz.mapper;

import br.com.techtins.contaquiz.dto.discipline.DisciplineRequest;
import br.com.techtins.contaquiz.dto.discipline.DisciplineResponse;
import br.com.techtins.contaquiz.model.Discipline;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DisciplineMapper {

    public Discipline toEntity(DisciplineRequest dto) {
        Discipline discipline = new Discipline();
        discipline.setName(dto.name());
        discipline.setDescription(dto.description());
        return discipline;
    }

    public DisciplineResponse toResponse(Discipline discipline) {
        return new DisciplineResponse(
            discipline.getId(),
            discipline.getName(),
            discipline.getDescription(),
            discipline.getActive(),
            discipline.getCreatedAt(),
            discipline.getUpdatedAt()
        );
    }
}
