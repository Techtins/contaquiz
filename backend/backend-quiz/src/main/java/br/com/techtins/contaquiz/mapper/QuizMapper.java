package br.com.techtins.contaquiz.mapper;

import br.com.techtins.contaquiz.dto.question.QuestionResponse;
import br.com.techtins.contaquiz.dto.quiz.QuizRequest;
import br.com.techtins.contaquiz.dto.quiz.QuizResponse;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.model.Question;
import br.com.techtins.contaquiz.model.Quiz;
import br.com.techtins.contaquiz.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class QuizMapper {

    @Inject
    QuestionMapper questionMapper;

    public Quiz toEntity(QuizRequest dto, User createdBy, Discipline discipline, Set<Question> questions) {
        Quiz quiz = new Quiz();
        quiz.setTitle(dto.title());
        quiz.setDescription(dto.description());
        quiz.setTimeLimitSeconds(dto.timeLimitSeconds());
        quiz.setPassingScore(dto.score() != null ? dto.score() : 0);
        quiz.setVisibility(dto.visibility() != null ? dto.visibility() : br.com.techtins.contaquiz.model.QuizVisibility.PUBLIC);
        quiz.setDiscipline(discipline);
        quiz.setCreatedByUser(createdBy);
        quiz.setQuestions(questions != null ? questions : new HashSet<>());
        quiz.setActive(dto.active() != null ? dto.active() : true);
        return quiz;
    }

    public void updateEntity(Quiz quiz, QuizRequest dto, Discipline discipline, Set<Question> questions) {
        quiz.setTitle(dto.title());
        quiz.setDescription(dto.description());
        quiz.setTimeLimitSeconds(dto.timeLimitSeconds());
        quiz.setPassingScore(dto.score() != null ? dto.score() : 0);
        if (dto.visibility() != null) {
            quiz.setVisibility(dto.visibility());
        }
        if (discipline != null) {
            quiz.setDiscipline(discipline);
        }
        if (questions != null) {
            quiz.getQuestions().clear();
            quiz.setQuestions(questions);
        }
        if (dto.active() != null) {
            quiz.setActive(dto.active());
        }
    }

    public QuizResponse toResponse(Quiz quiz) {
        List<QuestionResponse> questionResponses = quiz.getQuestions().stream()
            .map(questionMapper::toResponse)
            .toList();

        return new QuizResponse(
            quiz.getId(),
            quiz.getTitle(),
            quiz.getDescription(),
            quiz.getDiscipline() != null ? quiz.getDiscipline().getId() : null,
            questionResponses,
            quiz.getCreatedByUser() != null ? quiz.getCreatedByUser().getId() : null,
            quiz.getTimeLimitSeconds(),
            quiz.getPassingScore(),
            quiz.getVisibility(),
            quiz.getActive(),
            quiz.getCreatedAt(),
            quiz.getUpdatedAt()
        );
    }
}
