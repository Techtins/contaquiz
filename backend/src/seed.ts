import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel, { UserSystemRole } from './models/User';
import DisciplineModel from './models/Disciplina';
import TopicModel from './models/Tema';
import QuestionModel, { QuestionType, DifficultyLevel } from './models/Questao';
import QuizModel, { QuizVisibility } from './models/QuizEntity';

type SeedTopic = {
    name: string;
    disciplineName: string;
    parentName?: string;
};

type SeedQuestion = {
    statement: string;
    type: QuestionType;
    disciplineName: string;
    topicNames: string[];
    difficulty: DifficultyLevel;
    options: Array<{ text: string; isCorrect: boolean }>;
    explanation: string;
};

async function upsertByField<T extends Record<string, any>>(model: any, field: string, value: any, payload: T) {
    return model.findOneAndUpdate(
        { [field]: value },
        payload,
        { upsert: true, new: true },
    );
}

async function seed() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI nao definida');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('MongoDB conectado para seed');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const alunoPassword = await bcrypt.hash('aluno123', 10);

    const admin = await UserModel.findOneAndUpdate(
        { email: 'admin@contaquiz.com' },
        {
            name: 'Administrador',
            email: 'admin@contaquiz.com',
            passwordHash: adminPassword,
            systemRole: UserSystemRole.ADMIN,
            active: true,
        },
        { upsert: true, new: true },
    );

    const aluno = await UserModel.findOneAndUpdate(
        { email: 'aluno@contaquiz.com' },
        {
            name: 'Aluno Demo',
            email: 'aluno@contaquiz.com',
            passwordHash: alunoPassword,
            systemRole: UserSystemRole.ALUNO,
            active: true,
        },
        { upsert: true, new: true },
    );

    console.log('Usuarios prontos:', admin.email, aluno.email);

    const disciplinas = [
        { name: 'Contabilidade Geral', description: 'Fundamentos da contabilidade, escrituracao e demonstracoes contabeis' },
        { name: 'Contabilidade de Custos', description: 'Metodos de custeio, analise de custos e formacao de precos' },
        { name: 'Auditoria', description: 'Normas de auditoria, procedimentos e relatorios' },
        { name: 'Contabilidade Publica', description: 'Contabilidade aplicada ao setor publico e NBCASP' },
        { name: 'Legislacao Tributaria', description: 'Tributos, obrigacoes acessorias e planejamento tributario' },
        { name: 'Matematica Financeira', description: 'Juros simples, compostos, descontos e equivalencias' },
    ];

    const createdDisciplines = new Map<string, any>();
    for (const discipline of disciplinas) {
        const doc = await upsertByField(DisciplineModel, 'name', discipline.name, {
            ...discipline,
            active: true,
        });
        createdDisciplines.set(discipline.name, doc);
    }
    console.log(`${createdDisciplines.size} disciplinas prontas`);

    const topics: SeedTopic[] = [
        { name: 'Patrimonio', disciplineName: 'Contabilidade Geral' },
        { name: 'Estrutura do Balanco', disciplineName: 'Contabilidade Geral', parentName: 'Patrimonio' },
        { name: 'DRE', disciplineName: 'Contabilidade Geral' },
        { name: 'Receitas e Despesas', disciplineName: 'Contabilidade Geral', parentName: 'DRE' },
        { name: 'Custeio por Absorcao', disciplineName: 'Contabilidade de Custos' },
        { name: 'Custeio Variavel', disciplineName: 'Contabilidade de Custos' },
        { name: 'Orcamento', disciplineName: 'Contabilidade Publica' },
        { name: 'Execucao Orcamentaria', disciplineName: 'Contabilidade Publica', parentName: 'Orcamento' },
        { name: 'Normas de Auditoria', disciplineName: 'Auditoria' },
        { name: 'Parecer do Auditor', disciplineName: 'Auditoria' },
        { name: 'Tributos Federais', disciplineName: 'Legislacao Tributaria' },
        { name: 'Obrigacoes Acessorias', disciplineName: 'Legislacao Tributaria' },
        { name: 'Juros Simples', disciplineName: 'Matematica Financeira' },
        { name: 'Juros Compostos', disciplineName: 'Matematica Financeira' },
    ];

    const createdTopics = new Map<string, any>();
    for (const topic of topics) {
        const discipline = createdDisciplines.get(topic.disciplineName);
        const parent = topic.parentName ? createdTopics.get(`${topic.disciplineName}:${topic.parentName}`) : null;
        const doc = await TopicModel.findOneAndUpdate(
            {
                name: topic.name,
                disciplineId: discipline._id,
                parentTopicId: parent?._id || null,
            },
            {
                name: topic.name,
                disciplineId: discipline._id,
                parentTopicId: parent?._id || null,
                active: true,
            },
            { upsert: true, new: true },
        );

        createdTopics.set(`${topic.disciplineName}:${topic.name}`, doc);
    }
    console.log(`${createdTopics.size} temas/subtemas prontos`);

    const q = (topicKey: string) => createdTopics.get(topicKey);
    const d = (disciplineName: string) => createdDisciplines.get(disciplineName);

    const questions: SeedQuestion[] = [
        {
            statement: 'O patrimonio de uma entidade e composto por:',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineName: 'Contabilidade Geral',
            topicNames: ['Patrimonio'],
            difficulty: DifficultyLevel.FACIL,
            options: [
                { text: 'Apenas bens e direitos', isCorrect: false },
                { text: 'Bens, direitos e obrigacoes', isCorrect: true },
                { text: 'Apenas o ativo circulante', isCorrect: false },
                { text: 'Capital social e reservas', isCorrect: false },
            ],
            explanation: 'O patrimonio e o conjunto de bens, direitos e obrigacoes de uma entidade.',
        },
        {
            statement: 'No Balanco Patrimonial, o Ativo e ordenado por:',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineName: 'Contabilidade Geral',
            topicNames: ['Estrutura do Balanco'],
            difficulty: DifficultyLevel.FACIL,
            options: [
                { text: 'Ordem alfabetica', isCorrect: false },
                { text: 'Grau decrescente de liquidez', isCorrect: true },
                { text: 'Grau crescente de liquidez', isCorrect: false },
                { text: 'Data de aquisicao', isCorrect: false },
            ],
            explanation: 'Conforme a Lei 6.404/76, as contas do ativo sao dispostas em ordem decrescente de grau de liquidez.',
        },
        {
            statement: 'A Demonstracao do Resultado do Exercicio (DRE) evidencia a formacao do resultado liquido do periodo.',
            type: QuestionType.CERTO_ERRADO,
            disciplineName: 'Contabilidade Geral',
            topicNames: ['DRE'],
            difficulty: DifficultyLevel.FACIL,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'A DRE apresenta as receitas e despesas do periodo, evidenciando o resultado liquido.',
        },
        {
            statement: 'A apropriacao correta de despesas e receitas pelo regime de competencia é essencial para a DRE.',
            type: QuestionType.CERTO_ERRADO,
            disciplineName: 'Contabilidade Geral',
            topicNames: ['Receitas e Despesas'],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'A competencia reconhece receitas e despesas no periodo correto, independentemente do caixa.',
        },
        {
            statement: 'No custeio por absorcao, os custos fixos sao alocados aos produtos.',
            type: QuestionType.CERTO_ERRADO,
            disciplineName: 'Contabilidade de Custos',
            topicNames: ['Custeio por Absorcao'],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'O custeio por absorcao aloca todos os custos de producao aos produtos.',
        },
        {
            statement: 'No custeio variavel, sao considerados como custo do produto:',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineName: 'Contabilidade de Custos',
            topicNames: ['Custeio Variavel'],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Apenas custos fixos', isCorrect: false },
                { text: 'Apenas custos variaveis', isCorrect: true },
                { text: 'Custos fixos e despesas financeiras', isCorrect: false },
                { text: 'Todos os custos administrativos', isCorrect: false },
            ],
            explanation: 'No custeio variavel, apenas custos variaveis compoem o custo do produto.',
        },
        {
            statement: 'O planejamento orcamentario e um dos pilares da contabilidade publica.',
            type: QuestionType.CERTO_ERRADO,
            disciplineName: 'Contabilidade Publica',
            topicNames: ['Orcamento'],
            difficulty: DifficultyLevel.FACIL,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'O orçamento orienta a previsao e a execucao das receitas e despesas publicas.',
        },
        {
            statement: 'A execucao orcamentaria envolve a fase de empenho, liquidacao e pagamento.',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineName: 'Contabilidade Publica',
            topicNames: ['Execucao Orcamentaria'],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Empenho, liquidacao e pagamento', isCorrect: true },
                { text: 'Planejamento, avaliacao e auditoria', isCorrect: false },
                { text: 'Arrecadacao, empenho e inventario', isCorrect: false },
                { text: 'Licitacao, empenho e conciliação', isCorrect: false },
            ],
            explanation: 'A execucao da despesa passa por empenho, liquidacao e pagamento.',
        },
        {
            statement: 'As normas de auditoria exigem ceticismo profissional do auditor.',
            type: QuestionType.CERTO_ERRADO,
            disciplineName: 'Auditoria',
            topicNames: ['Normas de Auditoria'],
            difficulty: DifficultyLevel.FACIL,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'O ceticismo profissional e essencial para a identificacao de distorcoes relevantes.',
        },
        {
            statement: 'O parecer sem ressalva indica:',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineName: 'Auditoria',
            topicNames: ['Parecer do Auditor'],
            difficulty: DifficultyLevel.DIFICIL,
            options: [
                { text: 'Incapacidade de emitir opiniao', isCorrect: false },
                { text: 'Opiniao favoravel sem distorcoes relevantes', isCorrect: true },
                { text: 'Fraude comprovada nas demonstracoes', isCorrect: false },
                { text: 'Erro material nao corrigido', isCorrect: false },
            ],
            explanation: 'O parecer sem ressalva expressa opiniao favoravel sobre as demonstracoes contabeis.',
        },
        {
            statement: 'O tributo de competencia da Uniao entre os listados abaixo e:',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineName: 'Legislacao Tributaria',
            topicNames: ['Tributos Federais'],
            difficulty: DifficultyLevel.FACIL,
            options: [
                { text: 'ICMS', isCorrect: false },
                { text: 'IPVA', isCorrect: false },
                { text: 'IRPJ', isCorrect: true },
                { text: 'ITBI', isCorrect: false },
            ],
            explanation: 'O IRPJ e tributo federal.',
        },
        {
            statement: 'As obrigacoes acessorias podem incluir entrega de declaracoes e livros fiscais.',
            type: QuestionType.CERTO_ERRADO,
            disciplineName: 'Legislacao Tributaria',
            topicNames: ['Obrigacoes Acessorias'],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'As obrigacoes acessorias servem para informar e documentar fatos tributarios.',
        },
        {
            statement: 'O montante futuro de R$ 1.000,00 aplicado a juros simples de 10% ao ano por 2 anos resulta em:',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineName: 'Matematica Financeira',
            topicNames: ['Juros Simples'],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'R$ 1.100,00', isCorrect: false },
                { text: 'R$ 1.200,00', isCorrect: true },
                { text: 'R$ 1.210,00', isCorrect: false },
                { text: 'R$ 1.300,00', isCorrect: false },
            ],
            explanation: 'Juros simples: M = C(1 + i.t) = 1000(1 + 0,1*2) = 1200.',
        },
        {
            statement: 'Em juros compostos, o juros de cada periodo incide apenas sobre o capital inicial.',
            type: QuestionType.CERTO_ERRADO,
            disciplineName: 'Matematica Financeira',
            topicNames: ['Juros Compostos'],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Certo', isCorrect: false },
                { text: 'Errado', isCorrect: true },
            ],
            explanation: 'Nos juros compostos, os juros sao capitalizados e passam a compor o saldo.',
        },
    ];

    for (const question of questions) {
        const discipline = d(question.disciplineName);
        const topicIds = question.topicNames.map((topicName) => q(`${question.disciplineName}:${topicName}`)?._id).filter(Boolean);

        const exists = await QuestionModel.findOne({ statement: question.statement });
        if (exists) continue;

        await QuestionModel.create({
            statement: question.statement,
            type: question.type,
            disciplineId: discipline._id,
            topicIds,
            difficulty: question.difficulty,
            options: question.options,
            explanation: question.explanation,
            active: true,
        });
    }
    console.log(`${questions.length} questoes processadas`);

    const questionDocs = await QuestionModel.find({ active: true });
    const questionByDiscipline = (disciplineName: string) => questionDocs.filter((question) => String(question.disciplineId) === String(d(disciplineName)._id));

    const publicQuizzes = [
        {
            title: 'Quiz Demo Contabilidade Geral',
            description: 'Quiz publico com foco em fundamentos de contabilidade geral',
            disciplineName: 'Contabilidade Geral',
            take: 6,
            score: 70,
        },
        {
            title: 'Quiz Demo Custos e Auditoria',
            description: 'Quiz publico misturando custos e auditoria',
            disciplineName: 'Contabilidade de Custos',
            take: 4,
            score: 65,
        },
        {
            title: 'Quiz Demo Matematica Financeira',
            description: 'Quiz publico de treinamento em matematica financeira',
            disciplineName: 'Matematica Financeira',
            take: 3,
            score: 60,
        },
    ];

    for (const quiz of publicQuizzes) {
        const disciplineQuestions = questionByDiscipline(quiz.disciplineName).slice(0, quiz.take);
        if (disciplineQuestions.length === 0) continue;

        await QuizModel.findOneAndUpdate(
            { title: quiz.title },
            {
                title: quiz.title,
                description: quiz.description,
                disciplineId: d(quiz.disciplineName)._id,
                questionIds: disciplineQuestions.map((question) => question._id),
                timeLimitSeconds: quiz.take * 120,
                score: quiz.score,
                visibility: QuizVisibility.PUBLIC,
                createdByUserId: admin._id,
                active: true,
            },
            { upsert: true, new: true },
        );
    }

    const privateQuestions = questionDocs
        .filter((question) => String(question.disciplineId) === String(d('Contabilidade Geral')._id))
        .slice(0, 5);

    if (privateQuestions.length > 0) {
        await QuizModel.findOneAndUpdate(
            { title: 'Quiz Privado do Aluno Demo' },
            {
                title: 'Quiz Privado do Aluno Demo',
                description: 'Quiz privado de treino criado automaticamente para o aluno demo',
                disciplineId: d('Contabilidade Geral')._id,
                questionIds: privateQuestions.map((question) => question._id),
                timeLimitSeconds: 900,
                score: 70,
                visibility: QuizVisibility.PRIVATE,
                createdByUserId: aluno._id,
                active: true,
            },
            { upsert: true, new: true },
        );
    }

    console.log('Quizzes de exemplo prontos');
    console.log('\nSeed concluido com sucesso!');
    console.log('Credenciais de acesso:');
    console.log('  Admin: admin@contaquiz.com / admin123');
    console.log('  Aluno: aluno@contaquiz.com / aluno123');

    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('Erro no seed:', err);
    process.exit(1);
});
