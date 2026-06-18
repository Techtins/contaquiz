# PRD — Product Requirements Document
## ContaQuiz · Plataforma de Simulados para Concursos Contábeis

**Versão:** 1.0  
**Data:** Junho 2026  
**Organização:** Techtins  
**Status:** Refatoração em andamento (Backend TO-BE)

---

## 1. Visão Geral do Produto

### 1.1 O que é o ContaQuiz?

O **ContaQuiz** é uma plataforma web de estudos e simulados voltada para candidatos que se preparam para **concursos públicos e exames de certificação na área contábil** (ex: Exame de Suficiência do CRC, concursos públicos de analista/contador).

A plataforma permite que **administradores** cadastrem e gerenciem questões, disciplinas, temas e simulados, enquanto **alunos** resolvem quizzes, acompanham seu desempenho e identificam seus pontos de melhoria.

### 1.2 Objetivo deste Documento

Este PRD descreve a visão **TO-BE** do produto, com foco na refatoração completa do backend. Ele serve como fonte de verdade técnica para a equipe de desenvolvimento, consolidando:

- O que o sistema faz (funcionalidades)
- Como a stack técnica está sendo modernizada
- Os contratos de API que devem ser mantidos/implementados
- O modelo de dados relacional alvo

> **Leitura recomendada:** Este documento deve ser lido em conjunto com os artefatos técnicos disponíveis em `/docs`:
> - `api_contracts.md` — Contratos de todos os endpoints
> - `arquitetura_e_setup.md` — Padrões de arquitetura e boilerplate do Quarkus
> - `modelagem_banco_relacional.md` — Mapeamento das entidades e DER
> - `shadow_features.md` — Funcionalidades não documentadas identificadas no legado

---

## 2. Contexto e Motivação para a Refatoração

### 2.1 Stack Legada (AS-IS)

O sistema atualmente está dividido em:

| Camada | Tecnologia |
|---|---|
| Frontend | React.js + Next.js |
| Backend | Node.js + Express |
| Banco de Dados | MongoDB (NoSQL) |
| Autenticação | JWT (via middleware Express) |
| Infraestrutura | Não dockerizado |

### 2.2 Problemas do Sistema Atual

- **Banco NoSQL sem esquema rígido:** A flexibilidade do MongoDB gerou inconsistências nos dados ao longo do tempo.
- **Sem padronização de código:** Ausência de padrões de projeto levou a um código de manutenção difícil.
- **Sem tipagem forte:** JavaScript sem TypeScript eleva o risco de bugs em produção.
- **Sem gestão de migrações de banco:** Alterações estruturais eram feitas manualmente, sem versionamento.
- **Funcionalidades sem documentação:** Vários módulos foram desenvolvidos sem User Stories formalizadas (ver `shadow_features.md`).

### 2.3 Stack Alvo (TO-BE)

| Camada | Tecnologia |
|---|---|
| Frontend | **Mantido:** React.js + Next.js |
| Backend | **Novo:** Quarkus (Java 21) |
| Banco de Dados | **Novo:** PostgreSQL 16 (Relacional) |
| ORM | Hibernate ORM com Panache |
| Autenticação | SmallRye JWT |
| API Doc | SmallRye OpenAPI (Swagger UI) |
| Infraestrutura | Docker + Docker Compose |
| Build | Maven |

### 2.4 Princípio de Substituição

> O novo backend deve ser um **substituto transparente** do backend legado. O frontend **não deve sofrer nenhuma alteração** de código para acomodar a mudança de backend. Todos os contratos de API (rotas, formatos de request e response) devem ser mantidos.

---

## 3. Público-Alvo

### 3.1 Usuários Finais

| Perfil | Papel no Sistema | Necessidade Principal |
|---|---|---|
| **Aluno** | Resolver quizzes | Praticar questões, acompanhar progresso, identificar pontos fracos |
| **Administrador** | Gestão do conteúdo | Cadastrar questões, criar simulados e visualizar métricas gerais |

### 3.2 Equipe de Desenvolvimento (Público Interno do PRD)

