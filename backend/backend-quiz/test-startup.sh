#!/bin/bash
set -e

echo "🧪 Testando configuração do ContaQuiz Backend..."
echo ""

# Verificar Java
echo "📌 Verificando Java..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    echo "   ✅ Java $JAVA_VERSION instalado"
    if [ "$JAVA_VERSION" -lt 17 ]; then
        echo "   ⚠️  Aviso: Java 17+ é recomendado"
    fi
else
    echo "   ❌ Java não encontrado"
    exit 1
fi

# Verificar Maven
echo "📌 Verificando Maven..."
if [ -f "./mvnw" ]; then
    echo "   ✅ Maven Wrapper encontrado"
else
    echo "   ❌ mvnw não encontrado"
    exit 1
fi

# Verificar Docker (para DevServices)
echo "📌 Verificando Docker (para DevServices)..."
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo "   ✅ Docker instalado e rodando"
    else
        echo "   ⚠️  Docker instalado mas não está rodando"
        echo "      Inicie o Docker ou use PostgreSQL local"
    fi
else
    echo "   ⚠️  Docker não encontrado"
    echo "      DevServices não funcionará. Use PostgreSQL local."
fi

# Verificar seed.sql
echo "📌 Verificando seed.sql..."
if [ -f "src/main/resources/db/seed.sql" ]; then
    LINES=$(wc -l < src/main/resources/db/seed.sql)
    echo "   ✅ seed.sql encontrado ($LINES linhas)"
else
    echo "   ❌ seed.sql não encontrado em src/main/resources/db/"
    exit 1
fi

# Verificar application.properties
echo "📌 Verificando application.properties..."
if grep -q "quarkus.datasource.devservices.enabled" src/main/resources/application.properties; then
    echo "   ✅ DevServices configurado"
else
    echo "   ⚠️  DevServices não configurado"
fi

echo ""
echo "✨ Verificação completa!"
echo ""
echo "Para iniciar a aplicação, execute:"
echo "   ./mvnw quarkus:dev"
echo ""
echo "Ou use o guia rápido:"
echo "   cat QUICKSTART.md"
