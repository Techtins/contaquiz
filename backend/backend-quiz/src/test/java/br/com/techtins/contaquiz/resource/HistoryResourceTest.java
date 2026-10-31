package br.com.techtins.contaquiz.resource;

import br.com.techtins.contaquiz.model.DifficultyLevel;
import br.com.techtins.contaquiz.model.Discipline;
import br.com.techtins.contaquiz.model.Question;
import br.com.techtins.contaquiz.model.QuestionOption;
import br.com.techtins.contaquiz.model.QuestionType;
import br.com.techtins.contaquiz.model.Quiz;
import br.com.techtins.contaquiz.model.QuizResult;
import br.com.techtins.contaquiz.model.QuizResultCorrection;
import br.com.techtins.contaquiz.model.QuizVisibility;
import br.com.techtins.contaquiz.model.SystemRole;
import br.com.techtins.contaquiz.model.Topic;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.DisciplineRepository;
import br.com.techtins.contaquiz.repository.QuestionRepository;
import br.com.techtins.contaquiz.repository.QuizRepository;
import br.com.techtins.contaquiz.repository.QuizResultRepository;
import br.com.techtins.contaquiz.repository.TopicRepository;
import br.com.techtins.contaquiz.repository.UserRepository;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class HistoryResourceTest {

    private static final String ALUNO_EMAIL = "aluno_historico@quiz.com";
    private static final String OUTRO_ALUNO_EMAIL = "outro_aluno_historico@quiz.com";

    @Inject
    UserRepository userRepository;

    @Inject
    DisciplineRepository disciplineRepository;

    @Inject
    TopicRepository topicRepository;

    @Inject
    QuestionRepository questionRepository;

    @Inject
    QuizRepository quizRepository;

    @Inject
    QuizResultRepository quizResultRepository;

    @Inject
    EntityManager entityManager;

    private Long alunoId;
    private Long outroAlunoId;
    private Discipline discContabilidade;
    private Discipline discTributaria;
    private Topic topicoBalanco;
    private Topic topicoImpostos;
    private Question questaoFacil;
    private Question questaoDificil;
    private Quiz quizUm;
    private Quiz quizDois;

    @BeforeEach
    @Transactional
    public void setup() {
        // Limpa resultados anteriores criados por testes
        entityManager.createQuery("DELETE FROM QuizResultCorrection").executeUpdate();
        entityManager.createQuery("DELETE FROM QuizResult").executeUpdate();

        User aluno = userRepository.findByEmail(ALUNO_EMAIL).firstResult();
        if (aluno == null) {
            aluno = new User();
            aluno.setName("Aluno Historico");
            aluno.setEmail(ALUNO_EMAIL);
            aluno.setPasswordHash("hash123");
            aluno.setSystemRole(SystemRole.ALUNO);
            aluno.setActive(true);
            userRepository.persist(aluno);
        }
        alunoId = aluno.getId();

        User outroAluno = userRepository.findByEmail(OUTRO_ALUNO_EMAIL).firstResult();
        if (outroAluno == null) {
            outroAluno = new User();
            outroAluno.setName("Outro Aluno");
            outroAluno.setEmail(OUTRO_ALUNO_EMAIL);
            outroAluno.setPasswordHash("hash123");
            outroAluno.setSystemRole(SystemRole.ALUNO);
            outroAluno.setActive(true);
            userRepository.persist(outroAluno);
        }
        outroAlunoId = outroAluno.getId();

        discContabilidade = disciplineRepository.find("name", "Contabilidade Geral").firstResult();
        if (discContabilidade == null) {
            discContabilidade = new Discipline();
            discContabilidade.setName("Contabilidade Geral");
            discContabilidade.setActive(true);
            disciplineRepository.persist(discContabilidade);
        }

        discTributaria = disciplineRepository.find("name", "Legislação Tributária").firstResult();
        if (discTributaria == null) {
            discTributaria = new Discipline();
            discTributaria.setName("Legislação Tributária");
            discTributaria.setActive(true);
            disciplineRepository.persist(discTributaria);
        }

        topicoBalanco = topicRepository.find("name", "Balanço Patrimonial").firstResult();
        if (topicoBalanco == null) {
            topicoBalanco = new Topic();
            topicoBalanco.setName("Balanço Patrimonial");
            topicoBalanco.setDiscipline(discContabilidade);
            topicoBalanco.setActive(true);
            topicRepository.persist(topicoBalanco);
        }

        topicoImpostos = topicRepository.find("name", "Impostos Federais").firstResult();
        if (topicoImpostos == null) {
            topicoImpostos = new Topic();
            topicoImpostos.setName("Impostos Federais");
            topicoImpostos.setDiscipline(discTributaria);
            topicoImpostos.setActive(true);
            topicRepository.persist(topicoImpostos);
        }

        questaoFacil = questionRepository.find("statement", "Questao Facil Teste").firstResult();
        if (questaoFacil == null) {
            questaoFacil = new Question();
            questaoFacil.setStatement("Questao Facil Teste");
            questaoFacil.setType(QuestionType.MULTIPLA_ESCOLHA);
            questaoFacil.setDifficulty(DifficultyLevel.FACIL);
            questaoFacil.setDiscipline(discContabilidade);
            questaoFacil.setExplanation("Explicacao facil");
            questaoFacil.setActive(true);
            questaoFacil.setTopics(Set.of(topicoBalanco));

            QuestionOption opCorreta = new QuestionOption();
            opCorreta.setText("A");
            opCorreta.setIsCorrect(true);
            opCorreta.setQuestion(questaoFacil);

            QuestionOption opIncorreta = new QuestionOption();
            opIncorreta.setText("B");
            opIncorreta.setIsCorrect(false);
            opIncorreta.setQuestion(questaoFacil);

            questaoFacil.setOptions(List.of(opCorreta, opIncorreta));
            questionRepository.persist(questaoFacil);
        }

        questaoDificil = questionRepository.find("statement", "Questao Dificil Teste").firstResult();
        if (questaoDificil == null) {
            questaoDificil = new Question();
            questaoDificil.setStatement("Questao Dificil Teste");
            questaoDificil.setType(QuestionType.MULTIPLA_ESCOLHA);
            questaoDificil.setDifficulty(DifficultyLevel.DIFICIL);
            questaoDificil.setDiscipline(discTributaria);
            questaoDificil.setExplanation("Explicacao dificil");
            questaoDificil.setActive(true);
            questaoDificil.setTopics(Set.of(topicoImpostos));

            QuestionOption opCorreta = new QuestionOption();
            opCorreta.setText("A");
            opCorreta.setIsCorrect(true);
            opCorreta.setQuestion(questaoDificil);

            QuestionOption opIncorreta = new QuestionOption();
            opIncorreta.setText("B");
            opIncorreta.setIsCorrect(false);
            opIncorreta.setQuestion(questaoDificil);

            questaoDificil.setOptions(List.of(opCorreta, opIncorreta));
            questionRepository.persist(questaoDificil);
        }

        quizUm = quizRepository.findByTitle("Quiz Um Teste");
        if (quizUm == null) {
            quizUm = new Quiz();
            quizUm.setTitle("Quiz Um Teste");
            quizUm.setDescription("Desc 1");
            quizUm.setDiscipline(discContabilidade);
            quizUm.setVisibility(QuizVisibility.PUBLIC);
            quizUm.setPassingScore(60);
            quizUm.setTimeLimitSeconds(1200);
            quizUm.setActive(true);
            quizUm.setCreatedByUser(aluno);
            quizUm.setQuestions(new HashSet<>(List.of(questaoFacil)));
            quizRepository.persist(quizUm);
        }

        quizDois = quizRepository.findByTitle("Quiz Dois Teste");
        if (quizDois == null) {
            quizDois = new Quiz();
            quizDois.setTitle("Quiz Dois Teste");
            quizDois.setDescription("Desc 2");
            quizDois.setDiscipline(discTributaria);
            quizDois.setVisibility(QuizVisibility.PRIVATE);
            quizDois.setPassingScore(70);
            quizDois.setTimeLimitSeconds(1800);
            quizDois.setActive(true);
            quizDois.setCreatedByUser(aluno);
            quizDois.setQuestions(new HashSet<>(List.of(questaoDificil)));
            quizRepository.persist(quizDois);
        }
    }

    @Test
    @DisplayName("Deve retornar histórico com valores zerados e listas vazias quando o aluno não possui tentativas")
    @TestSecurity(user = ALUNO_EMAIL, roles = "ALUNO")
    public void deveRetornarHistoricoVazioQuandoAlunoNaoTemTentativas() {
        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/historico")
        .then()
            .statusCode(200)
            .body("data.totalQuizzesCompleted", equalTo(0))
            .body("data.averageScore", equalTo(0))
            .body("data.totalStudyTime", equalTo(0))
            .body("data.quizzes", hasSize(0))
            .body("data.attempts", hasSize(0))
            .body("data.analytics.timeline", hasSize(0))
            .body("data.analytics.byDiscipline", hasSize(0))
            .body("data.analytics.byTopic", hasSize(0))
            .body("data.analytics.byDifficulty", hasSize(0))
            .body("data.analytics.comparison", hasSize(0))
            .body("data.analytics.lowAreas", hasSize(0));
    }

    @Test
    @DisplayName("Deve calcular corretamente totalQuizzesCompleted, bestScore, averageScore e totalStudyTime com múltiplas tentativas")
    @TestSecurity(user = ALUNO_EMAIL, roles = "ALUNO")
    public void deveConsolidarMetricasGeraisBaseandoSeNoBestScore() {
        // Aluno resolve Quiz 1 duas vezes: tentativa 1 = 50%, tempo = 100s; tentativa 2 = 90%, tempo = 200s
        criarTentativa(alunoId, quizUm, 50, 100, LocalDateTime.now().minusHours(2), questaoFacil, false);
        criarTentativa(alunoId, quizUm, 90, 200, LocalDateTime.now().minusHours(1), questaoFacil, true);

        // Aluno resolve Quiz 2 uma vez: tentativa 1 = 70%, tempo = 150s
        criarTentativa(alunoId, quizDois, 70, 150, LocalDateTime.now(), questaoDificil, true);

        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/historico")
        .then()
            .statusCode(200)
            .body("data.totalQuizzesCompleted", equalTo(2))
            // Média dos bestScores: (90 + 70) / 2 = 80
            .body("data.averageScore", equalTo(80))
            // Tempo total de estudo somando todas as tentativas: 100 + 200 + 150 = 450
            .body("data.totalStudyTime", equalTo(450))
            .body("data.quizzes", hasSize(2))
            .body("data.attempts", hasSize(3))
            // Verifica o quiz com bestScore = 90
            .body("data.quizzes.find { it.title == 'Quiz Um Teste' }.bestScore", equalTo(90))
            .body("data.quizzes.find { it.title == 'Quiz Um Teste' }.attempts", equalTo(2))
            .body("data.quizzes.find { it.title == 'Quiz Um Teste' }.totalTimeSpent", equalTo(300))
            .body("data.quizzes.find { it.title == 'Quiz Dois Teste' }.bestScore", equalTo(70))
            .body("data.quizzes.find { it.title == 'Quiz Dois Teste' }.attempts", equalTo(1));
    }

    @Test
    @DisplayName("Deve estruturar corretamente timeline e comparison com numeração sequencial de tentativas")
    @TestSecurity(user = ALUNO_EMAIL, roles = "ALUNO")
    public void deveMapearTimelineEComparacaoSequencial() {
        LocalDateTime t1 = LocalDateTime.now().minusMinutes(30);
        LocalDateTime t2 = LocalDateTime.now().minusMinutes(10);

        criarTentativa(alunoId, quizUm, 60, 120, t1, questaoFacil, true);
        criarTentativa(alunoId, quizUm, 80, 140, t2, questaoFacil, true);

        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/historico")
        .then()
            .statusCode(200)
            .body("data.analytics.timeline", hasSize(2))
            .body("data.analytics.timeline[0].percentage", equalTo(60))
            .body("data.analytics.timeline[1].percentage", equalTo(80))
            .body("data.analytics.comparison", hasSize(1))
            .body("data.analytics.comparison[0].title", equalTo("Quiz Um Teste"))
            .body("data.analytics.comparison[0].attempts[0].attemptNumber", equalTo(1))
            .body("data.analytics.comparison[0].attempts[0].percentage", equalTo(60))
            .body("data.analytics.comparison[0].attempts[1].attemptNumber", equalTo(2))
            .body("data.analytics.comparison[0].attempts[1].percentage", equalTo(80));
    }

    @Test
    @DisplayName("Deve aplicar a regra rígida de Low Areas: apenas tópicos/disciplinas com pelo menos 2 tentativas")
    @TestSecurity(user = ALUNO_EMAIL, roles = "ALUNO")
    public void deveFiltrarLowAreasComRegraRigidaDeAoMenosDuasTentativas() {
        // Quiz 2 (Legislação Tributária / Impostos Federais): 1 única tentativa com nota 0%.
        // Por ter apenas 1 tentativa, NÃO PODE APARECER nas low areas!
        criarTentativa(alunoId, quizDois, 0, 100, LocalDateTime.now().minusHours(3), questaoDificil, false);

        // Quiz 1 (Contabilidade Geral / Balanço Patrimonial): 2 tentativas com notas 30% e 40% (média 35%)
        // Por ter 2 tentativas (>= 2), DEVE APARECER nas low areas!
        criarTentativa(alunoId, quizUm, 30, 100, LocalDateTime.now().minusHours(2), questaoFacil, false);
        criarTentativa(alunoId, quizUm, 40, 100, LocalDateTime.now().minusHours(1), questaoFacil, false);

        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/historico")
        .then()
            .statusCode(200)
            .body("data.analytics.lowAreas", not(empty()))
            // Nenhuma área com attempts < 2 pode estar presente
            .body("data.analytics.lowAreas.attempts", everyItem(greaterThanOrEqualTo(2)))
            // Impostos Federais / Legislação Tributária tem apenas 1 tentativa, portanto não deve estar
            .body("data.analytics.lowAreas.find { it.label == 'Impostos Federais' }", nullValue())
            .body("data.analytics.lowAreas.find { it.label == 'Legislação Tributária' }", nullValue())
            // Contabilidade Geral e Balanço Patrimonial têm 2 tentativas, devem estar presentes
            .body("data.analytics.lowAreas.find { it.label == 'Contabilidade Geral' }", notNullValue());
    }

    @Test
    @DisplayName("Deve filtrar histórico por disciplinaId, visibility e faixa de pontuação")
    @TestSecurity(user = ALUNO_EMAIL, roles = "ALUNO")
    public void deveAplicarFiltrosDeConsultaCorretamente() {
        criarTentativa(alunoId, quizUm, 90, 120, LocalDateTime.now().minusHours(2), questaoFacil, true);
        criarTentativa(alunoId, quizDois, 40, 180, LocalDateTime.now().minusHours(1), questaoDificil, false);

        // Filtro por disciplinaId (Contabilidade Geral)
        given()
            .contentType(ContentType.JSON)
            .queryParam("disciplineId", discContabilidade.getId())
        .when()
            .get("/api/historico")
        .then()
            .statusCode(200)
            .body("data.totalQuizzesCompleted", equalTo(1))
            .body("data.attempts", hasSize(1))
            .body("data.attempts[0].discipline", equalTo("Contabilidade Geral"));

        // Filtro por visibility (PRIVATE)
        given()
            .contentType(ContentType.JSON)
            .queryParam("visibility", "PRIVATE")
        .when()
            .get("/api/historico")
        .then()
            .statusCode(200)
            .body("data.totalQuizzesCompleted", equalTo(1))
            .body("data.attempts", hasSize(1))
            .body("data.attempts[0].visibility", equalTo("PRIVATE"));

        // Filtro por minScore = 80
        given()
            .contentType(ContentType.JSON)
            .queryParam("minScore", 80)
        .when()
            .get("/api/historico")
        .then()
            .statusCode(200)
            .body("data.totalQuizzesCompleted", equalTo(1))
            .body("data.attempts", hasSize(1))
            .body("data.attempts[0].percentage", equalTo(90));
    }

    @Test
    @DisplayName("Deve garantir isolamento estrito de tenants: Aluno A não visualiza tentativas do Aluno B")
    @TestSecurity(user = ALUNO_EMAIL, roles = "ALUNO")
    public void deveGarantirIsolamentoEntreAlunos() {
        // Criar tentativa pertencente a OUTRO aluno
        criarTentativa(outroAlunoId, quizUm, 100, 300, LocalDateTime.now(), questaoFacil, true);

        // O aluno logado (aluno_historico@quiz.com) não deve ver a tentativa do outro aluno
        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/historico")
        .then()
            .statusCode(200)
            .body("data.totalQuizzesCompleted", equalTo(0))
            .body("data.attempts", hasSize(0));
    }

    @Test
    @DisplayName("Deve rejeitar requisição sem autenticação com HTTP 401 Unauthorized")
    public void deveRetornar401QuandoNaoAutenticado() {
        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/historico")
        .then()
            .statusCode(401);
    }

    @Transactional
    protected void criarTentativa(Long userId, Quiz quiz, int percentage, int timeSpent,
                                LocalDateTime createdAt, Question question, boolean acertou) {
        User user = userRepository.findById(userId);

        QuizResult result = new QuizResult();
        result.setUser(user);
        result.setQuiz(quiz);
        result.setCorrectAnswers(acertou ? 1 : 0);
        result.setWrongAnswers(acertou ? 0 : 1);
        result.setTotalQuestions(1);
        result.setPercentage(BigDecimal.valueOf(percentage));
        result.setTimeSpentInSeconds(timeSpent);
        result.setPassingScore(quiz.getPassingScore());
        result.setCreatedAt(createdAt);

        QuizResultCorrection correction = new QuizResultCorrection();
        correction.setResult(result);
        correction.setQuestion(question);
        correction.setUserAnswer(acertou ? 0 : 1);
        correction.setCorrectAnswer(0);
        correction.setCorrect(acertou);
        correction.setExplanationSnapshot("Snapshot explicacao");
        correction.setCreatedAt(createdAt);

        result.addCorrection(correction);

        quizResultRepository.persist(result);
    }
}
