import { PaginatedResponse } from "@/lib/interface/IDefault";
import { Question, QuestionFormData, QuestionListParams } from "@/lib/interface/IQuestao";
import api from "../apiConnect";

export const listQuestions = async (params?: QuestionListParams): Promise<PaginatedResponse<Question>> => {
    const { data } = await api.get('/questoes', { params });
    return data;
}

export const getQuestionById = async (id: string): Promise<Question> => {
    const { data } = await api.get(`/questoes/${id}`);
    return data.data;
}

export const createQuestion = async (payload: QuestionFormData): Promise<Question> => {
    const { data } = await api.post('/questoes', payload);
    return data.data;
}

export const updateQuestion = async (id: string, payload: Partial<QuestionFormData>): Promise<Question> => {
    const { data } = await api.put(`/questoes/${id}`, payload);
    return data.data;
}

export const deleteQuestion = async (id: string): Promise<void> => {
    await api.delete(`/questoes/${id}`);
}