import { useQuery } from '@tanstack/react-query';
import api from '@/services/apiConnect';

export interface IQuizHistoryItem {
    _id: string;
    quizId: string;
    title: string;
    discipline?: string;
    visibility?: 'PUBLIC' | 'PRIVATE';
    attempts: number;
    bestScore: number;
    lastAttemptDate: Date;
    totalTimeSpent: number;
    averageTime: number;
}

export interface IQuizAttemptItem {
    _id: string;
    resultId: string;
    quizId: string;
    title: string;
    discipline?: string;
    visibility?: 'PUBLIC' | 'PRIVATE';
    percentage: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
    timeSpentInSeconds: number;
    passingScore: number;
    createdAt: string;
    passed: boolean;
}

export interface IHistoryBreakdownItem {
    key: string;
    label: string;
    attempts: number;
    correctAnswers: number;
    averageScore: number;
    averageTime: number;
}

export interface IHistoryDifficultyItem {
    difficulty: string;
    attempts: number;
    correctAnswers: number;
    accuracy: number;
}

export interface IHistoryAnalytics {
    timeline: Array<{
        resultId: string;
        quizId: string;
        title: string;
        createdAt: string;
        percentage: number;
        timeSpentInSeconds: number;
    }>;
    byDiscipline: IHistoryBreakdownItem[];
    byTopic: IHistoryBreakdownItem[];
    byDifficulty: IHistoryDifficultyItem[];
    comparison: Array<{
        quizId: string;
        title: string;
        attempts: Array<{
            attemptNumber: number;
            resultId: string;
            createdAt: string;
            percentage: number;
        }>;
    }>;
    lowAreas: Array<{
        kind: 'DISCIPLINE' | 'TOPIC';
        key: string;
        label: string;
        averageScore: number;
        attempts: number;
    }>;
}

export interface IStudentHistory {
    totalQuizzesCompleted: number;
    averageScore: number;
    totalStudyTime: number;
    quizzes: IQuizHistoryItem[];
    attempts: IQuizAttemptItem[];
    analytics: IHistoryAnalytics;
}

export interface StudentHistoryFilters {
    disciplineId?: string;
    visibility?: 'PUBLIC' | 'PRIVATE';
    quizId?: string;
    dateFrom?: string;
    dateTo?: string;
    minScore?: number;
    maxScore?: number;
}

export function useStudentHistory(filters: StudentHistoryFilters = {}) {
    return useQuery<IStudentHistory>({
        queryKey: ['studentHistory', filters],
        queryFn: async () => {
            const { data } = await api.get('/historico', { params: filters });
            return data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
