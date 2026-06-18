# Contratos da API - ContaQuiz (Branch: `backendQuiz`)

Este documento define todos os contratos de API (endpoints, requests e responses) identificados através da análise do backend Express na branch `backendQuiz` e sua integração com o frontend.

---

## 1. Autenticação (`/api/auth`)

### 1.1 `POST /api/auth/login`
Realiza a autenticação do usuário.
* **Corpo da Requisição (JSON):**
  ```json
  {
    "email": "usuario@email.com", // String (Válido e obrigatório)
    "password": "senha" // String (Mínimo 1 caractere)
  }
  ```
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "token": "JWT_TOKEN_HERE",
    "user": {
      "_id": "64bf...",
      "name": "Nome do Usuário",
      "email": "usuario@email.com",
      "systemRole": "ADMIN" // "ADMIN" ou "ALUNO"
    }
  }
  ```
* **Resposta de Erro (`401 Unauthorized`):**
  ```json
  {
    "error": "Usuário não encontrado ou senha incorreta."
  }
  ```

---

### 1.2 `POST /api/auth/register`
Cadastra um novo usuário no sistema.
* **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Nome", // String (Mínimo 2 caracteres)
    "email": "usuario@email.com", // String (E-mail válido)
    "password": "senha" // String (Mínimo 6 caracteres)
  }
  ```
* **Resposta de Sucesso (`201 Created`):**
  ```json
  {
    "token": "JWT_TOKEN_HERE",
    "user": {
      "_id": "64bf...",
      "name": "Nome",
      "email": "usuario@email.com",
      "systemRole": "ALUNO"
    }
  }
  ```

---

### 1.3 `GET /api/auth/me`
Obtém os dados do usuário autenticado a partir do token JWT enviado no Header.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>`
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "data": {
      "_id": "64bf...",
      "name": "Nome do Usuário",
      "email": "usuario@email.com",
      "systemRole": "ADMIN",
      "active": true,
      "createdAt": "2026-06-15T19:00:00.000Z",
      "updatedAt": "2026-06-15T19:00:00.000Z"
    }
  }
  ```
* **Resposta de Erro (`404 Not Found`):**
  ```json
  {
    "error": "Usuario nao encontrado"
  }
  ```

---

## 2. Disciplinas (`/api/disciplinas`)

