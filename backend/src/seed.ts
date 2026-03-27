import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel, { UserSystemRole } from './models/User';
import DisciplineModel from './models/Disciplina';
import TopicModel from './models/Tema';
import QuestionModel, { QuestionType, DifficultyLevel } from './models/Questao';

async function seed() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI nao definida');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('MongoDB conectado para seed');

    // --- Usuarios ---
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
        { upsert: true, new: true }
    );
    console.log('Usuario admin criado/atualizado:', admin.email);

    const aluno = await UserModel.findOneAndUpdate(
        { email: 'aluno@contaquiz.com' },
        {
            name: 'Aluno Demo',
            email: 'aluno@contaquiz.com',
            passwordHash: alunoPassword,
            systemRole: UserSystemRole.ALUNO,
            active: true,
        },
        { upsert: true, new: true }
    );
    console.log('Usuario aluno criado/atualizado:', aluno.email);

    // --- Disciplinas ---
    const disciplinas = [
        { name: 'Contabilidade Geral', description: 'Fundamentos da contabilidade, escrituracao e demonstracoes contabeis' },
        { name: 'Contabilidade de Custos', description: 'Metodos de custeio, analise de custos e formacao de precos' },
        { name: 'Auditoria', description: 'Normas de auditoria, procedimentos e relatorios' },
        { name: 'Contabilidade Publica', description: 'Contabilidade aplicada ao setor publico e NBCASP' },
        { name: 'Legislacao Tributaria', description: 'Tributos, obrigacoes acessorias e planejamento tributario' },
    ];

    const createdDisciplinas = [];
    for (const d of disciplinas) {
        const doc = await DisciplineModel.findOneAndUpdate(
            { name: d.name },
            d,
            { upsert: true, new: true }
        );
        createdDisciplinas.push(doc);
    }
    console.log(`${createdDisciplinas.length} disciplinas criadas/atualizadas`);

    // --- Temas ---
    const contGeral = createdDisciplinas[0];
    const contCustos = createdDisciplinas[1];
    const auditoria = createdDisciplinas[2];

    const temas = [
        { name: 'Patrimonio', disciplineId: contGeral._id },
        { name: 'Balanco Patrimonial', disciplineId: contGeral._id },
        { name: 'Demonstracao do Resultado', disciplineId: contGeral._id },
        { name: 'Custeio por Absorcao', disciplineId: contCustos._id },
        { name: 'Custeio Variavel', disciplineId: contCustos._id },
        { name: 'Normas de Auditoria', disciplineId: auditoria._id },
        { name: 'Parecer do Auditor', disciplineId: auditoria._id },
    ];

    const createdTemas = [];
    for (const t of temas) {
        const doc = await TopicModel.findOneAndUpdate(
            { name: t.name, disciplineId: t.disciplineId, parentTopicId: null },
            { ...t, active: true },
            { upsert: true, new: true }
        );
        createdTemas.push(doc);
    }
    console.log(`${createdTemas.length} temas criados/atualizados`);

    // --- Questoes ---
    const patrimonio = createdTemas[0];
    const balanco = createdTemas[1];
    const dre = createdTemas[2];
    const absorcao = createdTemas[3];

    const questoes = [
        {
            statement: 'O patrimonio de uma entidade e composto por:',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineId: contGeral._id,
            topicIds: [patrimonio._id],
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
            disciplineId: contGeral._id,
            topicIds: [balanco._id],
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
            disciplineId: contGeral._id,
            topicIds: [dre._id],
            difficulty: DifficultyLevel.FACIL,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'A DRE apresenta as receitas e despesas do periodo, evidenciando o resultado liquido.',
        },
        {
            statement: 'No custeio por absorcao, os custos fixos sao alocados aos produtos.',
            type: QuestionType.CERTO_ERRADO,
            disciplineId: contCustos._id,
            topicIds: [absorcao._id],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'O custeio por absorcao aloca todos os custos de producao (fixos e variaveis) aos produtos.',
        },
        {
            statement: 'Qual das alternativas abaixo NAO e uma conta do Passivo Circulante?',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineId: contGeral._id,
            topicIds: [balanco._id],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Fornecedores', isCorrect: false },
                { text: 'Salarios a pagar', isCorrect: false },
                { text: 'Estoques', isCorrect: true },
                { text: 'Emprestimos de curto prazo', isCorrect: false },
            ],
            explanation: 'Estoques e uma conta do Ativo Circulante, nao do Passivo.',
        },
        {
            statement: 'O Principio da Competencia determina que receitas e despesas devem ser reconhecidas no periodo em que ocorrem, independentemente do recebimento ou pagamento.',
            type: QuestionType.CERTO_ERRADO,
            disciplineId: contGeral._id,
            topicIds: [patrimonio._id],
            difficulty: DifficultyLevel.MEDIO,
            options: [
                { text: 'Certo', isCorrect: true },
                { text: 'Errado', isCorrect: false },
            ],
            explanation: 'O regime de competencia reconhece as transacoes no periodo em que ocorrem os fatos geradores.',
        },
        {
            statement: 'Na DRE, o Lucro Bruto e obtido pela diferenca entre:',
            type: QuestionType.MULTIPLA_ESCOLHA,
            disciplineId: contGeral._id,
            topicIds: [dre._id],
            difficulty: DifficultyLevel.DIFICIL,
            options: [
                { text: 'Receita Liquida e Custo das Mercadorias Vendidas', isCorrect: true },
                { text: 'Receita Bruta e Despesas Operacionais', isCorrect: false },
                { text: 'Lucro Operacional e Impostos', isCorrect: false },
                { text: 'Receita Bruta e Deducoes da Receita', isCorrect: false },
            ],
            explanation: 'Lucro Bruto = Receita Liquida - CMV (Custo das Mercadorias Vendidas).',
        },
    ];

    for (const q of questoes) {
        const exists = await QuestionModel.findOne({ statement: q.statement });
        if (!exists) {
            await QuestionModel.create(q);
        }
    }
    console.log(`${questoes.length} questoes processadas`);

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
