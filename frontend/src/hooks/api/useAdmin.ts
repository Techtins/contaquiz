'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/services/apiConnect';

const ADMIN_QUERY_KEY = 'adminStats';

export function useAdmin() {
    const useGetStats = () =>
        useQuery({
            queryKey: [ADMIN_QUERY_KEY, 'stats'],
            queryFn: async () => {
                const { data } = await api.get('/admin/stats');
                return data.data;
            },
        });

    return { useGetStats };
}

export default useAdmin();
