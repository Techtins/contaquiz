'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as topicsService from '@/services/modules/topics.service';
import { TopicFormData, TopicListParams } from '@/lib/interface/ITopico';

const TOPIC_QUERY_KEY = 'topics';

// Hook personalizado para gerenciar tópicos
export function useTopics() {
    const queryClient = useQueryClient();

    const useListTopics = (params: TopicListParams) =>
        useQuery({
            queryKey: [TOPIC_QUERY_KEY, 'list', params],
            queryFn: () => topicsService.listTopics(params),
        });

    const useGetTopicById = (id?: string) =>
        useQuery({
            queryKey: [TOPIC_QUERY_KEY, id],
            queryFn: () => topicsService.getTopicById(id!),
            enabled: !!id,
        });

    const useCreateTopic = () =>
        useMutation({
            mutationFn: (payload: TopicFormData) => topicsService.createTopic(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [TOPIC_QUERY_KEY, 'list'] });
            },
        });

    const useUpdateTopic = () =>
        useMutation({
            mutationFn: ({ id, payload }: { id: string; payload: Partial<TopicFormData> }) =>
                topicsService.updateTopic(id, payload),
            onSuccess: (_, { id }) => {
                queryClient.invalidateQueries({ queryKey: [TOPIC_QUERY_KEY, 'list'] });
                queryClient.invalidateQueries({ queryKey: [TOPIC_QUERY_KEY, id] });
            },
        });

    const useDeleteTopic = () =>
        useMutation({
            mutationFn: (id: string) => topicsService.deleteTopic(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [TOPIC_QUERY_KEY, 'list'] });
            },
        });

    return {
        useListTopics,
        useGetTopicById,
        useCreateTopic,
        useUpdateTopic,
        useDeleteTopic,
    };
}
