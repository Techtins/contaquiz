'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as questionsService from '@/services/modules/questions.service';
import { QuestionFormData, QuestionListParams } from '@/lib/interface/IQuestao';

const QUESTION_QUERY_KEY = 'questions';

// Hook personalizado para gerenciar questões
export function useQuestions() {
    const queryClient = useQueryClient();

    const useListQuestions = (params: QuestionListParams) =>
        useQuery({
            queryKey: [QUESTION_QUERY_KEY, 'list', params],
            queryFn: () => questionsService.listQuestions(params),
        });

    const useGetQuestionById = (id?: string) =>
        useQuery({
            queryKey: [QUESTION_QUERY_KEY, id],
            queryFn: () => questionsService.getQuestionById(id!),
            enabled: !!id,
        });

    const useCreateQuestion = () =>
        useMutation({
            mutationFn: (payload: QuestionFormData) => questionsService.createQuestion(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUESTION_QUERY_KEY, 'list'] });
            },
        });

    const useUpdateQuestion = () =>
        useMutation({
            mutationFn: ({ id, payload }: { id: string; payload: Partial<QuestionFormData> }) =>
                questionsService.updateQuestion(id, payload),
            onSuccess: (_, { id }) => {
                queryClient.invalidateQueries({ queryKey: [QUESTION_QUERY_KEY, 'list'] });
                queryClient.invalidateQueries({ queryKey: [QUESTION_QUERY_KEY, id] });
            },
        });

    const useDeleteQuestion = () =>
        useMutation({
            mutationFn: (id: string) => questionsService.deleteQuestion(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUESTION_QUERY_KEY, 'list'] });
            },
        });

    return {
        useListQuestions,
        useGetQuestionById,
        useCreateQuestion,
        useUpdateQuestion,
        useDeleteQuestion,
    };
}
