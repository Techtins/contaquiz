export interface ListParams {
    page?: number;
    limit?: number;
    filter?: string;
    active?: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}