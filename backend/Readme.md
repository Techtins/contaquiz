# 🧾 ContaQuiz - Backend

Este é o repositório **backend** do projeto **ContaQuiz**, desenvolvido pela empresa júnior **TechtinsJR**.

---

## 📌 O que é este projeto?

O **ContaQuiz** é uma plataforma de quizzes voltada para alunos da graduação em **Contabilidade**, com o objetivo de prepará-los para os exames finais e certificações da área. O sistema permite:

- Criação de quizzes temáticos de contabilidade;
- Resolução de atividades com tempo limite;
- Armazenamento de resultados e estatísticas;
- Uma área administrativa para criação/edição dos quizzes.

---

## 🎯 Objetivo do backend

Fornecer uma **API RESTful** robusta para gerenciar os dados dos quizzes, usuários, respostas e estatísticas.

---

## ⚙️ Tecnologias utilizadas

| Tecnologia  | Descrição |
|-------------|-----------|
| [Node.js](https://nodejs.org/en) | Ambiente de execução JavaScript no servidor |
| [TypeScript](https://www.typescriptlang.org/) | Superset do JavaScript com tipagem estática |
| [Express.js](https://expressjs.com/) | Framework minimalista para construir APIs web |
| [dotenv](https://github.com/motdotla/dotenv) | Carrega variáveis de ambiente a partir de um arquivo `.env` |
| [nodemon](https://www.npmjs.com/package/nodemon) + [ts-node](https://typestrong.org/ts-node/) | Recarga automática e execução de arquivos TypeScript |

---

## 📂 Estrutura de Pastas

```

backend/
├── src/
│   ├── models/       # Define os modelos (ex: Quiz, Usuario, Questao)
│   ├── services/     # Contém a lógica de negócio e validações
│   ├── routes/       # Onde ficam as rotas/endpoints da API
│   └── server.ts     # Ponto de entrada da aplicação Express
├── .env              # Variáveis de ambiente (ex: PORT, DB\_URL)
├── nodemon.json      # Configuração para rodar com TS + nodemon
├── package.json      # Dependências e scripts do projeto
├── tsconfig.json     # Configuração do compilador TypeScript

````

---

## 🧠 O que é Express.js?

O [Express.js](https://expressjs.com/) é um framework para Node.js que facilita a criação de servidores e APIs HTTP. Ele permite definir rotas, middlewares, e organizar seu código de forma modular.

👉 Explore a documentação oficial: https://expressjs.com/en/starter/installing.html  
👉 Procure por exemplos práticos: https://github.com/expressjs/express

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/TechtinsJr/contaquiz-backend.git
cd contaquiz-backend
````

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e edite os valores conforme necessário:

```bash
cp .env.example .env
```

Exemplo:

```
PORT=3000
```

### 4. Rode o servidor em modo desenvolvimento

```bash
npm run dev
```

Se tudo estiver certo, a seguinte mensagem será exibida no terminal:

```
Servidor rodando em http://localhost:3000
```

---

## 📡 Testando a API

Acesse em seu navegador ou ferramenta de testes como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/):

```
GET http://localhost:3000/
```

Deve retornar: `Hello World com TS e Nodemon!`

---

## 👨‍🏫 Como contribuir com a equipe

* Cada funcionalidade deve ficar organizada em:

    * **model**: estrutura do dado
    * **service**: lógica que trata e manipula os dados
    * **route**: endpoint que chama o service
* Comente o código sempre que possível para ajudar outros devs.
* Siga o padrão de nomeação e organização do projeto.
* Faça `pull requests` curtos e com uma descrição clara.

---

## 💜 Equipe

Este projeto é desenvolvido pela **TechtinsJR** como uma iniciativa educacional e de impacto social para alunos de contabilidade.

---

**Feito com 💜 pela equipe TechtinsJR**

---

