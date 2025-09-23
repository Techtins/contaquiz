import DisciplineModel from '../models/Disciplina';
import { CreateDisciplineDTO, UpdateDisciplineDTO } from '../dtos/disciplina.dto';
import { FilterQuery } from 'mongoose';
import { httpError } from '../middlewares/error';
import { ListOptions } from '../dtos/default.dto';

export async function getDisciplineById(id: string) {
    const doc = await DisciplineModel.findById(id);
    if (!doc) throw httpError(404, 'Disciplina não encontrada');
    return doc;
}

export async function listDisciplines(opts: ListOptions) {
    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(100, Math.max(1, opts.limit || 10));
    const skip = (page - 1) * limit;

    const filter: FilterQuery<any> = {};
    
    if (opts.active !== undefined) {
        filter.active = opts.active?.toString() === 'true';
    }

    if (opts.filter) {
        filter.$or = [
            { name: { $regex: opts.filter, $options: 'i' } },
            { description: { $regex: opts.filter, $options: 'i' } },
        ];
    }

    const [items, total] = await Promise.all([
        DisciplineModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        DisciplineModel.countDocuments(filter),
    ]);

    return {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

export async function createDiscipline(data: CreateDisciplineDTO) {
    // Evita duplicidade amigavelmente (além do índice único)
    const exists = await DisciplineModel.findOne({ name: data.name });
    if (exists) throw httpError(409, 'Já existe uma disciplina com esse nome');

    try {
        return await DisciplineModel.create(data);
    } catch (e: any) {
        // Se o índice único disparar
        if (e?.code === 11000) {
            throw httpError(409, 'Já existe uma disciplina com esse nome');
        }
        throw e;
    }
}

export async function updateDiscipline(id: string, data: UpdateDisciplineDTO) {
    // Se estiver trocando o nome, checa duplicidade
    if (data.name) {
        const clash = await DisciplineModel.findOne({ name: data.name, _id: { $ne: id } });
        if (clash) throw httpError(409, 'Já existe uma disciplina com esse nome');
    }

    const updated = await DisciplineModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!updated) throw httpError(404, 'Disciplina não encontrada');
    return updated;
}

export async function deleteDiscipline(id: string) {
    const deleted = await DisciplineModel.findByIdAndDelete(id);
    if (!deleted) throw httpError(404, 'Disciplina não encontrada');
    return deleted;
}
