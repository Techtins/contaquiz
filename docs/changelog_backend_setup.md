# Changelog — Setup Inicial do Projeto Quarkus

Registro dos últimos 3 commits na branch `12-backend-setup-inicial-do-projeto-quarkus`.

---

## 1. `95fb5cf` — chore: create quarkus setup & docker compose & update makefile

**Descrição:**  
Geração do projeto Quarkus via [code.quarkus.io](https://code.quarkus.io) e integração com a estrutura Docker existente.

**Arquivos criados/modificados:**
- `backend/backend-quiz/` — Projeto Maven (`pom.xml`) com as dependências:
  - REST, REST Jackson, Hibernate Validator, Hibernate ORM with Panache
  - JDBC PostgreSQL, SmallRye JWT, SmallRye OpenAPI, Elytron Security
- `backend/backend-quiz/.mvn/wrapper/maven-wrapper.properties` — Wrapper Maven
- `backend/backend-quiz/mvnw` / `mvnw.cmd` — Scripts do Maven Wrapper
- `backend/backend-quiz/Dockerfile` — Dockerfile base
- `backend/backend-quiz/src/main/docker/Dockerfile.jvm`, `.legacy-jar`, `.native`, `.native-micro` — Dockerfiles para diferentes modos de build
- `backend/backend-quiz/src/main/resources/application.properties` — Configurações de porta, CORS, banco PostgreSQL e JWT
- `docker-compose.yml` — Adicionado serviço `backend` com build context `./backend/backend-quiz` e healthcheck do PostgreSQL
- `docker-compose.prod.yml` — Ajustes para produção
- `docker-compose-legado.yml` — Versão legada do compose
- `Makefile` — Comandos `dev`, `build`, `test`, `clean` apontando para `backend/backend-quiz/`
- `.env.example` — Atualizado com variáveis do backend

---

## 2. `02dd256` — chore: updated the makefile following the architecture_and_setup.md documentation

**Descrição:**  
Reestruturação do `Makefile` para seguir o modelo da seção 6 da documentação `docs/arquitetura_e_setup.md`.

**Arquivos modificados:**
- `Makefile` — Adicionados comandos:
  - `setup` — Sobe o full stack com Docker Compose
  - `up`, `down`, `restart`, `logs`, `logs-back`, `logs-front`, `logs-db`, `status`
  - `shell-back`, `shell-front`, `seed`, `prod-build`, `prod-up`, `prod-down`, `reinstall`
  - Comandos Maven ajustados com `cd backend/backend-quiz`

---

## 3. `c2a4c4a` — feat: add BaseEntity.java & exception mappers and classes

**Descrição:**  
Criação das classes base de modelo e do sistema global de tratamento de erros, conforme seções 3 e 8 da documentação.

**Arquivos criados (7 arquivos):**

### Modelo
- `br.com.techtins.contaquiz.model.BaseEntity` — Classe abstrata `@MappedSuperclass` com:
  - `id` (auto-increment), `createdAt`, `updatedAt` (timestamps automáticos), `active` (soft-delete)

### DTO de Erro
- `br.com.techtins.contaquiz.dto.response.ApiError` — DTO padrão de resposta de erro com:
  - `timestamp`, `status`, `error`, `message`, `path`

### Exceções de Domínio
- `br.com.techtins.contaquiz.exception.BusinessException` — `RuntimeException` base para violações de regras de negócio (HTTP 422)
- `br.com.techtins.contaquiz.exception.ResourceNotFoundException` — `RuntimeException` para recursos não encontrados (HTTP 404)

### Mappers (Exception → ApiError)
- `br.com.techtins.contaquiz.exception.ResourceNotFoundExceptionMapper` — Mapeia `ResourceNotFoundException` → HTTP 404 com `ApiError`
- `br.com.techtins.contaquiz.exception.BusinessExceptionMapper` — Mapeia `BusinessException` → HTTP 422 com `ApiError`
- `br.com.techtins.contaquiz.exception.GeneralExceptionMapper` — Catch-all para `Exception` → HTTP 500 com `ApiError`

---

**Referência:** `docs/arquitetura_e_setup.md` — Seções 3 (BaseEntity), 6 (Makefile), 8 (Tratamento de Erros) e 9 (Configurações).
