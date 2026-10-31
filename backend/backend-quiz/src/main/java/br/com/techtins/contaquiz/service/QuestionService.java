package br.com.techtins.contaquiz.service;

import br.com.techtins.contaquiz.dto.question.QuestionOptionRequest;
import br.com.techtins.contaquiz.dto.question.QuestionRequest;
import br.com.techtins.contaquiz.exception.BusinessException;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.mapper.QuestionMapper;
import br.com.techtins.contaquiz.model.DifficultyLevel;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.model.Question;
import br.com.techtins.contaquiz.model.QuestionType;
import br.com.techtins.contaquiz.model.Topic;
import br.com.techtins.contaquiz.repository.DisciplineRepository;
import br.com.techtins.contaquiz.repository.QuestionRepository;
import br.com.techtins.contaquiz.repository.TopicRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class QuestionService {

    @Inject
    QuestionRepository questionRepository;

    @Inject
    DisciplineRepository disciplineRepository;

    @Inject
    TopicRepository topicRepository;

    @Inject
    QuestionMapper questionMapper;

    public PanacheQuery<Question> findAll(String statement, QuestionType type, DifficultyLevel difficulty,
                                          Long disciplineId, List<Long> topicIds, Boolean active) {
        StringBuilder jpql = new StringBuilder("SELECT q FROM Question q WHERE 1=1");
        Map<String, Object> params = new HashMap<>();

        if (statement != null && !statement.isBlank()) {
            jpql.append(" AND LOWER(q.statement) LIKE LOWER(:statement)");
            params.put("statement", "%" + statement + "%");
        }

        if (type != null) {
            jpql.append(" AND q.type = :type");
            params.put("type", type);
        }

        if (difficulty != null) {
            jpql.append(" AND q.difficulty = :difficulty");
            params.put("difficulty", difficulty);
        }

        if (disciplineId != null) {
            jpql.append(" AND q.discipline.id = :disciplineId");
            params.put("disciplineId", disciplineId);
        }

        if (topicIds != null && !topicIds.isEmpty()) {
            jpql.append(" AND EXISTS (SELECT 1 FROM Question q2 JOIN q2.topics t WHERE t.id IN :topicIds AND q2.id = q.id)");
            params.put("topicIds", topicIds);
        }

        if (active != null) {
            jpql.append(" AND q.active = :active");
            params.put("active", active);
        }

        return questionRepository.find(jpql.toString(), params);
    }

    public Question findById(Long id) {
        Question question = questionRepository.findById(id);
        if (question == null) {
            throw new ResourceNotFoundException("Questão não encontrada: " + id);
        }
        return question;
    }

    @Transactional
    public Question create(QuestionRequest dto) {
        validateOptions(dto.type(), dto.options());

        Discipline discipline = disciplineRepository.findById(dto.disciplineId());
        if (discipline == null) {
            throw new ResourceNotFoundException("Disciplina não encontrada: " + dto.disciplineId());
        }

        Question question = new Question();
        question.setStatement(dto.statement());
        question.setType(dto.type());
        question.setDifficulty(dto.difficulty());
        question.setExplanation(dto.explanation());
        question.setDiscipline(discipline);
        question.setActive(dto.active() != null ? dto.active() : true);
        question.setTimesAnswered(0);
        question.setTimesCorrect(0);

        List<QuestionOptionRequest> optionDtos = dto.options();
        var options = new ArrayList<br.com.techtins.contaquiz.model.QuestionOption>();
        for (int i = 0; i < optionDtos.size(); i++) {
            var optDto = optionDtos.get(i);
            var option = new br.com.techtins.contaquiz.model.QuestionOption();
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
                    throw new ResourceNotFoundException("Tema não encontrado: " + topicId);
                }
                topics.add(topic);
            }
            question.setTopics(topics);
        }

        questionRepository.persist(question);
        return question;
    }

    @Transactional
    public Question update(Long id, QuestionRequest dto) {
        validateOptions(dto.type(), dto.options());

        Question question = findById(id);

        Discipline discipline = disciplineRepository.findById(dto.disciplineId());
        if (discipline == null) {
            throw new ResourceNotFoundException("Disciplina não encontrada: " + dto.disciplineId());
        }

        question.setStatement(dto.statement());
        question.setType(dto.type());
        question.setDifficulty(dto.difficulty());
        question.setExplanation(dto.explanation());
        question.setDiscipline(discipline);
        if (dto.active() != null) {
            question.setActive(dto.active());
        }

        question.getOptions().clear();
        List<QuestionOptionRequest> optionDtos = dto.options();
        var options = new ArrayList<br.com.techtins.contaquiz.model.QuestionOption>();
        for (int i = 0; i < optionDtos.size(); i++) {
            var optDto = optionDtos.get(i);
            var option = new br.com.techtins.contaquiz.model.QuestionOption();
            option.setText(optDto.text());
            option.setIsCorrect(optDto.isCorrect());
            option.setQuestion(question);
            options.add(option);
        }
        question.setOptions(options);

        question.getTopics().clear();
        if (dto.topicIds() != null && !dto.topicIds().isEmpty()) {
            Set<Topic> topics = new HashSet<>();
            for (Long topicId : dto.topicIds()) {
                Topic topic = topicRepository.findById(topicId);
                if (topic == null) {
                    throw new ResourceNotFoundException("Tema não encontrado: " + topicId);
                }
                topics.add(topic);
            }
            question.setTopics(topics);
        }

        return question;
    }

    @Transactional
    public void delete(Long id) {
        Question question = findById(id);
        question.setActive(false);
    }

    private void validateOptions(QuestionType type, List<QuestionOptionRequest> options) {
        if (options == null || options.isEmpty()) {
            throw new BusinessException("A questão deve ter pelo menos uma alternativa");
        }

        long correctCount = options.stream().filter(QuestionOptionRequest::isCorrect).count();

        if (correctCount == 0) {
            throw new BusinessException("A questão deve ter exatamente uma alternativa correta");
        }

        if (correctCount > 1) {
            throw new BusinessException("A questão deve ter exatamente uma alternativa correta");
        }

        if (type == QuestionType.CERTO_ERRADO && options.size() != 2) {
            throw new BusinessException("Questão do tipo CERTO_ERRADO deve ter exatamente duas alternativas");
        }
    }
}