- Desenvolvedores Backend (Quarkus/Java)
- Desenvolvedores Frontend (React/Next.js — manutenção)
- Tech Lead / Arquiteto de Software

---

## 4. Funcionalidades do Sistema (Escopo TO-BE)

### 4.1 Módulo de Autenticação

**Objetivo:** Controlar o acesso ao sistema com base em papéis (roles).

| Funcionalidade | Status | Responsável |
|---|---|---|
| Login com e-mail e senha | ✅ TO-BE (migrar) | Backend |
| Registro de novo usuário | ✅ TO-BE (migrar) | Backend |
| Leitura do perfil logado (`/me`) | ✅ TO-BE (migrar) | Backend |
| Recuperação de senha | 🔜 Não implementado no legado | Backend (Sprint Futura) |
| Gestão de usuários (CRUD Admin) | 🔜 Não implementado no legado | Backend (Sprint Futura) |

**Roles do sistema:**
- `ADMIN`: Acesso total. Gerencia o conteúdo e vê métricas.
- `ALUNO`: Acesso restrito ao módulo de resolução e histórico próprio.

---

### 4.2 Módulo Administrativo de Conteúdo

**Objetivo:** Permitir que administradores criem e mantenham o banco de questões e disciplinas.

#### 4.2.1 Disciplinas
- CRUD completo (Criar, Listar, Buscar por ID, Atualizar, Inativar)
- Suporte a paginação, filtro por texto e filtro por status (`active`)
- Exclusão lógica (soft delete via campo `active`)

#### 4.2.2 Temas e Subtemas
- CRUD completo de temas vinculados a disciplinas
- Suporte a hierarquia de subtemas (auto-referência: um tema pode ter `parentTopicId`)
- Filtros por disciplina, paginação e status

#### 4.2.3 Questões
- CRUD completo com suporte a dois tipos de questão:
  - `MULTIPLA_ESCOLHA`: Enunciado com múltiplas alternativas, exatamente uma correta
  - `CERTO_ERRADO`: Apenas duas alternativas ("Certo" e "Errado")
- Campos por questão: enunciado, tipo, dificuldade, disciplina, temas (M:N), alternativas, explicação do gabarito
- Dificuldade implementada como enum fixo: `FACIL`, `MEDIO`, `DIFICIL`
- Suporte a filtros combinados: disciplina, temas, dificuldade, tipo e status

> **Decisão de design:** O módulo de "Níveis de Dificuldade" previsto na US_12 foi descartado. A dificuldade é um atributo fixo da questão, sem CRUD próprio.

#### 4.2.4 Métricas do Dashboard Administrativo
- Endpoint exclusivo para ADMINs retornando contagens gerais:
  - Total de disciplinas, questões, usuários, quizzes e tentativas de simulados

---

### 4.3 Módulo de Quizzes (Simulados)

**Objetivo:** Permitir a criação e resolução de simulados.

#### 4.3.1 Criação de Quizzes

Dois modos de criação:

**a) Criação Manual (Admin)**
- Admin seleciona manualmente as questões que comporão o quiz
- Define título (único), disciplina, tempo limite, nota de corte e visibilidade

**b) Geração Dinâmica (Aluno/Admin)**
- Usuário informa filtros: disciplina, tópicos, quantidade de questões, dificuldade
- Sistema amostra aleatoriamente as questões do banco com base nos filtros
- Se múltiplos tópicos forem fornecidos, as questões são distribuídas igualmente entre eles
- Opção `mixedDifficulty=true` ignora o filtro de dificuldade único
- Quiz gerado é salvo com visibilidade `PRIVATE` e associado ao usuário criador

#### 4.3.2 Resolução e Correção

Fluxo de resolução do aluno:
1. Aluno visualiza a lista de quizzes disponíveis (públicos ou próprios)
2. Abre um quiz e visualiza as questões e alternativas
3. Responde as questões e submete ao final
4. Sistema corrige automaticamente: compara cada resposta com a alternativa `isCorrect=true`
5. Calcula: total de acertos, erros, percentual de aproveitamento
6. Retorna a **correção detalhada** por questão, incluindo a explicação do gabarito

