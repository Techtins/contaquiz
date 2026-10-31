package br.com.techtins.contaquiz.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_quiz_result")
public class QuizResult extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "correct_answers", nullable = false)
    private int correctAnswers;

    @Column(name = "wrong_answers", nullable = false)
    private int wrongAnswers;

    @Column(name = "total_questions", nullable = false)
    private int totalQuestions;

    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal percentage;

    @Column(name = "time_spent_in_seconds", nullable = false)
    private int timeSpentInSeconds;

    @Column(name = "passing_score", nullable = false)
    private int passingScore;

    @OneToMany(mappedBy = "result", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<QuizResultCorrection> corrections = new ArrayList<>();

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public int getWrongAnswers() {
        return wrongAnswers;
    }

    public void setWrongAnswers(int wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public int getTimeSpentInSeconds() {
        return timeSpentInSeconds;
    }

    public void setTimeSpentInSeconds(int timeSpentInSeconds) {
        this.timeSpentInSeconds = timeSpentInSeconds;
    }

    public int getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(int passingScore) {
        this.passingScore = passingScore;
    }

    public List<QuizResultCorrection> getCorrections() {
        return corrections;
    }

    public void setCorrections(List<QuizResultCorrection> corrections) {
        this.corrections = corrections;
    }

    public void addCorrection(QuizResultCorrection correction) {
        corrections.add(correction);
        correction.setResult(this);
    }

    /**
     * Calcula e atualiza a porcentagem de acertos com base nos valores atuais.
     */
    public void calculatePercentage() {
        if (totalQuestions > 0) {
            this.percentage = BigDecimal.valueOf(correctAnswers)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalQuestions), 2, RoundingMode.HALF_UP);
        } else {
            this.percentage = BigDecimal.ZERO;
        }
    }
}
