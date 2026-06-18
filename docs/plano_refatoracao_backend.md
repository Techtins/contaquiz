# Plano de Refatoração: Backend ContaQuiz

## Visão Geral
Este documento define as fases de planejamento e execução para a refatoração do backend do projeto ContaQuiz. O objetivo é garantir uma transição segura da tecnologia atual para a nova, assegurando que o frontend não sofra impactos e que a equipe de desenvolvimento tenha tarefas claras e bem definidas.

---

## 1. Mapeamento da Stack Tecnológica
- **Backend Atual:** Node.js + Express
- **Banco de Dados Atual:** MongoDB (NoSQL)
- **Frontend (Será mantido):** React.js + Next.js
- **Nova Stack Backend (Alvo):** Quarkus (Java)
- **Novo Banco de Dados (Alvo):** PostgreSQL (Relacional)
- **Estratégia de Banco (Alvo):** Geração automática/atualização gerenciada pelo Hibernate ORM (`database.generation=update`)

---

## 2. Fases de Preparação (Pré-Issues)
Para que as Issues possam ser criadas com precisão técnica, as seguintes fases devem ser executadas primeiramente.

### Fase 1: Engenharia Reversa e Mapeamento de Contratos (API Contracts)
**Objetivo:** Descobrir e documentar como o frontend e o backend atual se comunicam, garantindo que o novo backend seja um "espelho" perfeito.
* **Ação 1:** Executar a aplicação atual (Node + Frontend) em ambiente local ou homologação.
* **Ação 2:** Navegar tela a tela com a aba "Network/Rede" do navegador aberta.
* **Ação 3:** Para cada ação no sistema, documentar:
  * O verbo HTTP e a rota acessada (Ex: `POST /api/auth/login`).
  * O corpo (Body) exato da requisição enviada.
  * O formato (JSON) da resposta esperada pelo frontend.
  * O mecanismo de autorização (ex: como e onde o Token JWT é enviado).

### Fase 2: Levantamento de Funcionalidades Não Documentadas (Shadow Features)
**Objetivo:** Descobrir as regras de negócio e fluxos que foram desenvolvidos pela equipe anterior, mas não foram formalizados nos documentos do Drive.
* **Ação 1:** Explorar as telas administrativas e de aluno no sistema em execução.
* **Ação 2:** Listar as funcionalidades visuais que não possuem correspondência nos Casos de Uso originais.
* **Ação 3:** Escrever um rascunho (User Story simplificada) detalhando o que cada funcionalidade oculta faz e qual a sua regra de negócio.

### Fase 3: Modelagem Relacional do Banco de Dados (DER)
**Objetivo:** Transformar a estrutura NoSQL atual em um modelo Relacional, preparando o terreno para o PostgreSQL.
* **Ação 1:** Analisar os objetos JSON do MongoDB e as entidades de negócio descobertas.
* **Ação 2:** Criar o Diagrama Entidade-Relacionamento (DER), mapeando:
  * Tabelas principais (Usuarios, Questoes, Disciplinas, Temas, Historico).
  * Chaves Primárias (PKs) e Estrangeiras (FKs).
  * Relacionamentos (1:N, N:M).
* **Ação 3:** Garantir que o Hibernate ORM esteja configurado para criar/atualizar as tabelas automaticamente (`quarkus.hibernate-orm.database.generation=update`) com base nas entidades Java mapeadas.

### Fase 4: Definição da Arquitetura do Novo Backend
**Objetivo:** Estabelecer o padrão de projeto (Boilerplate) para evitar que a nova equipe codifique sem padronização.
* **Ação 1:** Definir a estrutura de pacotes/camadas no Quarkus (ex: `Resource` -> `Service` -> `Repository`).
* **Ação 2:** Configurar o repositório base com:
  * Dependências essenciais (`hibernate-orm-panache`, `jdbc-postgresql`, `smallrye-jwt`).
  * Tratamento global de exceções para padronizar o retorno de erros ao frontend.

---

## 3. Fase de Execução (Criação de Issues)
**Objetivo:** Após concluir as Fases 1 a 4, traduzir todo o conhecimento levantado em Sprints e Issues para a equipe de devs.
* **Ação 1:** Criar Sprints (Milestones) no GitHub agrupando o trabalho. Exemplo de Roadmap:
  * **Sprint 1:** Setup do Projeto, Autenticação e Perfis.
  * **Sprint 2:** CRUDs Administrativos (Disciplinas, Temas, Questões).
  * **Sprint 3:** Módulo do Aluno e Resolução de Quizzes.
  * **Sprint 4:** Dashboards, Histórico e Relatórios.
* **Ação 2:** Gerar as Issues contendo:
  * Descrição de negócio (A User Story).
  * O Contrato da API esperado (levantado na Fase 1).
  * O relacionamento do banco impactado (levantado na Fase 3).
  * Dicas de implementação do Quarkus.