**Formato de submissão:**
```
{ "answers": { "ID_QUESTAO": INDEX_RESPOSTA }, "timeSpentInSeconds": N }
```

---

### 4.4 Módulo de Histórico e Analytics do Aluno

**Objetivo:** Oferecer ao aluno uma visão completa do seu desempenho ao longo do tempo.

| Métrica | Descrição |
|---|---|
| Total de Quizzes Concluídos | Quizzes únicos completados |
| Média Geral de Acertos | Média das melhores pontuações por quiz |
| Tempo Total de Estudo | Somatório de todos os tempos de resolução |
| Lista de Quizzes Resolvidos | Melhor nota, número de tentativas, tempo médio |
| Tentativas Detalhadas | Histórico cronológico individual de cada submissão |
| Desempenho por Disciplina | Percentual médio e tempo médio agrupados por disciplina |
| Desempenho por Tópico | Agrupamento por temas das questões respondidas |
| Desempenho por Dificuldade | Acurácia separada por `FACIL`, `MEDIO`, `DIFICIL` |
| Linha do Tempo | Progresso cronológico sequencial de acertos |
| Comparação de Evolução | Nota por tentativa sucessiva no mesmo quiz |
| Pontos Fracos (Low Areas) | Os 5 temas/disciplinas com pior desempenho (mínimo 2 tentativas) |

---

### 4.5 Módulo de Questões Favoritas

**Objetivo:** Permitir que alunos marquem questões para revisão posterior.

- **Favoritar/Desfavoritar (Toggle):** Uma única chamada alterna o estado de favorito de uma questão
- **Listagem:** Retorna os IDs de todas as questões favoritadas pelo usuário
- Suporte a verificação em lote (batch) passando `questionIds` via query string

---

## 5. Arquitetura Técnica (TO-BE)

### 5.1 Visão de Camadas do Backend

```
HTTP Request
     │
     ▼
┌─────────────────┐
│   Resource      │  @Path, @GET, @POST... — Valida DTO (@Valid) e converte para Entidade
│  (Controller)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │  @ApplicationScoped, @Transactional — Regras de negócio puras
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │  PanacheRepository<T> — Queries customizadas, paginação, filtros
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Model/Entity   │  @Entity, extends BaseEntity — Mapeamento das tabelas PostgreSQL
└─────────────────┘
```

**Regra de responsabilidade de DTOs:**
- `Resource` é a **única camada que converte** entre DTO ↔ Entidade
- `Service` opera **apenas com Entidades de Domínio** puras
- Pacotes: `dto.request` (entrada) e `dto.response` (saída)

### 5.2 Stack de Dependências (Maven / Quarkus)

| Dependência | Finalidade |
|---|---|
| `quarkus-rest` | Endpoints HTTP (JAX-RS) |
| `quarkus-rest-jackson` | Serialização/Desserialização JSON |
| `quarkus-hibernate-validator` | Validação de DTOs (`@Valid`, `@NotBlank`, `@Size`) |
| `quarkus-hibernate-orm-panache` | ORM + Repository Pattern simplificado |
| `quarkus-jdbc-postgresql` | Driver JDBC para PostgreSQL |
| `quarkus-smallrye-jwt` | Autenticação e autorização via JWT |
| `quarkus-elytron-security-properties-file` | Hashing seguro de senhas |
| `quarkus-smallrye-openapi` | Documentação automática da API (Swagger UI) |

### 5.3 Estratégia de Banco de Dados

- **SGBD:** PostgreSQL 16
- **Migração:** Hibernate ORM gerencia a criação/atualização do schema (`database.generation=update`)
- **Modelo:** Relacional, com chaves estrangeiras e constraints de unicidade explícitas
- **PK:** Long + Auto-incremento (IDENTITY) em todas as tabelas
- **Auditoria:** `created_at` e `updated_at` automáticos via `@CreationTimestamp` / `@UpdateTimestamp` na `BaseEntity`

### 5.4 Padrão de Nomenclatura

