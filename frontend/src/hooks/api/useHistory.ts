import { useQuery } from '@tanstack/react-query';
import api from '@/services/apiConnect';

export interface IQuizHistoryItem {
    _id: string;
    quizId: string;
    title: string;
    discipline?: string;
    attempts: number;
    bestScore: number;
    lastAttemptDate: Date;
    totalTimeSpent: number;
    averageTime: number;
}

export interface IStudentHistory {
    totalQuizzesCompleted: number;
    averageScore: number;
    totalStudyTime: number;
    quizzes: IQuizHistoryItem[];
}

export function useStudentHistory() {
    return useQuery<IStudentHistory>({
        queryKey: ['studentHistory'],
        queryFn: async () => {
            const { data } = await api.get('/historico');
            return data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
