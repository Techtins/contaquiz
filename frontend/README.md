# 🧾 ContaQuiz - Frontend

Este é o repositório **frontend** do projeto **ContaQuiz**, desenvolvido pela empresa júnior **TechtinsJR**.

---

## 📌 O que é este projeto?

O **ContaQuiz** é uma plataforma de quizzes voltada para alunos da graduação em **Contabilidade**, com o objetivo de prepará-los para os exames finais e certificações da área. O sistema permite:

- Visualização de quizzes temáticos de contabilidade;
- Resolução de atividades com tempo limite;
- Consulta de estatísticas de desempenho;
- Interface para administradores criarem e editarem quizzes.

---

## 🎯 Objetivo do frontend

Construir uma interface web interativa, moderna e responsiva, para que os alunos e administradores possam interagir com o sistema de quizzes.

---

## ⚙️ Tecnologias utilizadas

| Tecnologia  | Descrição |
|-------------|-----------|
| [Next.js](https://nextjs.org/) | Framework React para aplicações web modernas |
| [React](https://reactjs.org/) | Biblioteca para construção de interfaces reativas |
| [TypeScript](https://www.typescriptlang.org/) | Superset do JavaScript com tipagem estática |
| [Axios](https://axios-http.com/) | Cliente HTTP para consumir a API do backend |
| [Tailwind CSS](https://tailwindcss.com/) | Framework CSS utilitário para design responsivo |

---

## 📂 Estrutura de Pastas

```

contaquiz-frontend/
├── public/             # Arquivos públicos (imagens, favicon, etc.)
├── src/
│   ├── components/     # Componentes reutilizáveis (botões, inputs, layout)
│   ├── pages/          # Páginas da aplicação (Next.js = rotas automáticas)
│   ├── services/       # Arquivos para chamadas de API (Axios)
│   ├── styles/         # Estilos globais e configurações do Tailwind
│   ├── hooks/          # Custom hooks (ex: useAuth)
│   ├── context/        # Context API para controle global de estado
│   └── utils/          # Funções utilitárias (formatadores, validadores)
├── .env                # Variáveis de ambiente
├── package.json        # Dependências e scripts do projeto
├── tsconfig.json       # Configuração do TypeScript
├── tailwind.config.js  # Configuração do Tailwind CSS
└── README.md

````

---

## 🧠 O que é Next.js?

O [Next.js](https://nextjs.org/) é um framework que utiliza o React para construir aplicações web modernas, com recursos como:

- Roteamento automático por arquivos;
- Geração de páginas estáticas e dinâmicas;
- Otimizações automáticas de desempenho;
- API Routes (caso necessário);
- Integração nativa com TypeScript, Tailwind, entre outros.

👉 Documentação oficial: https://nextjs.org/docs  
👉 Exemplos e templates: https://github.com/vercel/next.js

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/TechtinsJr/contaquiz-frontend.git
cd contaquiz-frontend
````

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` com base nas URLs de sua API backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em:

```
http://localhost:3000
```

---

## 👨‍🏫 Como contribuir com a equipe

* Cada funcionalidade deve ser dividida em:

    * **componente**: exibição de conteúdo ou interação
    * **serviço**: integração com o backend via Axios
    * **página**: rota do sistema
* Comente seu código de forma clara para ajudar outros devs.
* Siga os padrões visuais e de escrita definidos no projeto.
* Faça `pull requests` curtos e bem descritos.

---

## 💜 Equipe

Este projeto é desenvolvido pela **TechtinsJR** como uma iniciativa educacional e de impacto social para alunos de contabilidade.

---

**Feito com 💜 pela equipe TechtinsJR**


---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