| Contexto | Idioma | Exemplo |
|---|---|---|
| Classes, Métodos, Variáveis | **Inglês** | `Question`, `getQuestionsByDisciplineId()` |
| Nomes de Tabelas SQL | **Inglês** | `tb_question`, `tb_quiz_result` |
| Mensagens de Erro (usuário) | **Português-BR** | `"Usuário não encontrado"` |
| Logs internos e Exceptions | **Inglês** | `UserNotFoundException` |

### 5.5 Tratamento de Erros

Todas as respostas de erro seguem o formato padronizado `ApiError`:

```json
{
  "timestamp": "2026-06-17T09:30:00",
  "status": 404,
  "error": "Resource Not Found",
  "message": "Usuário não encontrado",
  "path": "/api/auth/me"
}
```

Exceções mapeadas:
- `ResourceNotFoundException` → HTTP 404
- `BusinessException` → HTTP 422 / 400
- Erros de validação (`@Valid`) → HTTP 400 com lista de campos inválidos

---

## 6. Modelo de Dados Relacional (Resumo)

### 6.1 Entidades Principais

| Entidade Java | Tabela SQL | Descrição |
|---|---|---|
| `User` | `tb_user` | Usuários (alunos e admins) |
| `Discipline` | `tb_discipline` | Disciplinas contábeis |
| `Topic` | `tb_topic` | Temas e subtemas (auto-referência) |
| `Question` | `tb_question` | Questões do banco |
| `QuestionOption` | `tb_question_option` | Alternativas de cada questão |
| `Quiz` | `tb_quiz` | Templates de simulados |
| `QuizResult` | `tb_quiz_result` | Tentativas/submissões dos alunos |
| `QuizResultCorrection` | `tb_quiz_result_correction` | Correção detalhada por questão |
| `QuestionFavorite` | `tb_question_favorite` | Questões marcadas como favoritas |

### 6.2 Relacionamentos Chave

- `Discipline` →(1:N)→ `Topic` →(1:N)→ `Topic` (subtemas, auto-referência)
- `Question` ←(N:M)→ `Topic` (via `tb_question_topic`)
- `Quiz` ←(N:M)→ `Question` (via `tb_quiz_question`)
- `QuizResult` →(1:N)→ `QuizResultCorrection`
- `User` →(1:N)→ `QuestionFavorite`

### 6.3 Enums de Domínio

| Enum | Valores |
|---|---|
| `UserSystemRole` | `ADMIN`, `ALUNO` |
| `QuestionType` | `MULTIPLA_ESCOLHA`, `CERTO_ERRADO` |
| `DifficultyLevel` | `FACIL`, `MEDIO`, `DIFICIL` |
| `QuizVisibility` | `PUBLIC`, `PRIVATE` |

---

## 7. Contratos de API (Resumo dos Endpoints)

> Contratos completos (request/response com exemplos JSON) disponíveis em `docs/api_contracts.md`.

### Endpoints por Módulo

| Módulo | Método | Rota | Auth |
|---|---|---|---|
| **Auth** | POST | `/api/auth/login` | Público |
| **Auth** | POST | `/api/auth/register` | Público |
| **Auth** | GET | `/api/auth/me` | JWT |
| **Disciplinas** | GET | `/api/disciplinas` | JWT |
| **Disciplinas** | GET | `/api/disciplinas/:id` | JWT |
| **Disciplinas** | POST | `/api/disciplinas` | JWT (ADMIN) |
| **Disciplinas** | PUT | `/api/disciplinas/:id` | JWT (ADMIN) |
| **Disciplinas** | DELETE | `/api/disciplinas/:id` | JWT (ADMIN) |
| **Temas** | GET | `/api/temas` | JWT |
| **Temas** | POST | `/api/temas` | JWT (ADMIN) |
| **Questões** | GET | `/api/questoes` | JWT |
| **Questões** | POST | `/api/questoes` | JWT (ADMIN) |
| **Quizzes** | GET | `/api/quizzes` | Opcional |
| **Quizzes** | GET | `/api/quizzes/:id` | Opcional |
| **Quizzes** | POST | `/api/quizzes` | JWT (ADMIN) |
| **Quizzes** | POST | `/api/quizzes/generate` | JWT |
| **Quizzes** | PUT | `/api/quizzes/:id` | JWT (ADMIN) |
| **Quizzes** | DELETE | `/api/quizzes/:id` | JWT (ADMIN) |
| **Resultados** | POST | `/api/quizzes/:id/submit` | JWT |
| **Resultados** | GET | `/api/quiz-results/:resultId` | Opcional |
| **Histórico** | GET | `/api/historico` | JWT |
| **Favoritos** | GET | `/api/question-favorites` | JWT |
| **Favoritos** | POST | `/api/questions/:id/favorite` | JWT |
| **Admin** | GET | `/api/admin/stats` | JWT (ADMIN) |

