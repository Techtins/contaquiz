import api from "../apiConnect";
import { Quiz, QuizFormData, QuizListParams } from "@/lib/interface/IQuiz";

type BackendQuiz = {
    _id: string;
    title: string;
    description?: string;
    disciplineId?: string | { _id: string; name?: string } | null;
    questionIds?: Array<any>;
    timeLimitSeconds?: number | null;
    score?: number | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

const mapQuizFromBackend = (quiz: BackendQuiz): Quiz => ({
    _id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    disciplineId: typeof quiz.disciplineId === 'string' ? quiz.disciplineId : quiz.disciplineId?._id || '',
    questions: (quiz.questionIds || []).filter(Boolean),
    timeLimit: quiz.timeLimitSeconds ?? 1800,
    passingScore: quiz.score ?? 0,
    active: quiz.active,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
});

const mapQuizToBackend = (payload: QuizFormData) => ({
    title: payload.title,
    description: payload.description,
    disciplineId: payload.disciplineId,
    questionIds: payload.questions,
    timeLimitSeconds: payload.timeLimit,
    score: payload.passingScore,
    active: payload.active,
});

export const listQuizzes = async (params: QuizListParams) => {
    const { data } = await api.get("/quizzes", { params });
    return {
        ...data.data,
        items: (data.data?.items || []).map(mapQuizFromBackend),
    };
};

export const getQuizById = async (id: string) => {
    const { data } = await api.get(`/quizzes/${id}`);
    const quiz = data.data;
    return {
        ...mapQuizFromBackend({
            ...quiz,
            questionIds: quiz.questionIds || quiz.questions || [],
            timeLimitSeconds: quiz.timeLimitSeconds ?? quiz.timeLimit,
            score: quiz.score ?? quiz.passingScore,
        }),
        questions: quiz.questionIds || quiz.questions || [],
    };
};

export const createQuiz = async (payload: QuizFormData) => {
    const { data } = await api.post("/quizzes", mapQuizToBackend(payload));
    return mapQuizFromBackend({
        ...data.data,
        questionIds: data.data?.questionIds || data.data?.questions || [],
    });
};

export const updateQuiz = async (id: string, payload: Partial<QuizFormData>) => {
    const { data } = await api.put(`/quizzes/${id}`, {
        ...payload,
        ...(payload.questions ? { questionIds: payload.questions } : {}),
        ...(payload.timeLimit !== undefined ? { timeLimitSeconds: payload.timeLimit } : {}),
        ...(payload.passingScore !== undefined ? { score: payload.passingScore } : {}),
    });
    return mapQuizFromBackend({
        ...data.data,
        questionIds: data.data?.questionIds || data.data?.questions || [],
    });
};

export const deleteQuiz = async (id: string) => {
    const { data } = await api.delete(`/quizzes/${id}`);
    return data.data;
};

export const submitQuiz = async (id: string, answers: Record<string, number>, timeSpentInSeconds?: number) => {
    const { data } = await api.post(`/quizzes/${id}/submit`, { answers, timeSpentInSeconds });
    return data.data;
};

export const getQuizResult = async (resultId: string) => {
    const { data } = await api.get(`/quizzes/resultados/${resultId}`);
    return data.data;
};
