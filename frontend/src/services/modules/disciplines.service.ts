import { Discipline, DisciplineFormData } from '@/lib/interface/IDisciplina';
import api from '../apiConnect';
import { ListParams, PaginatedResponse } from '@/lib/interface/IDefault';

export const listDisciplines = async (params?: ListParams): Promise<PaginatedResponse<Discipline>> => {
    const { data } = await api.get('/disciplinas', { params });
    return data;
}

export const getDisciplineById = async (id: string): Promise<Discipline> => {
    const { data } = await api.get(`/disciplinas/${id}`);
    return data;
}

export const createDiscipline = async (payload: DisciplineFormData): Promise<Discipline> => {
    const { data } = await api.post('/disciplinas', payload);
    return data;
}

export const updateDiscipline = async (id: string, payload: Partial<DisciplineFormData>): Promise<Discipline> => {
    const { data } = await api.put(`/disciplinas/${id}`, payload);
    return data;
}

export const deleteDiscipline = async (id: string): Promise<Discipline> => {
    const { data } = await api.delete(`/disciplinas/${id}`);
    return data;
}