### Padrão de Paginação

Todos os endpoints de listagem seguem o padrão:
```json
{
  "items": [...],
  "page": 1,
  "limit": 10,
  "total": 42,
  "totalPages": 5
}
```

Query params comuns: `page`, `limit`, `filter` (texto), `active` (boolean).

---

## 8. Infraestrutura e Ambiente

### 8.1 Estrutura de Repositórios

```
contaquiz/                     # Monorepo raiz
├── frontend/                  # Next.js (mantido)
├── backend/                   # Quarkus (novo — substituição)
├── docs/                      # Documentação técnica
├── docker-compose.yml         # Ambiente local (PostgreSQL + Backend)
├── docker-compose.prod.yml    # Ambiente de produção
└── Makefile                   # Atalhos de comandos
```

### 8.2 Ambiente Local de Desenvolvimento

O banco de dados é inicializado via Docker:

```bash
make db-up    # Sobe o PostgreSQL local
make dev      # Executa o Quarkus em Live Reload
make test     # Roda todos os testes
```

**Configurações do banco local:**
- Host: `localhost:5432`
- Database: `contaquiz_db`
- User: `postgres`
- Password: `localpassword`

### 8.3 Configurações Globais da API

| Configuração | Valor |
|---|---|
| Porta da API | `8080` |
| CORS Origin (dev) | `http://localhost:3000` |
| JWT Issuer | `https://br.com.techtins.contaquiz` |
| Schema Generation | `update` (Hibernate gerencia automaticamente) |

---

## 9. Roadmap de Desenvolvimento (Sprints)

A execução da refatoração está dividida em 4 sprints. Cada sprint origina Issues no GitHub com o contrato de API correspondente.

| Sprint | Módulos | Fases concluídas de pré-requisito |
|---|---|---|
| **Sprint 1** | Setup do Projeto, BaseEntity, Autenticação (Login, Register, /me) | Fase 4 ✅ |
| **Sprint 2** | CRUDs Administrativos (Disciplinas, Temas, Questões) | Fases 1, 2 e 3 ✅ |
| **Sprint 3** | Módulo do Aluno: Quizzes (criação manual + geração dinâmica) e Submissão | Fase 1 ✅ |
| **Sprint 4** | Histórico, Analytics, Favoritos e Dashboard Admin | Fase 1 ✅ |

> **Status atual:** As fases de preparação (Engenharia Reversa, Shadow Features, Modelagem e Arquitetura) estão **concluídas**. A documentação produzida nessas fases forma a base técnica deste PRD.

---

## 10. Referências e Documentos Relacionados

| Documento | Caminho | Conteúdo |
|---|---|---|
| Plano de Refatoração | `docs/plano_refatoracao_backend.md` | Fases de preparação e execução |
| Contratos de API | `docs/api_contracts.md` | Todos os endpoints com exemplos JSON |
| Arquitetura e Setup | `docs/arquitetura_e_setup.md` | Boilerplate Quarkus, DTOs, Errors, Makefile |
| Modelagem Relacional | `docs/modelagem_banco_relacional.md` | Entidades JPA e DER (Mermaid) |
| Shadow Features | `docs/shadow_features.md` | Funcionalidades não documentadas identificadas |
| User Stories | `docs/[US_0X] *.docx` | Casos de Uso formalizados originais |
| Escopo Inicial | `docs/[Escopo] ContaQuiz.docx` | Documento de escopo original do projeto |

---

*Documento gerado e mantido pela equipe Techtins. Última atualização: Junho 2026.*
