package br.com.techtins.contaquiz.dto.response;

import java.util.List;

public record PaginatedResponse<T>(
    List<T> items,
    int page,
    int limit,
    long total,
    int totalPages
) {
}
