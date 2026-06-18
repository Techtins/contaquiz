# Documento de Shadow Features (Funcionalidades Ocultas) e Lacunas de Casos de Uso

Este documento detalha o mapeamento da **Fase 2 do Plano de Refatoração**. Ele descreve as regras de negócio reais encontradas na branch `backendQuiz` para funcionalidades que foram codificadas mas não possuíam documento de Caso de Uso (User Story), bem como as simplificações e desvios das USs existentes em relação ao que foi implementado.

---

## 1. Desvios e Simplificações de Casos de Uso Existentes

### 1.1 [US_12] Manter Níveis de Dificuldade
* **Regra Proposta no Documento:** Existência de um CRUD dinâmico completo de Níveis de Dificuldade, com tabelas próprias, filtros por nome/situação, validação impeditiva de inativação/exclusão caso houvesse vinculação com questões ativas, e logs de auditoria para cada alteração.
* **Implementação Real no Código:** O CRUD foi completamente descartado. A dificuldade foi implementada diretamente como um campo de texto no esquema da Questão (`QuestionModel`), validado como um enum simples de strings: `"FACIL"`, `"MEDIO"`, `"DIFICIL"`. Não há rotas, serviços ou persistência em banco isolada para dificuldades.
* **Impacto na Refatoração:** Na nova stack Quarkus, a dificuldade pode ser mapeada diretamente como um `@Enumerated(EnumType.STRING)` na entidade de Questão, economizando o desenvolvimento de tabelas e rotas administrativas complexas para isso.

### 1.2 [US_03] Esqueceu sua senha / [US_05] Manter Perfil / [US_06] Manter Usuário / [US_07] Parâmetros Gerais
* **Situação:** Essas quatro User Stories constam na pasta de documentação, porém **não possuem nenhuma implementação** no backend na branch atual. A única rota relacionada a usuários é a de autenticação (Login, Registro e rota `/me` para ler dados do próprio usuário).
* **Impacto na Refatoração:** Não há contratos a migrar para estas USs neste primeiro momento, já que não existiam no backend legado.

---

## 2. Shadow Features (Funcionalidades Não Documentadas no Legado)

Abaixo estão as User Stories simplificadas reconstruídas com base no código implementado no backend Express.

---

### [US_13] Manter e Responder Quizzes (Simulados)
**Descrição:** 
* *Como administrador:* Eu quero cadastrar templates de Quizzes contendo um conjunto fixo de questões e um tempo limite para que os alunos resolvam.
* *Como aluno:* Eu quero visualizar a lista de Quizzes disponíveis, abrir um quiz, respondê-lo e submeter minhas respostas para correção.

**Regras de Negócio e Comportamento:**
1. **Cadastro Manual (Admin):** Um Quiz possui título (único), descrição opcional, disciplina vinculada, lista ordenada de IDs de Questões, limite de tempo em segundos, nota de corte (score mínimo) e visibilidade (`PUBLIC` ou `PRIVATE`).
2. **Geração Dinâmica de Quiz (Aluno/Admin):** 
   * Permite gerar um quiz na hora informando um título, disciplina, lista de tópicos e quantidade desejada de questões (`questionCount`).
   * Se tópicos forem fornecidos, o sistema distribui a amostragem igualmente entre eles (ex: 10 questões para 2 tópicos = 5 questões por tópico).
   * O usuário pode escolher uma dificuldade específica ou optar por `mixedDifficulty=true` (que mistura questões de qualquer dificuldade).
   * O sistema realiza uma amostragem randômica via agregação MongoDB (`$sample`) com base nos filtros e salva o novo quiz associado ao usuário criador com visibilidade `PRIVATE`.
3. **Submissão e Correção Automática:**
   * Ao finalizar o quiz, o frontend envia um mapa no formato `{ "ID_DA_QUESTAO": INDEX_DA_RESPOSTA }` e o tempo gasto em segundos.
   * O backend busca as questões associadas ao quiz, identifica qual alternativa é a correta (onde `isCorrect === true` no array de opções) e compara com a resposta do usuário.
   * O sistema calcula a quantidade de acertos, erros, o percentual de aproveitamento (`(acertos / total) * 100`) e salva o registro na coleção `QuizResult`.
   * O retorno do endpoint contém a correção detalhada por questão, incluindo a justificativa/explicação do professor e indicando se a resposta do usuário foi correta ou incorreta.

