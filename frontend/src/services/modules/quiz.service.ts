import api from "../apiConnect";
import { Quiz, QuizFormData, QuizListParams } from "@/lib/interface/IQuiz";

export const listQuizzes = async (params: QuizListParams) => {
    const { data } = await api.get("/quizzes", { params });
    return data.data;
};

export const getQuizById = async (id: string) => {
    const { data } = await api.get(`/quizzes/${id}`);
    return data.data;
};

export const createQuiz = async (payload: QuizFormData) => {
    const { data } = await api.post("/quizzes", payload);
    return data.data;
};

export const updateQuiz = async (id: string, payload: Partial<QuizFormData>) => {
    const { data } = await api.put(`/quizzes/${id}`, payload);
    return data.data;
};

export const deleteQuiz = async (id: string) => {
    const { data } = await api.delete(`/quizzes/${id}`);
    return data.data;
};

export const submitQuiz = async (id: string, answers: Record<string, number>) => {
    const { data } = await api.post(`/quizzes/${id}/submit`, { answers });
    return data.data;
};

export const getQuizResult = async (resultId: string) => {
    const { data } = await api.get(`/quiz-results/${resultId}`);
    return data.data;
};
