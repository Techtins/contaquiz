import api from "../apiConnect";
import { Quiz, QuizFormData, QuizListParams } from "@/lib/interface/IQuiz";
import { DifficultyLevel } from "@/lib/interface/IQuestao";

type BackendResultQuestion = {
    _id: string;
    statement: string;
    type: string;
    disciplineId?: string;
    disciplineName?: string;
    topicIds?: Array<{ _id: string; name: string }>;
    difficulty?: DifficultyLevel;
};

type BackendQuizCorrection = {
    questionId: string;
    userAnswer: number | null;
    correctAnswer: number;
    isCorrect: boolean;
    explanation?: string;
    isFavorite?: boolean;
    question?: BackendResultQuestion;
};

type BackendQuizResult = {
    _id: string;
    quizId: string;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
    percentage: number;
    timeSpentInSeconds: number;
    passingScore: number;
    corrections: BackendQuizCorrection[];
};

export type QuizResult = BackendQuizResult;

export type QuestionFavoriteState = {
    questionIds: string[];
};

type BackendQuiz = {
    _id: string;
    title: string;
    description?: string;
    disciplineId?: string | { _id: string; name?: string } | null;
    questionIds?: Array<any>;
    timeLimitSeconds?: number | null;
    score?: number | null;
    visibility?: 'PUBLIC' | 'PRIVATE';
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
    visibility: quiz.visibility,
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
    visibility: payload.visibility,
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

export const generateQuiz = async (payload: {
    title?: string;
    description?: string;
    disciplineId?: string;
    topicIds?: string[];
    questionCount?: number;
    questionsPerTopic?: number;
    difficulty?: string;
    mixedDifficulty?: boolean;
    timeLimitSeconds?: number;
    score?: number;
    active?: boolean;
    visibility?: 'PUBLIC' | 'PRIVATE';
}) => {
    const { data } = await api.post('/quizzes/generate', payload);
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
    return data.data as QuizResult;
};

export const getFavoriteQuestionIds = async (questionIds?: string[]) => {
    const { data } = await api.get('/question-favorites', {
        params: questionIds?.length ? { questionIds: questionIds.join(',') } : undefined,
    });

    return data.data as QuestionFavoriteState;
};

export const toggleQuestionFavorite = async (questionId: string) => {
    const { data } = await api.post(`/questions/${questionId}/favorite`);
    return data.data as { favorited: boolean };
};
