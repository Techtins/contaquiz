'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as disciplinesService from '@/services/modules/disciplines.service';
import { ListParams } from '@/lib/interface/IDefault';
import { DisciplineFormData } from '@/lib/interface/IDisciplina';

const DISCIPLINE_QUERY_KEY = 'disciplines';

// Hook personalizado para gerenciar disciplinas
export function useDisciplines() {
    const queryClient = useQueryClient();

    const useListDisciplines = ({ page, limit, filter, active }: ListParams) =>
        useQuery({
            queryKey: [DISCIPLINE_QUERY_KEY, 'list', { page, limit, filter, active }],
            queryFn: () => disciplinesService.listDisciplines({ page, limit, filter, active }),
        });

    const useGetDisciplineById = (id?: string) =>
        useQuery({
            queryKey: [DISCIPLINE_QUERY_KEY, id],
            queryFn: () => disciplinesService.getDisciplineById(id!),
            enabled: !!id,
        });

    const useCreateDiscipline = () =>
        useMutation({
            mutationFn: (payload: DisciplineFormData) => disciplinesService.createDiscipline(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [DISCIPLINE_QUERY_KEY, 'list'] });
            },
        });

    const useUpdateDiscipline = () =>
        useMutation({
            mutationFn: ({ id, payload }: { id: string; payload: Partial<DisciplineFormData> }) =>
                disciplinesService.updateDiscipline(id, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [DISCIPLINE_QUERY_KEY, 'list'] });
            },
        });

    const useDeleteDiscipline = () =>
        useMutation({
            mutationFn: (id: string) => disciplinesService.deleteDiscipline(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [DISCIPLINE_QUERY_KEY, 'list'] });
            },
        });

    return {
        useListDisciplines,
        useGetDisciplineById,
        useCreateDiscipline,
        useUpdateDiscipline,
        useDeleteDiscipline,
    };
}