### 2.1 `GET /api/disciplinas`
Lista as disciplinas cadastradas com filtros e paginação.
* **Query Params:**
  * `page` (Opcional): Número da página (Ex: `1`)
  * `limit` (Opcional): Quantidade por página (Ex: `10`)
  * `filter` (Opcional): Busca por texto no nome da disciplina
  * `active` (Opcional): Filtrar por ativas/inativas (`true` ou `false`)
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "items": [
      {
        "_id": "64bf...",
        "name": "Contabilidade Geral",
        "description": "Descrição da disciplina",
        "active": true,
        "createdAt": "2026-06-15T19:00:00.000Z",
        "updatedAt": "2026-06-15T19:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
  ```

---

### 2.2 `GET /api/disciplinas/:id`
Obtém detalhes de uma disciplina específica.
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "data": {
      "_id": "64bf...",
      "name": "Contabilidade Geral",
      "description": "Descrição da disciplina",
      "active": true,
      "createdAt": "2026-06-15T19:00:00.000Z",
      "updatedAt": "2026-06-15T19:00:00.000Z"
    }
  }
  ```

---

### 2.3 `POST /api/disciplinas`
Cria uma nova disciplina (Apenas Administradores).
* **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Contabilidade Geral", // String (Mínimo 2 caracteres, obrigatório)
    "description": "Descrição opcional", // String (Opcional)
    "active": true // Boolean (Opcional, padrão true)
  }
  ```
* **Resposta de Sucesso (`201 Created`):**
  ```json
  {
    "data": {
      "_id": "64bf...",
      "name": "Contabilidade Geral",
      "description": "Descrição opcional",
      "active": true,
      "createdAt": "2026-06-15T19:00:00.000Z",
      "updatedAt": "2026-06-15T19:00:00.000Z"
    }
  }
  ```

---

### 2.4 `PUT /api/disciplinas/:id`
Atualiza os dados de uma disciplina existente.
* **Corpo da Requisição (JSON):**
  * Qualquer um dos campos de criação é aceito de forma opcional.
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "data": {
      "_id": "64bf...",
      "name": "Contabilidade Geral (Editado)",
      "description": "Nova Descrição",
      "active": true,
      "createdAt": "2026-06-15T19:00:00.000Z",
      "updatedAt": "2026-06-15T19:10:00.000Z"
    }
  }
  ```

---

### 2.5 `DELETE /api/disciplinas/:id`
Inativa/Remove uma disciplina do sistema.
* **Resposta de Sucesso (`204 No Content`):**
  *(Nenhum conteúdo retornado no body)*

---

## 3. Temas/Subtemas (`/api/temas`)

### 3.1 `GET /api/temas`
Lista os temas vinculados às disciplinas.
* **Query Params:**
  * Todos os da paginação básica (`page`, `limit`, `filter`, `active`).
  * `disciplineId` (Opcional): Filtra temas de uma disciplina específica.
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "items": [
      {
        "_id": "64c0...",
        "name": "Balanço Patrimonial",
        "disciplineId": "64bf...",
        "active": true,
        "parentTopicId": null, // Se for um subtema, terá o ID do tema pai
        "createdAt": "2026-06-15T19:00:00.000Z",
        "updatedAt": "2026-06-15T19:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
  ```

---

### 3.2 `POST /api/temas`
Cria um novo tema/subtema.
* **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Patrimônio", // String (Mínimo 2 caracteres, obrigatório)
    "disciplineId": "64bf...", // String ID (Obrigatorio)
    "parentTopicId": "64c0...", // String ID (Opcional, usado para subtemas)
    "active": true // Boolean (Opcional, padrão true)
  }
  ```
* **Resposta de Sucesso (`201 Created`):**
  *(Retorna no formato `{ data: Tema }`)*

---

## 4. Questões (`/api/questoes`)

### 4.1 `GET /api/questoes`
Lista as questões cadastradas.
* **Query Params:**
  * Paginação padrão (`page`, `limit`, `filter`, `active`).
  * `disciplineId` (Opcional): Filtro por ID de disciplina.
  * `topicIds` (Opcional): Array de IDs de temas.
  * `difficulty` (Opcional): `"FACIL"`, `"MEDIO"` ou `"DIFICIL"`.
  * `type` (Opcional): `"MULTIPLA_ESCOLHA"` ou `"CERTO_ERRADO"`.
* **Resposta de Sucesso (`200 OK`):**
  *(Retorna no formato do `PaginatedResponse<Question>`)*

---

### 4.2 `POST /api/questoes`
Cadastra uma nova questão no banco.
* **Corpo da Requisição (JSON):**
  ```json
  {
    "statement": "Enunciado da questão contábil...",
    "type": "MULTIPLA_ESCOLHA", // ou "CERTO_ERRADO"
    "disciplineId": "64bf...", // Opcional
    "topicIds": ["64c0..."], // Opcional
    "difficulty": "MEDIO", // "FACIL" | "MEDIO" | "DIFICIL"
    "options": [
      { "text": "Alternativa A", "isCorrect": false },
      { "text": "Alternativa B", "isCorrect": true }
    ], // Mínimo de 2 opções
    "explanation": "Justificativa da resposta", // Opcional
    "active": true
  }
  ```
* **Resposta de Sucesso (`201 Created`):**
  *(Retorna no formato `{ data: Question }`)*

---

## 5. Quizzes (`/api/quizzes`)

### 5.1 `GET /api/quizzes`
Lista os quizzes disponíveis para o usuário autenticado ou visitantes (apenas públicos).
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Opcional)
* **Query Params:**
  * `page`, `limit`, `filter`, `active`
  * `disciplineId` (Opcional): Filtro por disciplina.
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "data": {
      "items": [
        {
          "_id": "64d0...",
          "title": "Quiz Simulado CRC",
          "description": "Simulado de Contabilidade Geral",
          "disciplineId": "64bf...",
          "questionIds": ["64cf..."],
          "timeLimitSeconds": 1800,
          "score": 70, // Nota de corte/passing score
          "visibility": "PUBLIC", // "PUBLIC" ou "PRIVATE"
          "createdByUserId": "64bf...",
          "active": true,
          "createdAt": "2026-06-15T19:00:00.000Z",
          "updatedAt": "2026-06-15T19:00:00.000Z",
          "questions": [ ... ], // Array com detalhes de cada questão
          "timeLimit": 1800, // Mesma informação de timeLimitSeconds (normalização frontend)
          "passingScore": 70 // Mesma informação de score (normalização frontend)
        }
      ],
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
  ```

---

### 5.2 `GET /api/quizzes/:id`
Obtém os detalhes de um quiz específico.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Opcional)
* **Resposta de Sucesso (`200 OK`):**
  *(Retorna o objeto do quiz normalizado no formato `{ data: Quiz }`)*

---

### 5.3 `POST /api/quizzes`
Cria manualmente um novo template de quiz (Apenas ADMIN).
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Obrigatório, ADMIN)
* **Corpo da Requisição (JSON):**
  ```json
  {
    "title": "Simulado Geral de Custos",
    "description": "Quiz preparatório", // Opcional
    "disciplineId": "64bf...", // Opcional
    "questionIds": ["64cf1...", "64cf2..."], // Mínimo 1 questão
    "timeLimitSeconds": 1200, // Opcional
    "score": 60, // Passing score (não-negativo)
    "visibility": "PUBLIC", // "PUBLIC" | "PRIVATE" (Opcional)
    "active": true // Opcional
  }
  ```
* **Resposta de Sucesso (`201 Created`):**
  *(Retorna `{ data: Quiz }` recém-criado)*

---

### 5.4 `POST /api/quizzes/generate`
Gera dinamicamente um quiz aleatório baseado em regras de amostragem.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Obrigatório)
* **Corpo da Requisição (JSON):**
  ```json
  {
    "title": "Quiz Personalizado Dinâmico", // Obrigatório
    "description": "Descrição opcional",
    "disciplineId": "64bf...", // Opcional
    "topicIds": ["64c0..."], // Opcional (Pode ser string única ou array)
    "questionCount": 10, // Opcional (Quantidade de questões, padrão 10)
    "questionsPerTopic": 2, // Opcional (Quantidade de questões por tópico selecionado)
    "difficulty": "FACIL", // "FACIL" | "MEDIO" | "DIFICIL" (Opcional)
    "mixedDifficulty": true, // Opcional, padrão false (Ignora o filtro rígido de dificuldade)
    "timeLimitSeconds": 1800, // Opcional
    "score": 70, // Opcional (Passing score)
    "visibility": "PRIVATE" // Opcional ("PUBLIC" ou "PRIVATE")
  }
  ```
* **Resposta de Sucesso (`201 Created`):**
  *(Retorna `{ data: Quiz }` gerado e salvo)*

---

### 5.5 `PUT /api/quizzes/:id`
Atualiza um quiz existente.
* **Corpo da Requisição (JSON):**
  * Aceita os mesmos campos de `POST /api/quizzes` (todos opcionais).
* **Resposta de Sucesso (`200 OK`):**
  *(Retorna o objeto do quiz atualizado)*

---

### 5.6 `DELETE /api/quizzes/:id`
Deleta um quiz permanentemente do banco.
* **Resposta de Sucesso (`204 No Content`):**
  *(Nenhum conteúdo)*

---

## 6. Resultados e Histórico de Quizzes

### 6.1 `POST /api/quizzes/:id/submit`
Submete as respostas de um aluno para correção e armazena os resultados.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Obrigatório)
* **Corpo da Requisição (JSON):**
  ```json
  {
    "answers": {
      "64cf1...": 1, // Mapeamento QuestionID -> Index da Alternativa selecionada
      "64cf2...": 0
    },
    "timeSpentInSeconds": 150 // Opcional (Tempo total gasto em segundos)
  }
  ```
* **Resposta de Sucesso (`201 Created`):**
  ```json
  {
    "data": {
      "_id": "64d5_result_id",
      "quizId": "64d0...",
      "correctAnswers": 1,
      "wrongAnswers": 1,
      "totalQuestions": 2,
      "percentage": 50,
      "timeSpentInSeconds": 150,
      "passingScore": 60,
      "corrections": [
        {
          "questionId": "64cf1...",
          "userAnswer": 1,
          "correctAnswer": 1,
          "isCorrect": true,
          "explanation": "Explicação detalhada da alternativa correta...",
          "isFavorite": false,
          "question": {
            "_id": "64cf1...",
            "statement": "Enunciado da questão...",
            "type": "MULTIPLA_ESCOLHA",
            "disciplineId": "64bf...",
            "disciplineName": "Contabilidade Geral",
            "topicIds": [
              {
                "_id": "64c0...",
                "name": "Balanço Patrimonial"
              }
            ],
            "difficulty": "FACIL"
          }
        }
      ]
    }
  }
  ```

---

### 6.2 `GET /api/quizzes/resultados/:resultId` ou `GET /api/quiz-results/:resultId`
Obtém o gabarito detalhado e pontuação de uma tentativa específica de quiz.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Opcional)
* **Resposta de Sucesso (`200 OK`):**
  *(Retorna a resposta idêntica ao JSON do `submit` mapeado acima)*

---

### 6.3 `GET /api/historico`
Obtém o histórico de tentativas do aluno autenticado, incluindo consolidação estatística e análises de desempenho.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Obrigatório)
* **Query Params (Filtros Opcionais):**
  * `disciplineId`: Filtrar por disciplina.
  * `visibility`: Filtrar por `PUBLIC` ou `PRIVATE`.
  * `quizId`: Filtrar por um quiz específico.
  * `dateFrom`: Data inicial (`YYYY-MM-DD`).
  * `dateTo`: Data final (`YYYY-MM-DD`).
  * `minScore`: Percentual de acertos mínimo.
  * `maxScore`: Percentual de acertos máximo.
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "data": {
      "totalQuizzesCompleted": 5,
      "averageScore": 76,
      "totalStudyTime": 3600, // Em segundos
      "quizzes": [
        {
          "_id": "64d0...",
          "quizId": "64d0...",
          "title": "Simulado CRC",
          "discipline": "Contabilidade Geral",
          "attempts": 2,
          "bestScore": 90,
          "lastAttemptDate": "2026-06-15T19:20:00.000Z",
          "totalTimeSpent": 1200,
          "averageTime": 600
        }
      ],
      "attempts": [
        {
          "_id": "64d5_result_id",
          "resultId": "64d5_result_id",
          "quizId": "64d0...",
          "title": "Simulado CRC",
          "discipline": "Contabilidade Geral",
          "visibility": "PUBLIC",
          "percentage": 90,
          "correctAnswers": 9,
          "wrongAnswers": 1,
          "totalQuestions": 10,
          "timeSpentInSeconds": 550,
          "passingScore": 70,
          "createdAt": "2026-06-15T19:20:00.000Z",
          "passed": true
        }
      ],
      "analytics": {
        "timeline": [
          {
            "resultId": "64d5_result_id",
            "quizId": "64d0...",
            "title": "Simulado CRC",
            "createdAt": "2026-06-15T19:20:00.000Z",
            "percentage": 90,
            "timeSpentInSeconds": 550
          }
        ],
        "byDiscipline": [
          {
            "key": "64bf...",
            "label": "Contabilidade Geral",
            "attempts": 3,
            "correctAnswers": 25,
            "averageScore": 83,
            "averageTime": 420
          }
        ],
        "byTopic": [
          {
            "key": "64c0...",
            "label": "Balanço Patrimonial",
            "attempts": 12, // Questões respondidas
            "correctAnswers": 9,
            "averageScore": 75,
            "averageTime": 35
          }
        ],
        "byDifficulty": [
          {
            "difficulty": "FACIL",
            "attempts": 10,
            "correctAnswers": 8,
            "accuracy": 80
          }
        ],
        "comparison": [
          {
            "quizId": "64d0...",
            "title": "Simulado CRC",
            "attempts": [
              {
                "attemptNumber": 1,
                "resultId": "64d4_result_id",
                "createdAt": "2026-06-15T19:10:00.000Z",
                "percentage": 70
              },
              {
                "attemptNumber": 2,
                "resultId": "64d5_result_id",
                "createdAt": "2026-06-15T19:20:00.000Z",
                "percentage": 90
              }
            ]
          }
        ],
        "lowAreas": [
          {
            "kind": "TOPIC",
            "key": "64c0...",
            "label": "Balanço Patrimonial",
            "averageScore": 75,
            "attempts": 12
          }
        ]
      }
    }
  }
  ```

---

## 7. Favoritar Questões

### 7.1 `GET /api/question-favorites`
Retorna uma lista contendo os IDs das questões favoritadas pelo usuário logado.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Obrigatório)
* **Query Params (Opcional):**
  * `questionIds`: String separada por vírgulas ou array para verificar se itens específicos estão favoritados.
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "data": {
      "questionIds": ["64cf1...", "64cf3..."]
    }
  }
  ```

---

### 7.2 `POST /api/questions/:questionId/favorite`
Ativa ou desativa a marcação de favorita para uma questão.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Obrigatório)
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "data": {
      "favorited": true // true se adicionou, false se removeu
    }
  }
  ```

---

## 8. Estatísticas do Administrador (`/api/admin`)

### 8.1 `GET /api/admin/stats`
Retorna o sumário de contagem de todas as entidades cadastradas.
* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>` (Obrigatório, ADMIN)
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "data": {
      "disciplines": 5,
      "questions": 42,
      "users": 15,
      "quizzes": 8,
      "quizResults": 150
    }
  }
  ```
