# Definição da Arquitetura e Setup do Novo Backend (Fase 4)

Este documento estabelece as diretrizes de onboarding, as dependências oficiais e o padrão de projeto (Boilerplate) para guiar o setup do ambiente e padronizar o desenvolvimento da equipe no ecossistema Quarkus (Java).

---

## 1. Setup do Projeto e Onboarding

A equipe de desenvolvimento deve iniciar o repositório do backend utilizando o configurador visual oficial do Quarkus.

1. Acesse o site oficial: [code.quarkus.io](https://code.quarkus.io/).
2. Configure as seguintes informações do projeto Maven:
   * **Group:** `br.com.techtins.contaquiz`
   * **Artifact:** `backend-quiz`
   * **Build Tool:** `Maven`
   * **Java Version:** `21` (recomendado)
3. Selecione e adicione as seguintes dependências oficiais no campo de busca:
   * **REST (quarkus-rest):** Para criação dos endpoints HTTP.
   * **REST Jackson (quarkus-rest-jackson):** Serializador/Desserializador JSON padrão.
   * **Hibernate Validator (quarkus-hibernate-validator):** Validação de inputs nos DTOs/Requests.
   * **Hibernate ORM with Panache (quarkus-hibernate-orm-panache):** Acesso simplificado a dados via Repository pattern.
   * **JDBC Driver - PostgreSQL (quarkus-jdbc-postgresql):** Driver nativo para conexão com o PostgreSQL.
   * **SmallRye JWT (quarkus-smallrye-jwt):** Segurança de rotas e manipulação/leitura do token JWT.
   * **Elytron Security Properties File (quarkus-elytron-security-properties-file):** Mecanismo de segurança do Elytron para hashing e validação de senhas com algoritmos seguros no Quarkus.
   * **SmallRye OpenAPI (quarkus-smallrye-openapi):** Geração e exposição do Swagger UI para documentar endpoints.
4. Clique em **"Generate your application"**, faça o download do arquivo `.zip` e extraia-o no repositório do backend.

*Nota: As ferramentas básicas de teste como JUnit 5 e REST Assured já vêm incluídas por padrão na estrutura de testes (`src/test`) do projeto gerado pelo code.quarkus.io.*

---

## 2. Estrutura de Camadas (Arquitetura sem Interfaces)

A fim de simplificar o desenvolvimento mantendo a coesão, a aplicação será construída sobre 4 camadas concretas, sem a utilização de interfaces abstratas para serviços:

1. **Resource (Controller):** Porta de entrada das requisições HTTP (`@Path`, `@GET`, `@POST`, etc.). Valida o DTO de entrada via `@Valid` e aciona diretamente a classe Service correspondente.
2. **Service:** Concentra toda a lógica de negócio do sistema. Anotada com `@ApplicationScoped` e `@Transactional`. Não criaremos interfaces intermediárias para os serviços (ex: `UserService` será diretamente uma classe concreta injetada por `@Inject`).
3. **Repository:** Implementará `PanacheRepository<Entidade>`. Concentra as consultas customizadas do banco de dados (filtros, paginações, projeções), deixando o código do banco separado do modelo e do serviço.
4. **Model (Entities):** Classes anotadas com `@Entity` que representam a modelagem das tabelas mapeadas no banco relacional.

---

## 3. Padronização da Entidade Base (`BaseEntity`)

Para evitar redundância de código e garantir a consistência das chaves primárias e das datas de auditoria, todas as entidades de domínio devem obrigatoriamente herdar de uma entidade abstrata comum. 

As entidades de domínio devem ser classes Java puras; os getters, setters e construtores padrão devem ser gerados de forma nativa pela IDE (sem o uso de Lombok).

* **Classe Abstrata:** `BaseEntity.java`
* **Localização:** Pacote `br.com.techtins.contaquiz.model`
* **Código de Referência:**

```java
package br.com.techtins.contaquiz.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean active = true;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
```

---

## 4. Padronização de Idioma (Inglês)

Para garantir a consistência com o frontend React/Next.js já existente, evitar retrabalho de serialização e seguir as melhores práticas globais de engenharia de software, fica definida a seguinte diretriz de idioma para todo o código-fonte do backend:

1. **Nomes de Classes e Interfaces:** Devem ser estritamente em inglês.
   * **Correto:** `Question`, `Topic`, `Discipline`, `QuizResult`
   * **Incorreto:** `Questao`, `Tema`, `Disciplina`, `ResultadoQuiz`
2. **Métodos e Funções:** Devem utilizar verbos e substantivos em inglês.
   * **Correto:** `getQuestionsByDisciplineId()`, `calculateScore()`, `saveUser()`
   * **Incorreto:** `getQuestoesPorDisciplina()`, `calcularNota()`, `salvarUsuario()`
3. **Variáveis e Atributos de Classe:** Devem ser em inglês, correspondendo exatamente às propriedades das payloads JSON esperadas pelo frontend.
   * **Correto:** `statement`, `difficulty`, `options`
   * **Incorreto:** `enunciado`, `dificuldade`, `alternativas`
4. **Mensagens de Log de Console e Exceptions:** Logs internos e nomes de exceções personalizadas devem ser escritos em inglês (ex: `UserNotFoundException`).
   * *Nota: Apenas as mensagens retornadas diretamente ao usuário na tela (caso haja alguma de validação negada) podem ser escritas em português (PT-BR) no DTO de erro.*

A mistura de idiomas ("Portinglês") deve ser ativamente evitada em revisões de código.

---

## 5. Infraestrutura e Dockerização

Para padronizar o ambiente local de desenvolvimento e simplificar a implantação em produção (Staging/Production), utilizaremos **Docker** e **Docker Compose** para orquestrar o backend e o banco de dados PostgreSQL.

### 5.1 Dockerfile (JVM Mode)
Por padrão, o Quarkus gerará arquivos Dockerfile na pasta `src/main/docker/`. Utilizaremos a versão JVM (Java Virtual Machine) para desenvolvimento rápido, mas o Quarkus também suporta Native Mode (compilação AOT com GraalVM).

O `Dockerfile` básico para a JVM (gerado pelo Quarkus e recomendado para o build) deve conter:
```dockerfile
FROM registry.access.redhat.com/ubi8/openjdk-21:1.18

ENV LANGUAGE='en_US:en'

# Copia as dependências e o runner gerado pelo Maven
COPY --chown=185 target/quarkus-app/lib/ /deployments/lib/
COPY --chown=185 target/quarkus-app/*.jar /deployments/
COPY --chown=185 target/quarkus-app/app/ /deployments/app/
COPY --chown=185 target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/deployments/run-java.sh" ]
```

### 5.2 Ambiente Local (`docker-compose.yml`)
Para executar o banco de dados PostgreSQL localmente, a equipe de desenvolvimento deve subir um container PostgreSQL com o seguinte arquivo `docker-compose.yml` na raiz do projeto:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: contaquiz-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: localpassword
      POSTGRES_DB: contaquiz_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - contaquiz-net

networks:
  contaquiz-net:
    driver: bridge

volumes:
  pgdata:
    driver: local
```

---

## 6. Automação com Makefile

Para acelerar o onboarding dos desenvolvedores, criaremos um `Makefile` na raiz do projeto contendo atalhos para os comandos mais frequentes (builds, execução local, testes e limpeza).

### 6.1 Código de Referência do `Makefile`
```makefile
# Variáveis do Projeto
MVN = ./mvnw
DOCKER_IMAGE = techtins/contaquiz-backend:latest

.PHONY: help dev build test clean db-up db-down docker-build docker-run

help:
	@echo "Comandos disponíveis:"
	@echo "  make dev          - Executa o Quarkus em Live Reload (Dev Mode)"
	@echo "  make build        - Compila a aplicação gerando o jar executável"
	@echo "  make test         - Executa todos os testes de unidade e integração"
	@echo "  make clean        - Limpa a pasta target do Maven"
	@echo "  make db-up        - Sobe o banco PostgreSQL local no Docker"
	@echo "  make db-down      - Para o banco PostgreSQL local"
	@echo "  make docker-build - Compila e constrói a imagem Docker (JVM Mode)"
	@echo "  make docker-run   - Executa a imagem Docker gerada localmente"

# Desenvolvimento e Build
dev:
	$(MVN) quarkus:dev

build:
	$(MVN) clean package -DskipTests

test:
	$(MVN) test

clean:
	$(MVN) clean

# Banco de Dados Local (Docker)
db-up:
	docker compose up -d postgres

db-down:
	docker compose down

# Dockerização do Backend
docker-build:
	$(MVN) clean package -DskipTests
	docker build -f src/main/docker/Dockerfile.jvm -t $(DOCKER_IMAGE) .

docker-run:
	docker run -i --rm -p 8080:8080 --network contaquiz-net $(DOCKER_IMAGE)
```

---

## 7. Uso e Conversão de DTOs (Data Transfer Objects)

Para manter a integridade dos dados de banco e evitar vazamento de estruturas internas para o cliente (frontend), utilizaremos obrigatoriamente DTOs para tráfego de rede.

### 7.1 Divisão de Pacotes
Os DTOs devem ser organizados em pacotes separados de acordo com a direção do dado:
* `br.com.techtins.contaquiz.dto.request`: Contém os dados enviados pelo frontend (ex: `LoginRequestDTO`, `QuestionCreateRequestDTO`).
* `br.com.techtins.contaquiz.dto.response`: Contém os dados retornados ao frontend (ex: `UserResponseDTO`, `QuestionResponseDTO`).

### 7.2 Regras de Conversão e Responsabilidade
* **Camada de Serviço (`Service`):** Lida **apenas com Entidades de Domínio Puras** (ex: `User`, `Question`) e tipos primitivos. Ela recebe entidades como argumento, aplica regras de negócio e retorna entidades salvas ou atualizadas.
* **Camada de Controle (`Resource`):** É a **única responsável pela conversão** bidirecional entre DTOs e Entidades de Domínio.
  * *Entrada (HTTP -> DB):* O endpoint do Resource recebe um `RequestDTO` validado, converte-o em uma entidade pura e chama o Service correspondente.
  * *Saída (DB -> HTTP):* O Resource recebe a entidade pura de retorno do Service, converte-a no respectivo `ResponseDTO` e a devolve no corpo da resposta HTTP.

---

## 8. Padronização do Tratamento de Erros e Exceções Globais

Para evitar que erros de runtime ou de validação quebrem o frontend ou exponham stacktraces Java, o backend usará um tratador global de exceções.

### 8.1 DTO Padrão de Resposta de Erro (`ApiError`)
Toda resposta de erro retornada pela API deve seguir estritamente o formato JSON estruturado na classe `ApiError`:

* Localização: `br.com.techtins.contaquiz.dto.response.ApiError`
* Propriedades:
  * `timestamp` (LocalDateTime) — Instante que ocorreu o erro.
  * `status` (Integer) — O código de status HTTP (ex: 404, 400).
  * `error` (String) — A descrição curta do erro (ex: "Not Found").
  * `message` (String) — Detalhes amigáveis sobre a causa do erro.
  * `path` (String) — Rota/Endpoint HTTP onde o erro foi disparado.

### 8.2 Exceções de Domínio Personalizadas
Criaremos exceções não-verificadas (RuntimeException) herdando de uma exceção de negócio base (`BusinessException`):
* `BusinessException`: Base para erros de validações de regras de negócios (HTTP 422 Unprocessable Entity ou 400 Bad Request).
* `ResourceNotFoundException`: Disparada quando um recurso buscado pelo ID não existe (HTTP 404 Not Found).

### 8.3 Mapeamento de Exceções (`ExceptionMapper`)
Para interceptar as exceções e formatá-las como `ApiError`, usaremos a interface `ExceptionMapper` do JAX-RS com `@Provider`:

* Exemplo de classe mapper para `ResourceNotFoundException`:
```java
package br.com.techtins.contaquiz.exception;

import br.com.techtins.contaquiz.dto.response.ApiError;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.LocalDateTime;

@Provider
public class ResourceNotFoundExceptionMapper implements ExceptionMapper<ResourceNotFoundException> {

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(ResourceNotFoundException exception) {
        ApiError error = new ApiError();
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(Response.Status.NOT_FOUND.getStatusCode());
        error.setError("Resource Not Found");
        error.setMessage(exception.getMessage());
        error.setPath(uriInfo.getPath());

        return Response.status(Response.Status.NOT_FOUND)
                       .entity(error)
                       .build();
    }
}
```

---

## 9. Configurações Globais (`application.properties`)

Arquivo básico de configuração inicial para configurar o banco de dados PostgreSQL, a estratégia de atualização do Hibernate ORM e as regras de CORS:

```properties
# ==========================================
# Configurações do Servidor
# ==========================================
quarkus.http.port=8080

# Configuração de CORS (Habilitado para o Frontend local)
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:3000
quarkus.http.cors.headers=accept, authorization, content-type
quarkus.http.cors.methods=GET, POST, PUT, DELETE, OPTIONS

# ==========================================
# Configurações de Banco de Dados (PostgreSQL)
# ==========================================
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=postgres
quarkus.datasource.password=localpassword
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/contaquiz_db

# Hibernate ORM - Geração Automática das Tabelas
quarkus.hibernate-orm.database.generation=update
quarkus.hibernate-orm.log.sql=true

# ==========================================
# Segurança e Token JWT
# ==========================================
# Configurações de leitura e assinatura de Tokens do Elytron e SmallRye JWT
mp.jwt.verify.issuer=https://br.com.techtins.contaquiz
```


