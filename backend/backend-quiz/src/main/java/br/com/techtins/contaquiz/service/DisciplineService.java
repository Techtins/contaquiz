package br.com.techtins.contaquiz.service;

import br.com.techtins.contaquiz.dto.discipline.DisciplineRequest;
import br.com.techtins.contaquiz.exception.BusinessException;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.repository.DisciplineRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DisciplineService {

    @Inject
    private DisciplineRepository disciplineRepository;

    public PanacheQuery<Discipline> findAll(String filter, Boolean active) {
        return disciplineRepository.findByFilter(filter, active);
    }

    public Discipline findById(Long id) {
        Discipline discipline = disciplineRepository.findById(id);
        if (discipline == null) {
            throw new ResourceNotFoundException("Disciplina não encontrada: " + id);
        }
        return discipline;
    }

    @Transactional
    public Discipline create(DisciplineRequest dto) {
        if (disciplineRepository.findByName(dto.name()) != null) {
            throw new BusinessException("Já existe uma disciplina com este nome");
        }
        Discipline discipline = new Discipline();
        discipline.setName(dto.name());
        discipline.setDescription(dto.description());
        discipline.setActive(dto.active() != null ? dto.active() : true);
        disciplineRepository.persist(discipline);
        return discipline;
    }

    @Transactional
    public Discipline update(Long id, DisciplineRequest dto) {
        Discipline discipline = findById(id);
        Discipline existing = disciplineRepository.findByName(dto.name());
        if (existing != null && !existing.getId().equals(id)) {
            throw new BusinessException("Já existe uma disciplina com este nome");
        }
        discipline.setName(dto.name());
        discipline.setDescription(dto.description());
        if (dto.active() != null) {
            discipline.setActive(dto.active());
        }
        return discipline;
    }

    @Transactional
    public void delete(Long id) {
        Discipline discipline = findById(id);
        discipline.setActive(false);
    }
}
