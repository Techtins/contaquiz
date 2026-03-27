'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as quizService from '@/services/modules/quiz.service';
import { QuizFormData, QuizListParams } from '@/lib/interface/IQuiz';

const QUIZ_QUERY_KEY = 'quizzes';

export function useQuizzes() {
    const queryClient = useQueryClient();

    const useListQuizzes = (params: QuizListParams) =>
        useQuery({
            queryKey: [QUIZ_QUERY_KEY, 'list', params],
            queryFn: () => quizService.listQuizzes(params),
        });

    const useGetQuizById = (id?: string) =>
        useQuery({
            queryKey: [QUIZ_QUERY_KEY, id],
            queryFn: () => quizService.getQuizById(id!),
            enabled: !!id,
        });

    const useCreateQuiz = () =>
        useMutation({
            mutationFn: (payload: QuizFormData) => quizService.createQuiz(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUIZ_QUERY_KEY, 'list'] });
            },
        });

    const useUpdateQuiz = () =>
        useMutation({
            mutationFn: ({ id, payload }: { id: string; payload: Partial<QuizFormData> }) =>
                quizService.updateQuiz(id, payload),
            onSuccess: (_, { id }) => {
                queryClient.invalidateQueries({ queryKey: [QUIZ_QUERY_KEY, 'list'] });
                queryClient.invalidateQueries({ queryKey: [QUIZ_QUERY_KEY, id] });
            },
        });

    const useDeleteQuiz = () =>
        useMutation({
            mutationFn: (id: string) => quizService.deleteQuiz(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUIZ_QUERY_KEY, 'list'] });
            },
        });

    return {
        useListQuizzes,
        useGetQuizById,
        useCreateQuiz,
        useUpdateQuiz,
        useDeleteQuiz,
    };
}
