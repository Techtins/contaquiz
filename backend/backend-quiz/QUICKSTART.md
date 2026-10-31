# 🚀 Início Rápido - ContaQuiz Backend

## Para começar AGORA (30 segundos):

```bash
./mvnw quarkus:dev
```

**Pronto!** 🎉

O Quarkus irá automaticamente:
- ✅ Baixar PostgreSQL 16 (se necessário)
- ✅ Iniciar PostgreSQL em container
- ✅ Criar banco `contaquiz_db`
- ✅ Criar todas as tabelas
- ✅ Popular com dados do `seed.sql`
- ✅ Iniciar aplicação em http://localhost:8080

### 📊 Dados de teste incluídos:

O `seed.sql` popula automaticamente:
- Disciplinas (Contabilidade, Legislação, etc.)
- Tópicos por disciplina
- Questões de exemplo (estilo CRC/Exame de Suficiência)
- Usuários de teste

### 🔧 Endpoints disponíveis:

- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/q/swagger-ui
- **Dev UI**: http://localhost:8080/q/dev
- **Health**: http://localhost:8080/q/health

### 📝 Status atual do projeto:

Conforme último desenvolvedor:
> "Deixei um arquivo seed.sql para popular o banco de dados pra vocês testarem mais fácil, e atualmente acredito que apenas o recurso /users que está incompleto, pois está sem paginação e sem proteção por role. No mais, pelos meus testes está funcional até onde progredi"

**Funcional**:
- ✅ Autenticação JWT
- ✅ Gestão de disciplinas
- ✅ Gestão de tópicos
- ✅ Gestão de questões
- ✅ Geração dinâmica de quizzes
- ✅ Submissão e correção automática
- ✅ Histórico de tentativas

**Pendente**:
- ⚠️ `/users` - falta paginação e proteção por role

### 🛑 Para parar:

Pressione `Ctrl+C` no terminal onde o Quarkus está rodando.

O container PostgreSQL será parado automaticamente.

---

## Alternativas (se não quiser usar DevServices):

### Usar seu PostgreSQL local:
```bash
export DEVSERVICES_ENABLED=false
export DB_PASSWORD=sua_senha
./mvnw quarkus:dev
```

### Usar Docker Compose manual:
```bash
make start
```

---

## Troubleshooting

### "Port 5432 already in use"
Normal! Você tem PostgreSQL local rodando. DevServices usa outra porta automaticamente.

### "Docker not found"
Instale Docker ou use PostgreSQL local (veja alternativas acima).

### Quer ver logs do banco?
```bash
docker ps  # veja o container
docker logs -f <container-name>
```

---

**💡 Dica**: Para desenvolvimento, DevServices é a forma mais simples. O banco é limpo e recriado a cada execução com os dados do seed.sql!
