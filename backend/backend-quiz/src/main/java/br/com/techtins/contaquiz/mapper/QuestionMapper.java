package br.com.techtins.contaquiz.mapper;

import br.com.techtins.contaquiz.dto.question.QuestionOptionRequest;
import br.com.techtins.contaquiz.dto.question.QuestionOptionResponse;
import br.com.techtins.contaquiz.dto.question.QuestionRequest;
import br.com.techtins.contaquiz.dto.question.QuestionResponse;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.model.Question;
import br.com.techtins.contaquiz.model.QuestionOption;
import br.com.techtins.contaquiz.model.Topic;
import br.com.techtins.contaquiz.repository.DisciplineRepository;
import br.com.techtins.contaquiz.repository.TopicRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class QuestionMapper {

    @Inject
    DisciplineRepository disciplineRepository;

    @Inject
    TopicRepository topicRepository;

    public Question toEntity(QuestionRequest dto) {
        Discipline discipline = disciplineRepository.findById(dto.disciplineId());
        if (discipline == null) {
            throw new IllegalArgumentException("Disciplina não encontrada: " + dto.disciplineId());
        }

        Question question = new Question();
        question.setStatement(dto.statement());
        question.setType(dto.type());
        question.setDifficulty(dto.difficulty());
        question.setExplanation(dto.explanation());
        question.setDiscipline(discipline);
        question.setActive(dto.active() != null ? dto.active() : true);

        List<QuestionOption> options = new ArrayList<>();
        for (QuestionOptionRequest optDto : dto.options()) {
            QuestionOption option = new QuestionOption();
            option.setText(optDto.text());
            option.setIsCorrect(optDto.isCorrect());
            option.setQuestion(question);
            options.add(option);
        }
        question.setOptions(options);

        if (dto.topicIds() != null && !dto.topicIds().isEmpty()) {
            Set<Topic> topics = new HashSet<>();
            for (Long topicId : dto.topicIds()) {
                Topic topic = topicRepository.findById(topicId);
                if (topic == null) {
                    throw new IllegalArgumentException("Tema não encontrado: " + topicId);
                }
                topics.add(topic);
            }
            question.setTopics(topics);
        }

        return question;
    }

    public QuestionResponse toResponse(Question question) {
        List<QuestionOptionResponse> optionResponses = question.getOptions().stream()
            .map(opt -> new QuestionOptionResponse(opt.getId(), opt.getText(), opt.getIsCorrect()))
            .toList();

        List<Long> topicIds = question.getTopics().stream()
            .map(Topic::getId)
            .toList();

        return new QuestionResponse(
            question.getId(),
            question.getStatement(),
            question.getType(),
            question.getDifficulty(),
            question.getExplanation(),
            question.getDiscipline().getId(),
            question.getTimesAnswered(),
            question.getTimesCorrect(),
            question.getActive(),
            question.getCreatedAt(),
            question.getUpdatedAt(),
            optionResponses,
            topicIds
        );
    }
}
