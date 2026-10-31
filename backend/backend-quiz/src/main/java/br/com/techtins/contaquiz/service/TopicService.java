package br.com.techtins.contaquiz.service;

import br.com.techtins.contaquiz.dto.topic.TopicRequest;
import br.com.techtins.contaquiz.exception.BusinessException;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.mapper.TopicMapper;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.model.Topic;
import br.com.techtins.contaquiz.repository.DisciplineRepository;
import br.com.techtins.contaquiz.repository.TopicRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class TopicService {

    @Inject
    TopicRepository topicRepository;

    @Inject
    DisciplineRepository disciplineRepository;

    @Inject
    TopicMapper topicMapper;

    public PanacheQuery<Topic> findAll(String filter, Boolean active, Long disciplineId) {
        StringBuilder query = new StringBuilder("1=1");
        java.util.Map<String, Object> params = new java.util.HashMap<>();

        if (filter != null && !filter.isBlank()) {
            query.append(" AND LOWER(name) LIKE LOWER(:filter)");
            params.put("filter", "%" + filter + "%");
        }

        if (active != null) {
            query.append(" AND active = :active");
            params.put("active", active);
        }

        if (disciplineId != null) {
            query.append(" AND discipline.id = :disciplineId");
            params.put("disciplineId", disciplineId);
        }

        return topicRepository.find(query.toString(), params);
    }

    public Topic findById(Long id) {
        Topic topic = topicRepository.findById(id);
        if (topic == null) {
            throw new ResourceNotFoundException("Tema não encontrado: " + id);
        }
        return topic;
    }

    @Transactional
    public Topic create(TopicRequest dto) {
        Discipline discipline = disciplineRepository.findById(dto.disciplineId());
        if (discipline == null) {
            throw new ResourceNotFoundException("Disciplina não encontrada: " + dto.disciplineId());
        }

        Topic topic = new Topic();
        topic.setName(dto.name());
        topic.setDiscipline(discipline);
        topic.setActive(true);

        if (dto.parentTopicId() != null) {
            Topic parentTopic = topicRepository.findById(dto.parentTopicId());
            if (parentTopic == null) {
                throw new ResourceNotFoundException("Tema pai não encontrado: " + dto.parentTopicId());
            }
            topic.setParentTopic(parentTopic);
        }

        topicRepository.persist(topic);
        return topic;
    }

    @Transactional
    public Topic update(Long id, TopicRequest dto) {
        Topic topic = findById(id);

        Discipline discipline = disciplineRepository.findById(dto.disciplineId());
        if (discipline == null) {
            throw new ResourceNotFoundException("Disciplina não encontrada: " + dto.disciplineId());
        }

        topic.setName(dto.name());
        topic.setDiscipline(discipline);

        if (dto.parentTopicId() != null) {
            if (dto.parentTopicId().equals(id)) {
                throw new BusinessException("Um tema não pode ser pai de si mesmo");
            }
            Topic parentTopic = topicRepository.findById(dto.parentTopicId());
            if (parentTopic == null) {
                throw new ResourceNotFoundException("Tema pai não encontrado: " + dto.parentTopicId());
            }
            topic.setParentTopic(parentTopic);
        } else {
            topic.setParentTopic(null);
        }

        return topic;
    }

    @Transactional
    public void delete(Long id) {
        Topic topic = findById(id);
        topic.setActive(false);
    }
}
