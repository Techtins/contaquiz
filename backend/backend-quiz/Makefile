.PHONY: help start stop restart logs db-up db-down db-logs clean

help: ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

start: ## Inicia o ambiente completo (DB + App)
	@echo "🚀 Iniciando ambiente de desenvolvimento..."
	@docker compose up -d postgres
	@echo "⏳ Aguardando PostgreSQL..."
	@until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do sleep 1; done
	@echo "✅ PostgreSQL pronto!"
	@echo "🔧 Iniciando Quarkus..."
	@./mvnw quarkus:dev

stop: ## Para todos os serviços
	@echo "🛑 Parando serviços..."
	@docker compose down

restart: stop start ## Reinicia todos os serviços

logs: ## Mostra logs do PostgreSQL
	@docker compose logs -f postgres

db-up: ## Sobe apenas o PostgreSQL
	@echo "📦 Subindo PostgreSQL..."
	@docker compose up -d postgres
	@echo "⏳ Aguardando PostgreSQL..."
	@until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do sleep 1; done
	@echo "✅ PostgreSQL pronto!"

db-down: ## Para o PostgreSQL
	@docker compose down postgres

db-logs: logs ## Alias para logs

clean: ## Remove volumes e limpa o ambiente
	@echo "🧹 Limpando ambiente..."
	@docker compose down -v
	@./mvnw clean
	@echo "✨ Ambiente limpo!"
