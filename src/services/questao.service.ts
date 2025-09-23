import QuestionModel, { DifficultyLevel, QuestionType } from '../models/Questao';
import DisciplineModel from '../models/Disciplina';
import TopicModel from '../models/Tema';
import { CreateQuestionDTO, ListQuestionsOptions, UpdateQuestionDTO } from '../dtos/questao.dto';
import { FilterQuery } from 'mongoose';
import { httpError } from '../middlewares/error';
import { ListOptions } from '../dtos/default.dto';

export async function getQuestionById(id: string) {
    const doc = await QuestionModel.findById(id);
    if (!doc) throw httpError(404, 'Questão não encontrada');
    return doc;
}

export async function listQuestions(opts: ListQuestionsOptions) {
    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(100, Math.max(1, opts.limit || 10));
    const skip = (page - 1) * limit;

    const filter: FilterQuery<any> = {};

    if (opts.active !== undefined) {
        filter.active = opts.active?.toString() === 'true';
    }

    if (opts.filter) {
        filter.$or = [
            { statement: { $regex: opts.filter, $options: 'i' } },
            { explanation: { $regex: opts.filter, $options: 'i' } },
        ];
    }

    if (opts.disciplineId) filter.disciplineId = opts.disciplineId;
    if (opts.topicIds && opts.topicIds.length > 0) filter.topicIds = { $in: opts.topicIds };

    if (opts.difficulty && Object.values(DifficultyLevel).includes(opts.difficulty)) {
        filter.difficulty = opts.difficulty
    };

    if (opts.type && Object.values(QuestionType).includes(opts.type)) {
        filter.type = opts.type
    };

    const [items, total] = await Promise.all([
        QuestionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        QuestionModel.countDocuments(filter),
    ]);

    return {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

export async function createQuestion(data: CreateQuestionDTO) {
    // Evita duplicidade amigavelmente (além do índice único)
    const exists = await QuestionModel.findOne({ statement: data.statement });
    if (exists) throw httpError(409, 'Já existe uma questão com esse enunciado');

    // Verifica se a disciplina existe
    if (data.disciplineId) {
        const disciplineExists = await DisciplineModel.findById(data.disciplineId);
        if (!disciplineExists) throw httpError(404, 'Disciplina associada não encontrada');
    }

    // Verifica se os tópicos existem
    if (data.topicIds && data.topicIds.length > 0) {
        const topicsExist = await TopicModel.find({ _id: { $in: data.topicIds } });
        if (topicsExist.length !== data.topicIds.length) throw httpError(404, 'Alguns tópicos não encontrados');
    }

    try {
        return await QuestionModel.create(data);
    } catch (e: any) {
        // Se o índice único disparar
        if (e?.code === 11000) {
            throw httpError(409, 'Já existe uma questão com esse enunciado');
        }
        throw e;
    }
}

export async function updateQuestion(id: string, data: UpdateQuestionDTO) {
    // Se estiver trocando o enunciado, checa duplicidade
    if (data.statement) {
        const exists = await QuestionModel.findOne({ statement: data.statement, _id: { $ne: id } });
        if (exists) throw httpError(409, 'Já existe uma questão com esse enunciado');
    }

    // Se estiver trocando a disciplina ou os tópicos, verifica se existem
    if (data.disciplineId) {
        const disciplineExists = await DisciplineModel.findById(data.disciplineId);
        if (!disciplineExists) throw httpError(404, 'Disciplina associada não encontrada');
    }
    if (data.topicIds && data.topicIds.length > 0) {
        const topicIds = data.topicIds || [];
        const topicsExist = await TopicModel.find({ _id: { $in: topicIds } });
        if (topicsExist.length !== topicIds.length) throw httpError(404, 'Alguns tópicos não encontrados');
    }

    const updated = await QuestionModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!updated) throw httpError(404, 'Questão não encontrada');
    return updated;
}

export async function deleteQuestion(id: string) {
    const deleted = await QuestionModel.findByIdAndDelete(id);
    if (!deleted) throw httpError(404, 'Questão não encontrada');
    return deleted;
}
