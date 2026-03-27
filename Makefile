.PHONY: build setup up down restart logs logs-back logs-front logs-mongo \
       status shell-back shell-front seed prod-build prod-up prod-down clean reinstall

# --- Desenvolvimento ---

build:
	docker compose build

setup:
	@test -f .env || cp .env.example .env
	docker compose build
	docker compose up -d
	@echo ""
	@echo "ContaQuiz rodando:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:5000"
	@echo "  MongoDB:  localhost:27017"

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

logs-mongo:
	docker compose logs -f mongo

status:
	docker compose ps

shell-back:
	docker compose exec backend sh

shell-front:
	docker compose exec frontend sh

seed:
	docker compose exec backend npm run seed

# --- Producao ---

prod-build:
	docker compose -f docker-compose.prod.yml build

prod-up:
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.prod.yml down

# --- Utilitarios ---

clean:
	docker compose down -v --rmi local
	docker compose -f docker-compose.prod.yml down -v --rmi local 2>/dev/null || true
	@echo "Containers, volumes e imagens locais removidos."

reinstall:
	docker compose down -v
	docker compose build --no-cache
	docker compose up -d
