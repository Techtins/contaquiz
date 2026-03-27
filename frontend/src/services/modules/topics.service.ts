import { Topic, TopicFormData, TopicListParams } from '@/lib/interface/ITopico';
import api from '../apiConnect';
import { PaginatedResponse } from '@/lib/interface/IDefault';

export const listTopics = async (params?: TopicListParams): Promise<PaginatedResponse<Topic>> => {
    const { data } = await api.get('/temas', { params });
    return data;
}

export const getTopicById = async (id: string): Promise<Topic> => {
    const { data } = await api.get(`/temas/${id}`);
    return data.data;
}

export const createTopic = async (payload: TopicFormData): Promise<Topic> => {
    const { data } = await api.post('/temas', payload);
    return data.data;
}

export const updateTopic = async (id: string, payload: Partial<TopicFormData>): Promise<Topic> => {
    const { data } = await api.put(`/temas/${id}`, payload);
    return data.data;
}

export const deleteTopic = async (id: string): Promise<void> => {
    await api.delete(`/temas/${id}`);
}