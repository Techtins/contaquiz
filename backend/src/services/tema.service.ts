import TopicModel from '../models/Tema';
import DisciplineModel from '../models/Disciplina';
import { CreateTopicDTO, UpdateTopicDTO, ListTopicsOptions } from '../dtos/tema.dto';
import { FilterQuery } from 'mongoose';
import { httpError } from '../middlewares/error';

export async function getTopicById(id: string) {
    const doc = await TopicModel.findById(id);
    if (!doc) throw httpError(404, 'Tema não encontrado');
    return doc;
}

export async function listTopics(opts: ListTopicsOptions) {
    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(100, Math.max(1, opts.limit || 10));
    const skip = (page - 1) * limit;

    const filter: FilterQuery<any> = {};

    if (opts.active !== undefined) {
        filter.active = opts.active?.toString() === 'true';
    }

    if (opts.filter) { filter.name = { $regex: opts.filter, $options: 'i' } };

    if (opts.disciplineId) filter.disciplineId = opts.disciplineId;

    const [items, total] = await Promise.all([
        TopicModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        TopicModel.countDocuments(filter),
    ]);

    return {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

export async function createTopic(data: CreateTopicDTO) {
    // Evita duplicidade amigavelmente (além do índice único)
    const exists = await TopicModel.findOne({ name: data.name });
    if (exists) throw httpError(409, 'Já existe um tema com esse nome');

    const disciplineExists = await DisciplineModel.findById(data.disciplineId);
    if (!disciplineExists) throw httpError(404, 'Disciplina associada não encontrada');

    if (data.parentTopicId) {
        const parentTopic = await TopicModel.findById(data.parentTopicId);
        if (!parentTopic) throw httpError(404, 'Tema pai não encontrado');
    }

    try {
        return await TopicModel.create(data);
    } catch (e: any) {
        // Se o índice único disparar
        if (e?.code === 11000) {
            throw httpError(409, 'Já existe um tema com esse nome');
        }
        throw e;
    }
}

export async function updateTopic(id: string, data: UpdateTopicDTO) {
    // Se estiver trocando o nome, checa duplicidade
    if (data.name) {
        const clash = await TopicModel.findOne({ name: data.name, _id: { $ne: id } });
        if (clash) throw httpError(409, 'Já existe um tema com esse nome');
    }

    if (data.disciplineId) {
        const disciplineExists = await DisciplineModel.findById(data.disciplineId);
        if (!disciplineExists) throw httpError(404, 'Disciplina associada não encontrada');
    }

    if (data.parentTopicId) {
        const parentTopic = await TopicModel.findById(data.parentTopicId);
        if (!parentTopic) throw httpError(404, 'Tema pai não encontrado');
    }

    const updated = await TopicModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!updated) throw httpError(404, 'Tema não encontrado');
    return updated;
}

export async function deleteTopic(id: string) {
    const deleted = await TopicModel.findByIdAndDelete(id);
    if (!deleted) throw httpError(404, 'Tema não encontrado');
    return deleted;
}
