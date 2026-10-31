# ContaQuiz Backend

Backend da aplicação ContaQuiz desenvolvido com Quarkus, the Supersonic Subatomic Java Framework.

## 📋 Pré-requisitos

- Java 17+
- Maven 3.8+
- PostgreSQL 16+ (local ou Docker)

## 🚀 Como executar

### 🎯 Opção 1: Modo DevServices (RECOMENDADO - mais simples!)

O Quarkus sobe automaticamente um PostgreSQL em container. Só precisa ter Docker instalado:

```bash
./mvnw quarkus:dev
```

✨ **Pronto!** O Quarkus irá:
- Baixar e iniciar PostgreSQL 16 em container automaticamente
- Criar o banco de dados `contaquiz_db`
- Criar todas as tabelas
- Popular com dados de teste do `seed.sql`
- A aplicação estará em http://localhost:8080

### Opção 2: Usando PostgreSQL local existente

Se você já tem PostgreSQL rodando localmente e quer usá-lo:

```bash
# Desabilitar DevServices
export DEVSERVICES_ENABLED=false

# Configurar credenciais (se necessário)
export DB_PASSWORD=sua_senha_postgres

# Criar banco (se não existir)
psql -U postgres -c "CREATE DATABASE contaquiz_db;"

# Iniciar aplicação
./mvnw quarkus:dev
```

### Opção 3: Docker Compose manual (porta 5433)

Se preferir controle total do container:

```bash
make start
# ou
docker compose up -d postgres
./mvnw quarkus:dev
```

## 📝 Comandos úteis (Makefile)

```bash
make help       # Mostra todos os comandos disponíveis
make start      # Inicia PostgreSQL + aplicação
make stop       # Para todos os serviços
make db-up      # Apenas sobe o PostgreSQL
make db-logs    # Mostra logs do banco
make clean      # Remove volumes e limpa o projeto
```

## 🔧 Configuração

As configurações podem ser ajustadas via:
- Arquivo `.env` (copie `.env.example`)
- Variáveis de ambiente
- `src/main/resources/application.properties`

### Variáveis importantes:

- `DB_USER`: usuário do PostgreSQL (padrão: postgres)
- `DB_PASSWORD`: senha do PostgreSQL (padrão: localpassword)
- `DB_URL`: URL de conexão JDBC
- `PORT`: porta HTTP da aplicação (padrão: 8080)

## 📊 Banco de Dados

O banco é automaticamente:
- Criado com as tabelas (drop-and-create)
- Populado com dados de teste (seed.sql) em modo dev

Para desabilitar o seed automático, ajuste:
```properties
quarkus.hibernate-orm.database.generation=update
# quarkus.hibernate-orm.sql-load-script=db/seed.sql
```

## 🔐 Segurança

- Autenticação JWT
- Senhas com Argon2id (padrões OWASP 2024)
- CORS configurável

## 🧪 Testes

```bash
./mvnw test
```

## 📦 Build e Empacotamento

### JAR padrão
```bash
./mvnw package
```

Produz `quarkus-run.jar` em `target/quarkus-app/` (execute com `java -jar target/quarkus-app/quarkus-run.jar`).

### Über-JAR
```bash
./mvnw package -Dquarkus.package.jar.type=uber-jar
```

### Executável nativo
```bash
./mvnw package -Dnative
# ou com container build:
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

## 📚 Documentação da API

Com a aplicação rodando, acesse:
- Dev UI: http://localhost:8080/q/dev/
- Swagger UI: http://localhost:8080/q/swagger-ui
- OpenAPI spec: http://localhost:8080/q/openapi

## ⚠️ Troubleshooting

### Erro de autenticação no PostgreSQL

Se você ver "password authentication failed for user postgres":

1. Verifique a senha no PostgreSQL local:
```bash
psql -U postgres -c "ALTER USER postgres PASSWORD ‘localpassword’;"
```

2. Ou configure a senha correta via variável:
```bash
export DB_PASSWORD=sua_senha_real
./mvnw quarkus:dev
```

### Porta 5432 já em uso

Você tem PostgreSQL local rodando. Escolha:
- Use o PostgreSQL local (opção 1)
- Ou use Docker na porta 5433 (opção 2)

### Database não existe

```bash
psql -U postgres -c "CREATE DATABASE contaquiz_db;"
```

## 📖 Guias Relacionados

- REST ([guide](https://quarkus.io/guides/rest)): Build RESTful web services and APIs using Jakarta REST
- Hibernate Validator ([guide](https://quarkus.io/guides/validation)): Bean validation using Hibernate Validator
- SmallRye OpenAPI ([guide](https://quarkus.io/guides/openapi-swaggerui)): Generate OpenAPI schemas and Swagger UI
- REST Jackson ([guide](https://quarkus.io/guides/rest#json-serialisation)): Jackson serialization support
- Hibernate ORM with Panache ([guide](https://quarkus.io/guides/hibernate-orm-panache)): Simplified JPA/Hibernate data access
- SmallRye JWT ([guide](https://quarkus.io/guides/security-jwt)): Secure applications with JSON Web Token
- JDBC PostgreSQL ([guide](https://quarkus.io/guides/datasource)): Connect to PostgreSQL via JDBC

---

💡 **Dica**: Para mais informações sobre Quarkus, visite [quarkus.io](https://quarkus.io/).
