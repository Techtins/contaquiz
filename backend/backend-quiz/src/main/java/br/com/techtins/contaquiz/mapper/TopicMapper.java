package br.com.techtins.contaquiz.mapper;

import br.com.techtins.contaquiz.dto.topic.TopicRequest;
import br.com.techtins.contaquiz.dto.topic.TopicResponse;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.model.Topic;
import br.com.techtins.contaquiz.repository.DisciplineRepository;
import br.com.techtins.contaquiz.repository.TopicRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class TopicMapper {

    @Inject
    DisciplineRepository disciplineRepository;

    @Inject
    TopicRepository topicRepository;

    public Topic toEntity(TopicRequest dto) {
        Discipline discipline = disciplineRepository.findById(dto.disciplineId());
        if (discipline == null) {
            throw new IllegalArgumentException("Disciplina não encontrada: " + dto.disciplineId());
        }

        Topic topic = new Topic();
        topic.setName(dto.name());
        topic.setDiscipline(discipline);

        if (dto.parentTopicId() != null) {
            Topic parentTopic = topicRepository.findById(dto.parentTopicId());
            if (parentTopic == null) {
                throw new IllegalArgumentException("Tema pai não encontrado: " + dto.parentTopicId());
            }
            topic.setParentTopic(parentTopic);
        }

        return topic;
    }

    public TopicResponse toResponse(Topic topic) {
        return new TopicResponse(
            topic.getId(),
            topic.getName(),
            topic.getDiscipline().getId(),
            topic.getParentTopic() != null ? topic.getParentTopic().getId() : null,
            topic.getActive(),
            topic.getCreatedAt(),
            topic.getUpdatedAt()
        );
    }
}