---

### [US_14] Painel de Desempenho e Histórico do Aluno (Analytics)
**Descrição:**
* *Como aluno:* Eu quero acessar meu histórico de tentativas para ver meu progresso ao longo do tempo, identificar minhas forças e descobrir quais matérias preciso estudar mais.

**Regras de Negócio e Comportamento:**
1. **Consolidação Estatística Geral:** O backend recupera todas as tentativas do usuário e calcula:
   * **Total de Quizzes Concluídos:** Quantidade de quizzes únicos que o aluno completou.
   * **Média Geral de Acertos:** A média aritmética das melhores pontuações (`bestScore`) obtidas pelo aluno em cada quiz.
   * **Tempo Total de Estudo:** Somatório de tempo gasto em todas as tentativas (em segundos).
2. **Listas de Acompanhamento:**
   * **Quizzes Resolvidos:** Lista de quizzes que o aluno já tentou, exibindo o número de tentativas feitas, melhor pontuação alcançada, data da última tentativa, tempo total e tempo médio de resolução.
   * **Tentativas Detalhadas:** Uma lista cronológica reversa de cada submissão individual (mostrando se passou/não passou de acordo com a nota de corte do quiz).
3. **Métricas de Performance Detalhadas:**
   * **Por Disciplina:** Agrupa o percentual médio de acertos e tempo médio de resolução baseado na disciplina do quiz.
   * **Por Tópico:** Agrupa o desempenho com base nos tópicos vinculados às questões que o aluno respondeu.
   * **Por Dificuldade:** Exibe a quantidade de tentativas e a acurácia (percentual de acertos) separando por questões fáceis, médias e difíceis.
   * **Linha do Tempo (Timeline):** Progresso cronológico sequencial de acertos.
   * **Comparação de Evolução:** Agrupamento por quiz que mostra a nota obtida em cada tentativa sucessiva (Tentativa 1: 50%, Tentativa 2: 70%, etc.) para avaliar evolução do aprendizado.
4. **Identificação de Pontos Fracos (Low Areas):**
   * O backend calcula e filtra quais disciplinas ou tópicos possuem um desempenho abaixo do esperado.
   * Filtro rígido: Apenas disciplinas ou tópicos com **pelo menos 2 tentativas** entram no cálculo.
   * Retorna os 5 piores desempenhos ordenados do menor para o maior percentual de acertos, servindo como guia de estudos.

---

### [US_15] Favoritar Questões
**Descrição:**
* *Como aluno:* Eu quero marcar questões específicas como favoritas durante ou após a resolução de um simulado para que eu possa estudá-las depois.

**Regras de Negócio e Comportamento:**
1. **Favoritar/Desfavoritar (Toggle):** Rota única `POST /api/questions/:questionId/favorite`. Se a questão já estiver favoritada pelo usuário, remove o favorito; caso contrário, insere um registro na coleção `QuestionFavorite`.
2. **Listagem de Favoritas:** Rota `GET /api/question-favorites` que retorna um array com todos os IDs das questões que o usuário favoritou. Aceita um filtro de `questionIds` via query string para checar de forma otimizada se um lote específico de questões está marcado como favorito.

---

### [US_16] Métricas do Dashboard Administrativo
**Descrição:**
* *Como administrador:* Eu quero visualizar um resumo rápido da quantidade de dados cadastrados na plataforma para monitorar o uso do sistema.

**Regras de Negócio e Comportamento:**
1. **Contagem Geral:** Rota protegida `GET /api/admin/stats` (restrita a administradores) que efetua contagens rápidas e paralelas no banco de dados e retorna:
   * Total de disciplinas cadastradas;
   * Total de questões cadastradas;
   * Total de usuários no sistema;
   * Total de quizzes criados;
   * Total de tentativas de simulados submetidas (`quizResults`).
