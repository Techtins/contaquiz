.PHONY: build setup up down restart logs logs-back logs-db logs-front \
        status shell-back shell-front seed prod-build prod-up prod-down clean reinstall \
        dev db-up db-down test

# --- Desenvolvimento ---

build:
	docker compose build

dev setup:
	docker compose build
	docker compose up -d
	@echo ""
	@echo "ContaQuiz rodando:"
	@echo "  Frontend:   http://localhost:3000"
	@echo "  Backend:    http://localhost:8080"
	@echo "  PostgreSQL: localhost:5432"

db-up up:
	docker compose up -d

db-down down:
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

test:
	docker run --rm -v "$(shell pwd)/backend/backend-quiz:/app" -w /app maven:3-eclipse-temurin-25 ./mvnw test

# --- Producao ---

prod-build:
	docker compose build

prod-up:
	docker compose up -d

prod-down:
	docker compose down

# --- Utilitarios ---

clean:
	docker compose down -v --rmi local
	@echo "Containers, volumes e imagens locais removidos."

reinstall:
	docker compose down -v
	docker compose build --no-cache
	docker compose up -d
