package br.com.techtins.contaquiz.service;

import br.com.techtins.contaquiz.dto.quiz.GenerateQuizRequest;
import br.com.techtins.contaquiz.dto.quiz.QuizRequest;
import br.com.techtins.contaquiz.dto.quiz.QuizResultResponse;
import br.com.techtins.contaquiz.exception.BusinessException;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.mapper.QuizMapper;
import br.com.techtins.contaquiz.mapper.QuizResultMapper;
import br.com.techtins.contaquiz.model.DifficultyLevel;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.model.Question;
import br.com.techtins.contaquiz.model.QuestionOption;
import br.com.techtins.contaquiz.model.Quiz;
import br.com.techtins.contaquiz.model.QuizResult;
import br.com.techtins.contaquiz.model.QuizResultCorrection;
import br.com.techtins.contaquiz.model.QuizVisibility;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.DisciplineRepository;
import br.com.techtins.contaquiz.repository.QuestionRepository;
import br.com.techtins.contaquiz.repository.QuizRepository;
import br.com.techtins.contaquiz.repository.QuizResultRepository;
import br.com.techtins.contaquiz.repository.UserRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Hibernate;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class QuizService {

    private static final int DEFAULT_QUESTION_COUNT = 10;

    @Inject
    QuizRepository quizRepository;

    @Inject
    DisciplineRepository disciplineRepository;

    @Inject
    QuestionRepository questionRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    QuizMapper quizMapper;

    @Inject
    QuizResultRepository quizResultRepository;

    @Inject
    QuizResultMapper quizResultMapper;

    @PersistenceContext
    EntityManager entityManager;

    public PanacheQuery<Quiz> findAll(String title, Long disciplineId, Long currentUserId) {
        StringBuilder jpql = new StringBuilder("SELECT q FROM Quiz q WHERE 1=1");
        Map<String, Object> params = new HashMap<>();

        if (title != null && !title.isBlank()) {
            jpql.append(" AND LOWER(q.title) LIKE LOWER(:title)");
            params.put("title", "%" + title + "%");
        }

        if (disciplineId != null) {
            jpql.append(" AND q.discipline.id = :disciplineId");
            params.put("disciplineId", disciplineId);
        }

        if (currentUserId != null) {
            jpql.append(" AND (q.visibility = 'PUBLIC' OR (q.visibility = 'PRIVATE' AND q.createdByUser.id = :currentUserId))");
            params.put("currentUserId", currentUserId);
        } else {
            jpql.append(" AND q.visibility = 'PUBLIC'");
        }

        return quizRepository.find(jpql.toString(), params);
    }

    public Quiz findById(Long id) {
        Quiz quiz = quizRepository.findById(id);
        if (quiz == null) {
            throw new ResourceNotFoundException("Quiz não encontrado: " + id);
        }
        return quiz;
    }

    @Transactional
    public Quiz create(QuizRequest dto, Long adminUserId) {
        if (quizRepository.findByTitle(dto.title()) != null) {
            throw new BusinessException("Já existe um quiz com este título");
        }

        User admin = userRepository.findById(adminUserId);
        if (admin == null) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + adminUserId);
        }

        Discipline discipline = null;
        if (dto.disciplineId() != null) {
            discipline = disciplineRepository.findById(dto.disciplineId());
            if (discipline == null) {
                throw new ResourceNotFoundException("Disciplina não encontrada: " + dto.disciplineId());
            }
        }

        Set<Question> questions = new HashSet<>();
        if (dto.questionIds() != null && !dto.questionIds().isEmpty()) {
            for (Long questionId : dto.questionIds()) {
                Question question = questionRepository.findById(questionId);
                if (question == null) {
                    throw new ResourceNotFoundException("Questão não encontrada: " + questionId);
                }
                Hibernate.initialize(question.getOptions());
                Hibernate.initialize(question.getTopics());
                questions.add(question);
            }
        }

        Quiz quiz = quizMapper.toEntity(dto, admin, discipline, questions);
        quizRepository.persist(quiz);
        return quiz;
    }

    /**
     * Gera dinamicamente um quiz com seleção randômica de questões e
     * distribuição proporcional entre os tópicos solicitados.
     */
    @Transactional
    public Quiz generate(GenerateQuizRequest dto, Long userId) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + userId);
        }

        int questionCount = dto.questionCount() != null ? dto.questionCount() : DEFAULT_QUESTION_COUNT;
        if (questionCount <= 0) {
            throw new BusinessException("questionCount deve ser maior que zero");
        }

        boolean mixedDifficulty = dto.mixedDifficulty() != null && dto.mixedDifficulty();

        Discipline discipline = null;
        if (dto.disciplineId() != null) {
            discipline = disciplineRepository.findById(dto.disciplineId());
            if (discipline == null) {
                throw new ResourceNotFoundException("Disciplina não encontrada: " + dto.disciplineId());
            }
        }

        Set<Question> selectedQuestions = selectQuestions(
            dto.topicIds(), questionCount, dto.difficulty(), mixedDifficulty,
            dto.disciplineId()
        );

        if (selectedQuestions.isEmpty()) {
            throw new BusinessException("Não há questões suficientes para gerar o quiz com os filtros informados");
        }

        // Initialize lazy collections for JSON serialization
        for (Question q : selectedQuestions) {
            Hibernate.initialize(q.getOptions());
            Hibernate.initialize(q.getTopics());
        }

        if(dto.title() == null || dto.title().isBlank()) {
            throw new BusinessException("O título do quiz não pode ser vazio");
        }
        else if (quizRepository.findByTitle(dto.title()) != null) {
            throw new BusinessException("Já existe um quiz com este título");
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(dto.title());
        quiz.setDescription(dto.description());
        quiz.setTimeLimitSeconds(dto.timeLimitSeconds());
        quiz.setPassingScore(dto.score() != null ? dto.score() : 0);
        quiz.setVisibility(QuizVisibility.PRIVATE);
        quiz.setDiscipline(discipline);
        quiz.setCreatedByUser(user);
        quiz.setQuestions(selectedQuestions);
        quiz.setActive(true);

        quizRepository.persist(quiz);
        return quiz;
    }

    /**
     * Algoritmo de distribuição proporcional e justa por tema.
     *
     * Se topicIds for vazio/nulo: busca N questões aleatórias diretamente.
     * Caso contrário: distribui N igualmente entre os tópicos, compensando
     * shortfalls quando um tópico não tem questões suficientes.
     */
    private Set<Question> selectQuestions(List<Long> topicIds, int questionCount,
                                          DifficultyLevel difficulty,
                                          boolean mixedDifficulty, Long disciplineId) {
        Set<Question> allQuestions = new HashSet<>();

        // Case A: No topicIds — fetch random questions directly
        if (topicIds == null || topicIds.isEmpty()) {
            List<Question> random = questionRepository.findRandomGeneral(
                questionCount, difficulty, mixedDifficulty, disciplineId);
            allQuestions.addAll(random);
            return allQuestions;
        }

        // Case B: Proportional distribution across topics
        int k = topicIds.size();
        int baseCount = questionCount / k;
        int remainder = questionCount % k;

        // Phase 1: Count available questions per topic
        Map<Long, Long> availablePerTopic = new LinkedHashMap<>();
        for (Long topicId : topicIds) {
            long count = questionRepository.countByFilters(
                List.of(topicId), difficulty, mixedDifficulty, disciplineId);
            availablePerTopic.put(topicId, count);
        }

        // Phase 2: First allocation pass — baseCount + remainder distribution
        Map<Long, Integer> allocatedPerTopic = new LinkedHashMap<>();
        int totalAllocated = 0;
        int rem = remainder;

        for (Long topicId : topicIds) {
            long available = availablePerTopic.get(topicId);
            int target = baseCount + (rem > 0 ? 1 : 0);
            if (rem > 0) rem--;

            int actual = (int) Math.min(available, target);
            allocatedPerTopic.put(topicId, actual);
            totalAllocated += actual;
        }

        // Phase 3: Compensation loop — redistribute shortfall among topics with extra capacity
        int remaining = questionCount - totalAllocated;
        while (remaining > 0) {
            // Find eligible topics that still have available questions
            List<Long> eligibleTopics = new ArrayList<>();
            for (Long topicId : topicIds) {
                long available = availablePerTopic.get(topicId);
                int allocated = allocatedPerTopic.get(topicId);
                if (allocated < available) {
                    eligibleTopics.add(topicId);
                }
            }

            if (eligibleTopics.isEmpty()) {
                break; // No more questions to fetch
            }

            // Distribute remaining evenly among eligible topics
            int extraBase = remaining / eligibleTopics.size();
            int extraRem = remaining % eligibleTopics.size();

            for (Long topicId : eligibleTopics) {
                long available = availablePerTopic.get(topicId);
                int alreadyAllocated = allocatedPerTopic.get(topicId);
                long canTake = available - alreadyAllocated;
                int wantToTake = extraBase + (extraRem > 0 ? 1 : 0);
                if (extraRem > 0) extraRem--;

                int actualExtra = (int) Math.min(canTake, wantToTake);
                allocatedPerTopic.put(topicId, alreadyAllocated + actualExtra);
                totalAllocated += actualExtra;
            }

            remaining = questionCount - totalAllocated;
        }

        // Phase 4: Fetch random questions for each topic based on final allocation
        for (Long topicId : topicIds) {
            int allocation = allocatedPerTopic.get(topicId);
            if (allocation > 0) {
                List<Question> topicQuestions = questionRepository.findRandomByFilters(
                    List.of(topicId), allocation, difficulty, mixedDifficulty, disciplineId);
                allQuestions.addAll(topicQuestions);
            }
        }

        return allQuestions;
    }

    @Transactional
    public Quiz update(Long id, QuizRequest dto) {
        Quiz quiz = findById(id);

        Quiz existing = quizRepository.findByTitle(dto.title());
        if (existing != null && !existing.getId().equals(id)) {
            throw new BusinessException("Já existe um quiz com este título");
        }

        Discipline discipline = null;
        if (dto.disciplineId() != null) {
            discipline = disciplineRepository.findById(dto.disciplineId());
            if (discipline == null) {
                throw new ResourceNotFoundException("Disciplina não encontrada: " + dto.disciplineId());
            }
        }

        Set<Question> questions = null;
        if (dto.questionIds() != null) {
            questions = new HashSet<>();
            for (Long questionId : dto.questionIds()) {
                Question question = questionRepository.findById(questionId);
                if (question == null) {
                    throw new ResourceNotFoundException("Questão não encontrada: " + questionId);
                }
                Hibernate.initialize(question.getOptions());
                Hibernate.initialize(question.getTopics());
                questions.add(question);
            }
        }

        quizMapper.updateEntity(quiz, dto, discipline, questions);
        return quiz;
    }

    @Transactional
    public void delete(Long id) {
        Quiz quiz = findById(id);
        quiz.setActive(false);
    }

    /**
     * Submete as respostas de um quiz, realiza correção automática,
     * persiste o resultado com snapshot da explicação e incrementa
     * os contadores globais das questões de forma atômica.
     *
     * @param quizId              ID do quiz
     * @param answers             Mapa { questionId -> selectedOptionIndex }
     * @param timeSpentInSeconds  Tempo gasto em segundos (opcional)
     * @param userId              ID do usuário logado
     * @return QuizResultResponse com correções detalhadas
     */
    @Transactional
    public QuizResultResponse submit(Long quizId, Map<Long, Integer> answers,
                                      Integer timeSpentInSeconds, Long userId) {
        Quiz quiz = quizRepository.findById(quizId);
        if (quiz == null) {
            throw new ResourceNotFoundException("Quiz não encontrado: " + quizId);
        }

        User user = userRepository.findById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + userId);
        }

        // Força o carregamento das questões e suas opções
        Hibernate.initialize(quiz.getQuestions());
        Set<Question> questions = quiz.getQuestions();

        if (questions.isEmpty()) {
            throw new BusinessException("Quiz não possui questões cadastradas");
        }

        int correctCount = 0;
        int totalQuestions = questions.size();
        List<QuizResultCorrection> corrections = new ArrayList<>();

        for (Question question : questions) {
            Hibernate.initialize(question.getOptions());

            Integer userAnswer = answers != null ? answers.get(question.getId()) : null;

            // Encontra o índice da opção correta
            List<QuestionOption> options = question.getOptions();
            int correctAnswer = -1;
            for (int i = 0; i < options.size(); i++) {
                if (Boolean.TRUE.equals(options.get(i).getIsCorrect())) {
                    correctAnswer = i;
                    break;
                }
            }

            boolean isCorrect = userAnswer != null && correctAnswer >= 0
                && userAnswer.intValue() == correctAnswer;

            if (isCorrect) {
                correctCount++;
            }

            // Cria a correção com snapshot da explicação
            QuizResultCorrection correction = new QuizResultCorrection();
            correction.setQuestion(question);
            correction.setUserAnswer(userAnswer);
            correction.setCorrectAnswer(correctAnswer);
            correction.setCorrect(isCorrect);
            correction.setExplanationSnapshot(question.getExplanation());

            corrections.add(correction);
        }

        int wrongCount = totalQuestions - correctCount;

        // Monta e persiste o resultado consolidado
        QuizResult result = new QuizResult();
        result.setUser(user);
        result.setQuiz(quiz);
        result.setCorrectAnswers(correctCount);
        result.setWrongAnswers(wrongCount);
        result.setTotalQuestions(totalQuestions);
        result.setTimeSpentInSeconds(timeSpentInSeconds != null ? timeSpentInSeconds : 0);
        result.setPassingScore(quiz.getPassingScore() != null ? quiz.getPassingScore() : 0);
        result.calculatePercentage();

        for (QuizResultCorrection correction : corrections) {
            result.addCorrection(correction);
        }

        quizResultRepository.persist(result);

        // Incrementa os contadores das questões de forma atômica (thread-safe)
        for (QuizResultCorrection correction : corrections) {
            int correctInc = correction.isCorrect() ? 1 : 0;
            entityManager.createQuery(
                "UPDATE Question q SET q.timesAnswered = q.timesAnswered + 1, " +
                "q.timesCorrect = q.timesCorrect + :correctInc WHERE q.id = :id")
                .setParameter("correctInc", correctInc)
                .setParameter("id", correction.getQuestion().getId())
                .executeUpdate();
        }

        return quizResultMapper.toResponse(result);
    }
}
