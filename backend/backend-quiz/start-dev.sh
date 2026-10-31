#!/bin/bash
set -e

echo "🚀 Iniciando ambiente de desenvolvimento ContaQuiz..."

# Se usar Podman, assegura que o socket do Podman está ativo para o DevServices
if command -v podman &> /dev/null; then
    echo "📦 Detectado Podman. Assegurando podman.socket ativo..."
    systemctl --user start podman.socket 2>/dev/null || true
fi

echo "🔧 Iniciando aplicação Quarkus (DevServices iniciará o PostgreSQL automaticamente)..."
./mvnw quarkus:dev
