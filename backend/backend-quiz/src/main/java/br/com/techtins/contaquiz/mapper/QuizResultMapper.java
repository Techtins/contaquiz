package br.com.techtins.contaquiz.mapper;

import br.com.techtins.contaquiz.dto.quiz.QuizCorrectionResponse;
import br.com.techtins.contaquiz.dto.quiz.QuizResultResponse;
import br.com.techtins.contaquiz.model.QuizResult;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class QuizResultMapper {

    public QuizResultResponse toResponse(QuizResult result) {
        List<QuizCorrectionResponse> correctionResponses = result.getCorrections().stream()
            .map(c -> new QuizCorrectionResponse(
                c.getQuestion().getId(),
                c.getUserAnswer(),
                c.getCorrectAnswer(),
                c.isCorrect(),
                c.getExplanationSnapshot()
            ))
            .toList();

        return new QuizResultResponse(
            result.getId(),
            result.getUser().getId(),
            result.getQuiz().getId(),
            result.getCorrectAnswers(),
            result.getWrongAnswers(),
            result.getTotalQuestions(),
            result.getPercentage(),
            result.getTimeSpentInSeconds(),
            result.getPassingScore(),
            correctionResponses,
            result.getCreatedAt()
        );
    }
}
