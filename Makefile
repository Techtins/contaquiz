MVN = ./mvnw
DOCKER_IMAGE = techtins/contaquiz-backend:latest

.PHONY: help dev build test clean db-up db-down docker-build docker-run \
        setup up down restart logs logs-back logs-db logs-front \
        status shell-back shell-front seed prod-build prod-up prod-down reinstall

help:
	@echo "Comandos disponiveis:"
	@echo "  make dev          - Executa o Quarkus em Live Reload (Dev Mode)"
	@echo "  make build        - Compila a aplicacao gerando o jar executavel"
	@echo "  make test         - Executa todos os testes de unidade e integracao"
	@echo "  make clean        - Limpa a pasta target do Maven"
	@echo "  make db-up        - Sobe o banco PostgreSQL local no Docker"
	@echo "  make db-down      - Para o banco PostgreSQL local"
	@echo "  make docker-build - Compila e constroi a imagem Docker (JVM Mode)"
	@echo "  make docker-run   - Executa a imagem Docker gerada localmente"
	@echo "  make setup        - Sobe o ambiente completo (full stack)"
	@echo "  make logs-db      - Mostra logs do PostgreSQL"

# Desenvolvimento e Build (Maven local)
dev:
	cd backend/backend-quiz && $(MVN) quarkus:dev

build:
	cd backend/backend-quiz && $(MVN) clean package -DskipTests

test:
	cd backend/backend-quiz && $(MVN) test

clean:
	cd backend/backend-quiz && $(MVN) clean

# Banco de Dados Local (Docker)
db-up:
	docker compose up -d postgres

db-down:
	docker compose down

# Dockerizacao do Backend
docker-build:
	cd backend/backend-quiz && $(MVN) clean package -DskipTests
	cd backend/backend-quiz && docker build -f src/main/docker/Dockerfile.jvm -t $(DOCKER_IMAGE) .

docker-run:
	docker run -i --rm -p 8080:8080 --network contaquiz-net $(DOCKER_IMAGE)

# --- Full Stack (Docker Compose) ---

setup:
	@test -f .env || cp .env.example .env
	docker compose build
	docker compose up -d
	@echo ""
	@echo "ContaQuiz rodando:"
	@echo "  Frontend:   http://localhost:3000"
	@echo "  Backend:    http://localhost:8080"
	@echo "  PostgreSQL: localhost:5432"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

logs-back:
	docker compose logs -f backend

logs-front:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f postgres

status:
	docker compose ps

shell-back:
	docker compose exec backend sh

shell-front:
	docker compose exec frontend sh

seed:
	@echo "Use 'docker compose exec backend curl -X POST http://localhost:8080/seed' ou o endpoint adequado"

prod-build:
	docker compose build

prod-up:
	docker compose up -d

prod-down:
	docker compose down

reinstall:
	docker compose down -v
	docker compose build --no-cache
	docker compose up -d
