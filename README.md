# ContaQuiz

Plataforma de quizzes para estudantes de contabilidade. Backend em Node.js/Express, frontend em Next.js, banco de dados MongoDB.

## Pre-requisitos

- Docker >= 24.0
- Docker Compose >= 2.20
- Make (opcional, para comandos abreviados)
sudo usermod -aG docker $USER

## Quick start

```bash
cp .env.example .env
make setup
make seed
```

Ou sem Make:

```bash
cp .env.example .env
docker compose build
docker compose up -d
docker compose exec backend npm run seed
```

Apos subir, acesse:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
É normal dar route not found com o link acima va em index.ts na pasta routes para ver os endpoints da api
- Health check: http://localhost:5000/api/healthz

## Credenciais de acesso

Apos rodar o seed, os seguintes usuarios estarao disponiveis:

| Perfil | E-mail               | Senha    |
|--------|----------------------|----------|
| Admin  | admin@contaquiz.com  | admin123 |
| Aluno  | aluno@contaquiz.com  | aluno123 |

## Arquitetura

```
Browser (porta 3000) --> Next.js --> Express API (porta 5000) --> MongoDB (porta 27017)
```

| Servico  | Tecnologia                        | Porta |
|----------|-----------------------------------|-------|
| Frontend | Next.js 15, React 19, TypeScript  | 3000  |
| Backend  | Express 5, TypeScript, Mongoose 8 | 5000  |
| Banco    | MongoDB 7                         | 27017 |

## Autenticacao

O sistema utiliza JWT (JSON Web Token) para autenticacao:

- `POST /api/auth/register` -- cria uma conta de aluno
- `POST /api/auth/login` -- autentica e retorna um token JWT
- `GET /api/auth/me` -- retorna os dados do usuario autenticado

O token e armazenado no localStorage do navegador e enviado automaticamente em todas as requisicoes via header `Authorization: Bearer <token>`.

## Comandos

| Comando            | Descricao                                          |
|--------------------|----------------------------------------------------|
| `make setup`       | Primeiro uso: copia .env, builda e sobe tudo       |
| `make build`       | Builda as imagens Docker                           |
| `make up`          | Sobe os containers em background                   |
| `make down`        | Para e remove os containers                        |
| `make restart`     | Reinicia todos os containers                       |
| `make logs`        | Mostra logs de todos os servicos (follow)          |
| `make logs-back`   | Logs apenas do backend                             |
| `make logs-front`  | Logs apenas do frontend                            |
| `make logs-mongo`  | Logs apenas do MongoDB                             |
| `make status`      | Lista o estado dos containers                      |
| `make shell-back`  | Abre shell no container do backend                 |
| `make shell-front` | Abre shell no container do frontend                |
| `make seed`        | Popula o banco com usuarios e dados de exemplo     |
| `make prod-build`  | Builda imagens de producao                         |
| `make prod-up`     | Sobe containers de producao                        |
| `make prod-down`   | Para containers de producao                        |
| `make clean`       | Remove containers, volumes e imagens locais        |
| `make reinstall`   | Rebuild completo sem cache (usar quando deps mudam)|

## Seed

O seed cria dados iniciais no banco para desenvolvimento e testes:

- 2 usuarios (admin e aluno) com senhas hasheadas via bcrypt
- 5 disciplinas de contabilidade
- 7 temas distribuidos entre as disciplinas
- 7 questoes de exemplo (multipla escolha e certo/errado)

Para executar:

```bash
make seed
```

O seed e idempotente -- pode ser executado varias vezes sem duplicar dados.

## Hot reload

Em desenvolvimento, alteracoes nos arquivos fonte sao refletidas automaticamente:

- **Backend**: o diretorio `backend/src/` e montado como volume no container. O nodemon detecta mudancas em arquivos `.ts` e reinicia o servidor.
- **Frontend**: o diretorio `frontend/src/` e montado como volume. O Next.js dev server aplica hot module replacement no browser.

Nao e necessario rebuildar as imagens para mudancas no codigo fonte.

## Adicionando dependencias npm

Quando um novo pacote for adicionado ao `package.json` de qualquer servico, e necessario rebuildar o container correspondente:

```bash
# Apenas backend
docker compose build backend
docker compose up -d backend

# Apenas frontend
docker compose build frontend
docker compose up -d frontend

# Ou rebuild completo (limpa volumes de node_modules)
make reinstall
```

## Variaveis de ambiente

As variaveis sao definidas no arquivo `.env` na raiz do projeto. O arquivo `.env.example` contem os valores padrao.

| Variavel             | Padrao                             | Descricao                          |
|----------------------|------------------------------------|------------------------------------|
| PORT                 | 5000                               | Porta do servidor backend          |
| MONGO_URI            | mongodb://mongo:27017/contaquiz    | String de conexao com o MongoDB    |
| JWT_SECRET           | contaquiz-dev-secret               | Chave secreta para assinar tokens  |
| JWT_EXPIRES_IN       | 7d                                 | Tempo de expiracao do token JWT    |
| NEXT_PUBLIC_API_URL  | http://localhost:5000              | URL do backend acessada pelo browser|

## Producao

O build de producao usa stages separados nos Dockerfiles, gerando imagens otimizadas sem devDependencies e sem volume mounts:

```bash
make prod-build
make prod-up
```

Em producao, defina `JWT_SECRET` com um valor seguro e aleatorio no `.env`.

Para parar:

```bash
make prod-down
```

## Estrutura do projeto

```
contaquiz/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── nodemon.json
│   └── src/
│       ├── server.ts
│       ├── seed.ts
│       ├── config/
│       ├── models/
│       ├── services/
│       ├── routes/
│       ├── middlewares/
│       └── dtos/
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── next.config.ts
│   └── src/
│       ├── app/
│       ├── components/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       └── lib/
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── .env.example
└── README.md
```
